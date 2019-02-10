import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataService } from '../../Services/data.services';

/**
 * Generated class for the NewOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-order',
  templateUrl: 'new-order.html',
})
export class NewOrderPage {

	private coords:[number, number, number, number];

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private dtService: DataService) {}

  sendOrder(order: {width: string, height: string, depth: string, weight: string, price: string, reputation: string, description: string, to:[number, number]}){
  	order.to = [0,0];
	let confirm = this.alertCtrl.create({
    	title: 'Please, confirm your order',
    	message: 'Dimensions: '+order.width+'X'+order.height+'X'+order.depth+
    			 '<br>Weight: '+order.weight+
    			 '<br>Price: '+ order.price+
    			 '<br>Reputation: '+order.reputation+
    			 '<br>Description: '+order.description,
    	buttons: [{
        	text: 'Cancel',
        	handler: () => {
        		console.log('Disagree clicked');
        	}
        },
        {
        	text: 'Confirm',
        	handler: () => {
            	this.dtService.sendNewOrder(order.width, order.height, order.depth, order.weight, order.price, order.reputation, order.description);
            	this.navCtrl.pop();
        	}
        }
    ]});
    confirm.present();
  }
}
