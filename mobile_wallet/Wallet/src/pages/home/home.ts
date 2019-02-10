import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController} from 'ionic-angular';

import {WelcomePage} from '../welcome/welcome';
import { DataService } from '../../Services/data.services';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private dataService: DataService, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  onRestore(){
	let prompt = this.alertCtrl.create({
	      title: 'Private Key',
	      message: "Enter the private key from account that you want to restore.",
	      inputs: [
	        {
	          name: 'private_key',
	          placeholder: 'A0EB135F...'
	        },
	      ],
	      buttons: [
	        {
	          text: 'Cancel',
	          handler: data => {}
	        },
	        {
	          text: 'Enter',
	          handler: data => {
	         	this.dataService.setAccountByPrivateKey(data.private_key);
				let loader = this.loadingCtrl.create({
				      content: "Please wait...",
				      duration: 3000
				    });
				loader.present();
	            loader.onDidDismiss(() => { this.navCtrl.push(WelcomePage); });
	          }
	        }
	      ]
	    });
    prompt.present();
  }

  onCreate(){
	this.dataService.createNewAccount();
	let loader = this.loadingCtrl.create({
		content: "Please wait...",
		duration: 3000
	});
	loader.present();
	loader.onDidDismiss(() => { this.navCtrl.push(WelcomePage); });
  }

  onConnect(value: string){
  	
  }
}
