import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  },
  {
    path: 'register-user',
    loadChildren: () => import('./register-user/register-user.module').then( m => m.RegisterUserModule)
  },
  {
    path: 'dash-master',
    loadChildren: () => import('./dash-master/dash-master.module').then( m => m.DashMasterModule)
  },
  {
    path: 'dash-nutri',
    loadChildren: () => import('./dash-nutri/dash-nutri.module').then( m => m.DashNutriModule)
  },
  {
    path: 'dash-paciente',
    loadChildren: () => import('./dash-paciente/dash-paciente.module').then( m => m.DashPacienteModule)
  },
  {
    path: 'mgt-paciente',
    loadChildren: () => import('./mgt-paciente/mgt-paciente.module').then( m => m.MgtPacienteModule)
  },
  {
    path: 'anamnese',
    loadChildren: () => import('./anamnese/anamnese.module').then( m => m.AnamneseModule)
  },
  {
    path: 'relato',
    loadChildren: () => import('./relato/relato.module').then( m => m.RelatoModule)
  },
  {
    path: 'detalhe-relato',
    loadChildren: () => import('./detalhe-relato/detalhe-relato.module').then( m => m.DetalheRelatoModule)
  },
  {
    path: 'evolucao',
    loadChildren: () => import('./evolucao/evolucao.module').then( m => m.EvolucaoModule)
  },
  {
    path: 'pesquisa-alimento',
    loadChildren: () => import('./pesquisa-alimento/pesquisa-alimento.module').then( m => m.PesquisaAlimentoModule)
  },
  {
    path: 'plano-alimentar',
    loadChildren: () => import('./plano-alimentar/plano-alimentar.module').then( m => m.PlanoAlimentarModule)
  },
  {
    path: 'detalhe-plano',
    loadChildren: () => import('./detalhe-plano/detalhe-plano.module').then( m => m.DetalhePlanoModule)
  },
  {
    path: 'custom-ref',
    loadChildren: () => import('./custom-ref/custom-ref.module').then( m => m.CustomRefModule)
  },
  {
    path: 'prontuario',
    loadChildren: () => import('./prontuario/prontuario.module').then( m => m.ProntuarioModule)
  },
  {
    path: 'indicadores',
    loadChildren: () => import('./indicadores/indicadores.module').then( m => m.IndicadoresModule)
  },
  {
    path: 'perfil-paciente',
    loadChildren: () => import('./perfil-paciente/perfil-paciente.module').then( m => m.PerfilPacienteModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
