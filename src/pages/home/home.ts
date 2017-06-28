import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { Http } from '@angular/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  debug = false;

  scanData: {};
  options: BarcodeScannerOptions;

  gotInformation: boolean;
  noData: boolean;
  title: string;
  attributes = [];

  httpData: string;

  constructor(public navCtrl: NavController, private scanner: BarcodeScanner, private http: Http) {
    this.gotInformation = false;
    this.noData = false;
  }
  scan() {
    this.options = {
      prompt: "Scan EAN-Code "
    }
    this.scanner.scan(this.options).then((barcodeData) => {

      this.getEANInfo(barcodeData.text);
      this.scanData = barcodeData;
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
  getEANInfo(ean: string) {
    //Example: https://api.outpan.com/v2/products/5099750442227?apikey=f66aa51fcf23bd8f9a867afc163b3c84
    this.http.get('https://api.outpan.com/v2/products/' + ean.trim() + "/?apikey=f66aa51fcf23bd8f9a867afc163b3c84").subscribe((response) => {
      let body = response.text();
      this.httpData = body;

      let res = JSON.parse(body);

      this.gotInformation = false;
      this.noData = false;
      this.attributes = [];

      if (res.name != null) {
        this.title = res.name;
        
        for (let name in res.attributes) {
          let text = res.attributes[name];
          this.attributes.push({ title: name, text: text });
          this.httpData += "<br>" + name + " " + text;
        }
        this.gotInformation = true;
      }else{
        this.noData = true;
      }

    }, (error) => {
      this.httpData = error;
    });
  }
}
