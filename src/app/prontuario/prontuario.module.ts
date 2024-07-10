import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProntuarioRoutingModule } from './prontuario-routing.module';
import { ProntuarioComponent } from './prontuario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProntuarioRoutingModule,
  ],
  declarations: [ProntuarioComponent],
})
export class ProntuarioModule {}