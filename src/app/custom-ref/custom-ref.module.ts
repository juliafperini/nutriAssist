import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomRefRoutingModule } from './custom-ref-routing.module';
import { CustomRefComponent } from './custom-ref.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomRefRoutingModule,
    NgChartsModule,
  ],
  declarations: [CustomRefComponent],
})
export class CustomRefModule {}