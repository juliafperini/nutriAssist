import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProntuarioComponent } from './prontuario.component';

const routes: Routes = [
  {
    path: ':codigoAcesso/:numPac',
    component: ProntuarioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProntuarioRoutingModule {}