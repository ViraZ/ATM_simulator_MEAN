import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AtmService {
    dispensed_money = [];
    error_message: string;

    constructor(private http: Http) {
    }

    getCardInfo(cardNum: Number) {
        // const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3000/cards/' + cardNum);
    }

    getBalance(cardNum: Number) {
        // const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3000/cards/' + cardNum);
    }

    updateBalance(cardNum: Number, amt: string) {
        const s_Amt = amt.toString();

        return this.http.patch('http://localhost:3000/cards/' + cardNum, {'balance': s_Amt});
    }

    getDenomination() {
        return this.http.get('http://localhost:3000/atm');
    }

    updateDenomination(twothousands_notes?, fivehundreds_notes?, hundreds_note?) {
        const h_notes = hundreds_note.toString();
        const f_notes = fivehundreds_notes.toString();
        const tt_notes = twothousands_notes.toString();
        return this.http.patch('http://localhost:3000/atm', {'hundreds': h_notes, 'fivehundreds': f_notes, 'twothousands': tt_notes });
    }

    storeErrorMsg(msg?) {
        this.error_message = msg;
    }
    getErrorMsg() {
        return this.error_message;
    }

    storeDebitAmt(amt: string) {
        const s_Amt = amt.toString();
        return this.http.post('http://localhost:3000/transactions', {'debit_amt': s_Amt });
    }

    storeDispensedDenomination(hundreds_note?, fivehundreds_notes?, twothousands_notes?) {
        this.dispensed_money[0] = twothousands_notes;
        this.dispensed_money[1] = fivehundreds_notes;
        this.dispensed_money[2] = hundreds_note;
        console.log(this.dispensed_money);
    }

    getDispensedDenomination() {
        return this.dispensed_money;
    }

}
