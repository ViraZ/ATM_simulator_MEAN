import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DispenseMoneyComponent } from './dispense-money/dispense-money.component';
import { FormsModule } from '@angular/forms';
import { AtmService } from './atm.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WithdrawComponent,
    DispenseMoneyComponent
  ],
  imports: [
    BrowserModule,
      FormsModule,
      HttpModule,
      AppRoutingModule
  ],
  providers: [AtmService],
  bootstrap: [AppComponent]
})
export class AppModule { }
