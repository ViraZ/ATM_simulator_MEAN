import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WithdrawComponent } from './withdraw/withdraw.component';
import { DispenseMoneyComponent } from './dispense-money/dispense-money.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'dispenseMoney', component: DispenseMoneyComponent },
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
