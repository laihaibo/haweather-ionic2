import {Component} from '@angular/core';
import {NavController,NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/city.html'
})

export class City {
    city;
    constructor(private params: NavParams) {
        this.city = params.data.city;
    }
}