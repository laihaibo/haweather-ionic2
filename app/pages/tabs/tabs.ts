import {Component,Injectable,ViewChild} from '@angular/core';
import {HomePage} from '../home/home';
import {AboutPage} from '../about/about';
import {Tabs} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef:Tabs;

  private tab1Root: any;
  private tab2Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
  }

  ionViewDidEnter(){
    this.tabRef.select(0);
  }
}
