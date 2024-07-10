import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashPacienteComponent } from './dash-paciente.component';

const routes: Routes = [
  {
    path: ':codNutri/:numPac',
    component: DashPacienteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashPacienteRoutingModule {}