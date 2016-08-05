import {Component,OnInit} from '@angular/core';
import {NavController,NavParams,Modal,Storage,LocalStorage,Toast,Loading} from 'ionic-angular';
import {Http,Headers,HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map';

import {City} from '../home/city';
import {Add} from '../home/add';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  citys;
  public city = {
    cityId: '',
    cityUpdate: '',
    cityName: '',
    cityWeather: '',
    cityTemp: '',
    cityRH: '',
    cityPres: '',
    cityAqiPm25: '',
    cityAqiQlty: '',
    cityAqi: '',
    wind: ''
  };
  local: Storage;
  constructor(private http: Http, private navCtrl: NavController) {
    this.navCtrl = navCtrl;
    this.local = new Storage(LocalStorage);
    this.local.get('citys').then((result) => {
      this.citys = JSON.parse(result);
      // console.log(this.citys);

    });
    // this.citys=[
    //   {'cityId':0,'cityName':'Beijing',"cityTemp":'19°','cityRH':'54'},
    //   {'cityId':1,'cityName':'Shanghai',"cityTemp":'23°','cityRH':'66'},
    //   {'cityId':2,'cityName':'Hangzhou',"cityTemp":'33°','cityRH':'54'},
    //   {'cityId':3,'cityName':'Ningbo',"cityTemp":'30°','cityRH':'70'},
    //   ];

  }

  onPageDidEnter() {
    // console.log("this.citys.length==0");
    if (this.citys == null) {
      // console.log("this.citys.length==0");
      let toast = Toast.create({
        message: '当前没有城市天气信息，点击右上方添加！',
        duration: 2000,
        position: 'middle',
        cssClass: 'textAlignCenter'
      });
      this.navCtrl.present(toast);
    } else {

    }
  }
  cityShow(event, city) {
    this.navCtrl.push(City, { city: city });
  }
  addCity() {
    let modal = Modal.create(Add);
    modal.onDismiss(data => {
      this.citys = data;
    });
    this.navCtrl.present(modal);
  }
  doRefresh(refresher) {
    var url = "http://apis.baidu.com/heweather/weather/free?city=";
    var apikey = '84f6725a95519ce2b95197f7f75a4df2';
    var header = new Headers();
    header.append('apikey', apikey);
    for (var i = 0; i < this.citys.length; i++) {
      this.http.get(url + this.citys[i].cityName, { headers: header }).map(res => res.json()).subscribe(data => {
        var results = data['HeWeather data service 3.0'][0];
        var refreshCityId = results.basic.id;
        for (var i = 0; i < this.citys.length; i++) {
          if (refreshCityId == this.citys[i].cityId) {
            this.citys[i].cityId = results.basic.id;
            this.citys[i].cityName = results.basic.city;
            this.citys[i].cityUpdate = results.basic.update.loc;
            this.citys[i].cityTemp = results.now.tmp;
            this.citys[i].cityRH = results.now.hum;
            this.citys[i].cityWeather = results.now.cond.txt;
            this.citys[i].cityPres = results.now.pres;
            this.citys[i].cityAqiPm25 = results.aqi.city.pm25;
            this.citys[i].cityAqiQlty = results.aqi.city.qlty;
            this.citys[i].cityAqi = results.aqi.city.aqi;
            this.citys[i].wind = results.now.wind.dir;
            // console.log(new Date());
            // console.log(this.city[i]);
          }
          this.local.set('citys', JSON.stringify(this.citys));

        }
        let toastSuccess = Toast.create({
          message: '更新成功!',
          duration: 500,
          position: 'middle'
        });
        this.navCtrl.present(toastSuccess);
      }, error => {
        // console.log('更新失败！');
        let toastError = Toast.create({
          message: '更新失败!',
          duration: 500,
          position: 'middle'
        });

        this.navCtrl.present(toastError);
      });
    }
    // console.log(this.citys);
    this.local.set('citys', JSON.stringify(this.citys));
    refresher.complete();
  }
  delete(city) {
    for (var i = 0; i < this.citys.length; i++) {
      if (this.citys[i] == city) {
        this.citys.splice(i, 1);
      }
    }
    this.local.set('citys', JSON.stringify(this.citys));
  }
}