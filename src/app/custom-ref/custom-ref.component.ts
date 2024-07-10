import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { AlertController, Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NutriService } from '../services/nutri.service';
import { Alimento, AlimentoRef, Nutricionista, Paciente, PlanoAlimentar, Refeicao } from '../models/structures';
import { AlimentoService } from '../services/alimento.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-custom-ref',
  templateUrl: './custom-ref.component.html',
  styleUrls: ['./custom-ref.component.scss'],
})
export class CustomRefComponent {

  chartNutrientes: Chart<'bar', number[], string> | null = null;
  proteina: number = 0;
  lipidios: number = 0;
  carbo: number = 0;
  caloria: number = 0;
  
  planoAlimentar: PlanoAlimentar | null = null;
  nutricionista: Nutricionista = new Nutricionista();
  planoAlimentarCalc: PlanoAlimentar = new PlanoAlimentar();
  refeicao: Refeicao = new Refeicao();
  paciente: Paciente | null = null;
  nutriExiste: boolean = false;
  refeicoes: Refeicao[] = [];

  refeicaoCalc: Refeicao = new Refeicao();
  refeicoesCalc: Refeicao[] = [];

  listaAlimentos: Alimento[] = [];
  listaDesc: string[] = [];
  alimentosRefSelecionados: AlimentoRef[] =[];
  macros: boolean =false;

  listaGrupos: string[] = ['Cereais e derivados', 
  'Verduras, hortaliças e derivados',
  'Frutas e derivados',
  'Gorduras e óleos',
  'Pescados e frutos do mar',
  'Carnes e derivados',
  'Leite e derivados',
  'Bebidas (alcoólicas e não alcoólicas)', 
  'Ovos e derivados',
  'Produtos açucarados',
  'Miscelâneas','Outros alimentos industrializados',
  'Alimentos preparados','Leguminosas e derivados','Nozes e sementes'];

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      this.refresh();
      event.target.complete();
    }, 2000);
  }

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private platform: Platform,
    private authService: AuthService,
    private nutriService: NutriService,
    private alimentoService: AlimentoService,
  ) {

    this.route.paramMap.subscribe(async paramMap => {
      const pacienteNumPacString = paramMap.get('numPac');

      if (pacienteNumPacString) {
        const pacienteNumPac = parseInt(pacienteNumPacString); // Converte a string para número

        if (!isNaN(pacienteNumPac)) {
          // Obter paciente
          this.paciente = await this.pacienteService.obterPacientePorNumPac(pacienteNumPac);
          
        } else {
          console.error('O número do paciente não é válido.');
        }
      }
    });

    this.route.paramMap.subscribe(paramMap => {
      const codigoNutri = paramMap.get('codNutri');
  
      if (codigoNutri) {
          const codigoNutriNumber = Number(codigoNutri); // Convertendo para número
          this.carregarDadosNutri(codigoNutriNumber);
      }
    });

    this.carregarListaAlimentos();;
    this.carregarListaDescAl();
   }

  carregarDadosNutri(codigoNutri: number): void {
    this.nutriService.obterNutriPorCodigo(codigoNutri)
      .then((data: Nutricionista | null) => {
        if (data) {
          this.atualizarDadosNutri(data);
          this.carregarUltimoPlanoAlimentar();
          console.log('Dados do nutri atualizado:', data);
        } else {
          console.log('Nenhum nutri cadastrado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao obter dados do nutricionista:', error);
      });
  }

  atualizarDadosNutri(data: Nutricionista): void {
    this.nutricionista = data;
    this.nutriExiste = true;
  }

  carregarUltimoPlanoAlimentar() {
    if (this.paciente) {
      this.planoAlimentar = this.paciente.planoAlimentar[this.paciente.planoAlimentar.length - 1]; // Atribui o relato da última posição do array à variável
      this.refeicoes = this.planoAlimentar.refeicoes;
    } else {
      this.planoAlimentar = null; 
    }
    console.log('this.ultimoPlanoAlimentar ',this.planoAlimentar);
  }

  gerarRefeicoes() {
    this.refeicoes = [];
    if (this.planoAlimentarCalc.qntRef !== null && this.planoAlimentarCalc.qntRef !== undefined) {
      for (let i = 0; i < this.planoAlimentarCalc.qntRef; i++) {
        this.refeicoes.push(new Refeicao());
      }
    }
  }

  adicionarRefeicao() {
    this.refeicoes.push(new Refeicao());
  }

  adicionarAlimentoRef(j: number, quant: number, alimDesc: string): void {this.refeicaoCalc.caloriaRef += Math.round(this.refeicaoCalc.alimentosRef[j].caloriaAlim);
        const alimentoSelecionado = this.listaAlimentos.find(alimento => alimento.descricao.trim() === alimDesc.trim());
        console.log('alimentoSelecionado ', alimentoSelecionado);
        if (alimentoSelecionado) {
          console.log('Entrei no alimentoSelecionado');
          this.refeicaoCalc.alimentosRef[j] = {
              idAlimRef: j,
              idRefeicao: 0,
              quantAlimento: quant,
              alimentoFonte: 'calc',
              alimentoDesc: alimentoSelecionado.descricao,
              alimentoGrupo: alimentoSelecionado.grupo,
              caloriaAlim: Math.round(((quant*alimentoSelecionado.caloria)/100)* 10)/10,
              proteinaAlim: Math.round(((quant*alimentoSelecionado.proteina)/100)* 10)/10,
              carbAlim: Math.round(((quant*alimentoSelecionado.carbo)/100)* 10)/10,
              lipAlim: Math.round(((quant*alimentoSelecionado.lipidios)/100)* 10)/10,
              substituto: false}
            console.log('this.refeicoes.alimentosRef[',j,']: ', this.refeicaoCalc.alimentosRef[j])
         }

      this.refeicaoCalc.caloriaRef += Math.round(this.refeicaoCalc.alimentosRef[j].caloriaAlim);
      this.refeicaoCalc.proteinaRef += Math.round(this.refeicaoCalc.alimentosRef[j].proteinaAlim);
      this.refeicaoCalc.carboRef += Math.round(this.refeicaoCalc.alimentosRef[j].carbAlim);
      this.refeicaoCalc.lipRef += Math.round(this.refeicaoCalc.alimentosRef[j].lipAlim);

      this.planoAlimentarCalc.caloriaTotal+=Math.round(this.refeicaoCalc.alimentosRef[j].caloriaAlim);
      this.planoAlimentarCalc.proteinaTotal+=Math.round(this.refeicaoCalc.alimentosRef[j].proteinaAlim);
      this.planoAlimentarCalc.lipidiosTotal+=Math.round(this.refeicaoCalc.alimentosRef[j].lipAlim);
      this.planoAlimentarCalc.carboTotal+=Math.round(this.refeicaoCalc.alimentosRef[j].carbAlim);

      console.log('this.refeicoes.alimentosRef[',j,'].caloriaAlim: ', this.refeicaoCalc.alimentosRef[j].caloriaAlim)
      console.log('this.refeicao.caloriaRef: ', this.refeicaoCalc.caloriaRef)
      this.renderizarGraficoNutrientes();
  }

  removerAlimento(j: number): void {
    if (j >= 0 && j < this.refeicaoCalc.alimentosRef.length) {
      const alimentoRemovido = this.refeicaoCalc.alimentosRef[j];

      if (alimentoRemovido && alimentoRemovido.substituto === false) {
          // Atualizar valores
          this.refeicaoCalc.caloriaRef -= Math.round(alimentoRemovido.caloriaAlim);
          this.refeicaoCalc.proteinaRef -= Math.round(alimentoRemovido.proteinaAlim);
          this.refeicaoCalc.carboRef -= Math.round(alimentoRemovido.carbAlim);
          this.refeicaoCalc.lipRef -= Math.round(alimentoRemovido.lipAlim);
          this.refeicao.caloriaRef -= Math.round(alimentoRemovido.caloriaAlim);

          // this.refeicao.caloriaRef -= Math.round(alimentoRemovido.caloriaAlim);
          // this.refeicao.proteinaRef -= Math.round(alimentoRemovido.proteinaAlim);
          // this.refeicao.carboRef -= Math.round(alimentoRemovido.carbAlim);
          // this.refeicao.lipRef -= Math.round(alimentoRemovido.lipAlim);

          this.planoAlimentarCalc.caloriaTotal -= Math.round(alimentoRemovido.caloriaAlim);
          this.planoAlimentarCalc.proteinaTotal -= Math.round(alimentoRemovido.proteinaAlim);
          this.planoAlimentarCalc.lipidiosTotal -= Math.round(alimentoRemovido.lipAlim);
          this.planoAlimentarCalc.carboTotal -= Math.round(alimentoRemovido.caloriaAlim);
      }

      this.refeicaoCalc.alimentosRef.splice(j, 1);

    } else {
        console.error('Índice inválido para remover alimento.');
    }
  }

  adicionarLinha(): void {
    this.refeicaoCalc.alimentosRef.push(new AlimentoRef());
  }

  filtrarAlimentosPorGrupo(alimentos: Alimento[], grupoSelecionado: string): Alimento[] {
    return alimentos.filter(alimento => alimento.grupo === grupoSelecionado);
  }

  async carregarListaDescAl() {
    try {
      const grupos = await this.alimentoService.obterDescAl();
      if (grupos) {
        this.listaDesc = grupos;
      }
    } catch (error) {
      console.error('Erro ao carregar lista de grupos:', error);
    }
  }

  carregarListaAlimentos() {
    this.alimentoService.obterAlimentos().subscribe((alimentos) => {
      this.listaAlimentos = alimentos;
    });
  }

  //GRAFICOS

  renderizarGraficoNutrientes(): void {
    try {
      const ctx = document.getElementById('chartNutrientes') as HTMLCanvasElement | null;

      this.proteina = this.refeicaoCalc.proteinaRef || 0;
      this.lipidios = this.refeicaoCalc.lipRef || 0;
      this.carbo = this.refeicaoCalc.carboRef || 0;
  
      if (ctx) {
        // Verifica se há um gráfico anterior e o destrói
        if (this.chartNutrientes) {
          this.chartNutrientes.destroy();
          
        }
  
        const labels = ['proteina', 'Carbo', 'Lipídios'];
        const valores = [this.proteina, this.carbo, this.lipidios];
  
        this.chartNutrientes = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '',
              data: valores,
              backgroundColor: [
                'rgba(255, 206, 86, 0.5)',
                '#9d56a4',
                'rgba(75, 192, 192, 0.5)',
              ],
              borderWidth: 0
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Erro ao renderizar gráfico:', error);
    }
  }

   refresh(): void {
    this.platform.ready().then(() => {
      window.location.reload();
    });
  }

  async sair(){
    try {
        await this.authService.logOut().then(() => {
        console.log('Logout executado');
        });
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    }
  }

}