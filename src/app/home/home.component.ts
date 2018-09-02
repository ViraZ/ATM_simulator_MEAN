import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AtmService } from '../atm.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild('f') loginform: NgForm;
    private cards;
    private i_Card;
    private i_Pin;
    constructor(
        private atmService: AtmService,
         private router: Router
        // private authService: AuthService,
    ) { }
    ngOnInit() {
    }

    onSubmit() {
        this.i_Card = this.loginform.value.userData.cardNumber.toString();
        this.i_Pin = this.loginform.value.userData.pin.toString();

        if (this.validateLength(this.i_Card, this.i_Pin)) {
            this.atmService.getCardInfo(this.i_Card).subscribe(

                (response) => {
                    const res = response.json();
                    console.log(res);
                    localStorage.setItem('card_num', this.i_Card );
                    if (this.i_Card === res.cards.card_number && this.i_Pin === res.cards.pin.toString()) {
                        console.log('user authenticated');

                         this.router.navigate(['/withdraw']);
                    } else {
                        console.log('Not authenticated');
                         this.router.navigate(['']);
                    }
                },
                (error) => console.log(error)
            );
        } else {
            alert('Invalid Credentials!!');
            this.loginform.resetForm();
             this.router.navigate(['']);
        }
    }

    validateLength(userCard, userPin) {
        if (userCard.length === 16 && userPin.length === 4) {
            return true;
        } else {
            return false;
        }
    }
}
