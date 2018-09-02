import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AtmService } from '../atm.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
    card_num;
    db_hundred;
    db_fivehundred;
    db_twothousands;

    cal_hundred_notes;
    cal_fivehundred_notes;
    cal_twothousands_notes;

    dif_100;
    dif_500;
    dif_2000;

    inputAmt;
    newBalnce;
    balanceFromServer;


    amtArray = [2000, 500, 100];
    resultArray = [];

    @ViewChild('f') loginform: NgForm;


    constructor(private atmService: AtmService,
                private router: Router
                // private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getAvailableDenofromDB();
    }


    onSubmit() {
        this.inputAmt = this.loginform.value.userData.amount;
        this.card_num = localStorage.getItem('card_num');

        if (this.validateAcceptableAmt(this.inputAmt)) {

            if (this.validateMaxAmt(this.inputAmt)) {

                this.atmService.getBalance(this.card_num).subscribe(
                    (response) => {
                        const res = response.json();
                        this.balanceFromServer = res.cards.balance;
                        console.log('balanceFromServer ', this.balanceFromServer);

                        if (this.balanceFromServer && this.balanceFromServer !== 0 &&
                            this.inputAmt < this.balanceFromServer) {

                            this.newBalnce = this.balanceFromServer - this.inputAmt;

                            localStorage.setItem('new_bal', this.newBalnce);
                            localStorage.setItem('withDraw_amt', this.inputAmt);

                            this.updateBalanceInDB(this.newBalnce);
                            this.updateDebitRecordInDB(this.inputAmt);


                            this.checkDenomination(this.inputAmt);

                            this.dif_100 = this.db_hundred - this.resultArray[2];
                            this.dif_500 = this.db_fivehundred - this.resultArray[1];
                            this.dif_2000 = this.db_twothousands - this.resultArray[0];

                            this.updateDenominationInDB(this.dif_2000, this.dif_500, this.dif_100);
                            this.router.navigate(['dispenseMoney']);
                        } else {
                            this.atmService.storeErrorMsg('Insufficient Balance in your Account!');
                            this.router.navigate(['dispenseMoney']);
                        }
                    },
                    (error) => console.log(error)
                );
            } else {
                this.atmService.storeErrorMsg('ATM Cash Limit exceeds.');
                this.router.navigate(['dispenseMoney']);
            }

        } else {
            this.atmService.storeErrorMsg('Invalid Amount!! Please enter an amount in the multiple of 100s');
            this.router.navigate(['dispenseMoney']);
        }
    }

    getAvailableDenofromDB() {
        this.atmService.getDenomination().subscribe(
            (response) => {

                const dbResponse = response.json();
                console.log(dbResponse);

                this.db_hundred = dbResponse.atm[0][100];
                this.db_fivehundred = dbResponse.atm[0][500];
                this.db_twothousands = dbResponse.atm[0][2000];

            },
            (error) => {
                console.log(error);
            }
        );
    }


    checkDenomination(total) {
        for (let i = 0; i < this.amtArray.length; i++) {
            this.resultArray.push(Math.floor(total / this.amtArray[i]));
            // Get the new total
            total = total % this.amtArray[i];
        }
        this.cal_twothousands_notes = this.resultArray[0];
        this.cal_fivehundred_notes = this.resultArray[1];
        this.cal_hundred_notes = this.resultArray[2];

        console.log('calculated amt : ' + '100 : ' +
            this.cal_hundred_notes + '   500 :  ' +
            this.cal_fivehundred_notes + '  2000 :  ' +
            this.cal_twothousands_notes);

        this.atmService.storeDispensedDenomination(
            this.cal_hundred_notes,
            this.cal_fivehundred_notes,
            this.cal_twothousands_notes);
    }

// Simple Difference only not putting  too much logic.


    updateBalanceInDB(amt) {

        this.atmService.updateBalance(this.card_num, amt)
            .subscribe(
                (response) => {
                    const res = response.json();
                    console.log(res);
                    localStorage.clear();
                    console.log('Bal updated');
                },
                (error) => console.log(error)
            );
    }

    updateDebitRecordInDB(amt) {
        this.atmService.storeDebitAmt(amt).subscribe(
            (response) => {
                const res = response.json();
                console.log(res);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    updateDenominationInDB(tt, f, h) {
        this.atmService.updateDenomination(tt, f, h).subscribe(
            (response) => {
                const res = response.json();
                console.log(res);
            },
            (error) => {
                console.log(error);
            }
        );
    }


    validateAcceptableAmt(inputAmt) {
        if (inputAmt < 100 || (inputAmt % 100) > 0) {
            return false;
        } else {
            return true;
        }
    }

    validateMaxAmt(inputAmt) {
        if (inputAmt > 20000) {
            return false;
        }
        return true;
    }
}

