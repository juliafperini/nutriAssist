import { Component } from '@angular/core';
import { Nutricionista, Paciente, PlanoAlimentar, Prontuario, Refeicao, Relato } from '../models/structures';
import { AuthService } from '../services/auth.service';
import { AlimentoService } from '../services/alimento.service';
import { NutriService } from '../services/nutri.service';
import { PacienteService } from '../services/paciente.service';
import { AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prontuario',
  templateUrl: './prontuario.component.html',
  styleUrls: ['./prontuario.component.scss'],
})
export class ProntuarioComponent {

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      // Any calls to load data go here
      this.refresh();
      event.target.complete();
    }, 2000);
  }

  mostrarBarraProgresso: boolean = false;
  public progress = 0;


  relatos: Relato[] = [];
  prontuarios: Prontuario[] = [];
  planos: PlanoAlimentar[] = [];
  refeicoes: Refeicao[] = [];

  nutriExiste: boolean = false;
  nutricionista: Nutricionista = new Nutricionista();
  prontuario: Prontuario = new Prontuario();
  ultimoProntuario: Prontuario | null = null;
  paciente: Paciente | null = null;
  planoSelect: PlanoAlimentar | null = null;

  resumoRelato: boolean = false;
  resumoPlanos: boolean = false;
  resumoPronts: boolean = false;
  dataPlano: string = '';
  dataAtual = new Date();

  constructor(
    private authService: AuthService,
    private router: Router,
    private nutriService: NutriService,
    private pacienteService: PacienteService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private platform: Platform,
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
      const codigoNutri = paramMap.get('codigoAcesso');

      if (codigoNutri) {
          const codigoNutriNumber = Number(codigoNutri); // Convertendo para número
          this.carregarDadosNutri(codigoNutriNumber);
      }
    });
  }

  carregarDadosNutri(codigoNutri: number): void {
    this.nutriService.obterNutriPorCodigo(codigoNutri)
      .then((data: Nutricionista | null) => {
        if (data) {
          this.atualizarDadosNutri(data);
          console.log('nutri:', this.nutricionista)
        } else {
          console.log('Nenhum nutri cadastrado.');
        }

        if(this.paciente?.relatos){
        this.carregarRelatos();
        }

        console.log('this.paciente?.prontuario carregar', this.paciente?.prontuarios)

        if(this.paciente?.prontuarios){
          this.carregarUltimoProntuario();
          this.carregarProntuarios();
        }
        if(this.paciente?.planoAlimentar){
          this.carregarPlanos();
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

  carregarPlanoSelec(data: string) {
    if (this.planos) {
      for (let i = 0; i < this.planos.length; i++) {
        if(this.planos[i].dataPlanoAlim.trim() === data.trim())
          this.planoSelect = this.planos[i];
          this.refeicoes = this.planos[i].refeicoes;
      }
    }
  }

  carregarRelatos() {
    if (this.paciente) {
      this.pacienteService.obterTodosRelatosPaciente(this.paciente.numPac)
        .then((relatos: Relato[]) => {
          this.relatos = relatos;
          console.log('this.relatos ',this.relatos)
        })
        .catch((error) => {
          console.error('Erro ao atualizar módulos do paciente:', error);
        });
    }
  }

  carregarProntuarios() {
    console.log('entrou this.prontuarios')
    if (this.paciente) {
      this.pacienteService.obterTodosProntuariosPaciente(this.paciente.numPac)
        .then((prontuarios: Prontuario[]) => {
          this.prontuarios = prontuarios;
          console.log('this.prontuarios', this.prontuarios)
        })
        .catch((error) => {
          console.error('Erro ao atualizar módulos do paciente:', error);
        });
    }
  }

  carregarPlanos() {
    if (this.paciente) {
      this.pacienteService.obterTodosPlanosPaciente(this.paciente.numPac)
        .then((planos: PlanoAlimentar[]) => {
          this.planos = planos;
          console.log('planos', this.planos)
        })
        .catch((error) => {
          console.error('Erro ao atualizar módulos do paciente:', error);
        });
    }
  }

  carregarUltimoProntuario() {
    if (this.paciente) {
      this.ultimoProntuario = this.paciente.prontuarios[this.paciente.prontuarios.length - 1]; // Atribui o relato da última posição do array à variável
    }
  }

  async atualizarProntuario(): Promise<void> {
    try {
      if (this.prontuario.descricao === '') {
          const alert = await this.alertController.create({
            header: '',
            message: 'Preencha o atendimento',
            buttons: ['OK']
          });
          await alert.present();
      } else if (this.paciente !== null) {
        this.mostrarBarraProgresso = true;
        this.progress = 0;
        await this.pacienteService.novoPronuario(this.prontuario, this.paciente, (percentage) => {
        this.progress = percentage;
        }); 
        const alert = await this.alertController.create({
          header: 'Prontuário',
          message: 'Prontuário atualizado',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/mgt-paciente', this.paciente.codNutri, this.paciente.numPac]);
      }
    } catch (error) {
      console.error('Erro ao adicionar prontuario:', error);
      if (this.paciente !== null) {
      this.router.navigate(['/mgt-paciente', this.paciente.codNutri, this.paciente.numPac]);
      }
    }
    this.progress = 0;
    this.mostrarBarraProgresso = false;
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

  refresh(): void {
    this.platform.ready().then(() => {
      window.location.reload();
    });
  }

}
