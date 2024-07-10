import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomRefComponent } from './custom-ref.component';

const routes: Routes = [
  {
    path: ':codNutri/:numPac',
    component: CustomRefComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomRefRoutingModule {}