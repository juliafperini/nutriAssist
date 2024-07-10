import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Nutricionista, Paciente } from '../models/structures';
import { AuthService } from '../services/auth.service';
import { PacienteService } from '../services/paciente.service';
import { NutriService } from '../services/nutri.service';
import { AlertController, Platform } from '@ionic/angular';
import { LocalidadesService } from '../services/localidades.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dash-paciente',
  templateUrl: './dash-paciente.component.html',
  styleUrls: ['./dash-paciente.component.scss'],
})
export class DashPacienteComponent {

  mostrarBarraProgresso: boolean = false;
  public progress = 0;

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      // Any calls to load data go here
      this.refresh();
      event.target.complete();
    }, 2000);
  }

  // paciente: Paciente | null = null;
  paciente = {} as Paciente;
  nutricionista: Nutricionista = new Nutricionista();

  nutriExiste: boolean = false;

  constructor(
    private authService: AuthService,
    private pacienteService: PacienteService,
    private nutriService: NutriService,
    private alertController: AlertController,
    private localidadesService: LocalidadesService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private platform: Platform
  ) { 

    setInterval(() => {
      this.progress += 0.01;
      if (this.progress > 1) {
        setTimeout(() => {
        this.progress = 0;
        }, 1000);
      }
      }, 50);

      this.route.paramMap.subscribe(paramMap => {
        const codigoNutri = paramMap.get('codNutri');
    
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
          console.log('Dados do nutri atualizado:', data);
        } else {
          console.log('Nenhum nutri cadastrado.');
        }
        this.obterPaciente();
      })
      .catch((error) => {
        console.error('Erro ao obter dados do nutricionista:', error);
      });
  }

  atualizarDadosNutri(data: Nutricionista): void {
    this.nutricionista = data;
    this.nutriExiste = true;
  }

  async obterPaciente() {
    try {
      const paciente = await this.pacienteService.obterPacienteDash();
      if (paciente !== null) {
        this.paciente = paciente;
      } else {
        console.error('Paciente não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao obter o paciente:', error);
    }
  }

  obterProximoRelato(): string {
    if (this.paciente && this.paciente.relatos && this.paciente.relatos.length > 0) {
      const ultimoRelato = this.paciente.relatos[this.paciente.relatos.length - 1];
      if (ultimoRelato && ultimoRelato.diaRelatoPaciente) {
        return ultimoRelato.diaRelatoPaciente;
      }
    }
    return 'A definir';
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
