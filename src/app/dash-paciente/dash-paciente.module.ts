import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { DashPacienteRoutingModule } from './dash-paciente-routing.module';
import { DashPacienteComponent } from './dash-paciente.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgChartsModule,
    DashPacienteRoutingModule,
  ],
  declarations: [DashPacienteComponent],
})
export class DashPacienteModule {}