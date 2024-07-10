import { Component} from '@angular/core';
import { Master, Nutricionista, Paciente } from './../models/structures';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  codigoInserido: number = 0;

  constructor(
    private authService: AuthService
  ) { }

  async verificarCodigo() {
    await this.authService.verificarCodigo(this.codigoInserido);
  }

}