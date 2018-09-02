import { Component, OnInit } from '@angular/core';
import { AtmService } from '../atm.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dispense-money',
    templateUrl: './dispense-money.component.html',
    styleUrls: ['./dispense-money.component.css']
})
export class DispenseMoneyComponent implements OnInit {
    money_balance;
    error_message;
    withdrw_money;
    dispensed_money = [];

    constructor(private atmService: AtmService,
                private router: Router
                // private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.dispensed_money = this.atmService.getDispensedDenomination();
        this.error_message = this.atmService.getErrorMsg();

        console.log('from dispense money comp' + this.error_message);

        this.withdrw_money = localStorage.getItem('withDraw_amt');
        this.money_balance = localStorage.getItem('new_bal');
    }

    onExit() {
        localStorage.clear();
        this.router.navigate(['']);


    }

}
