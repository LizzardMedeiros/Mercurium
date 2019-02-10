import { Component } from '@angular/core';
import {NewOrderPage} from '../new-order/new-order';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { DataService } from '../../Services/data.services';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

	balance: string = "";
	eth_balance: string = "";
	order_list: any[] = [];
	order_status = {status:["Waiting", "Transit", "Completed", "Canceled"], style:["light", "", "Secondary", "danger"]};

	constructor(private navCtrl: NavController, private data: DataService, public alertCtrl: AlertController, public geoLoc: Geolocation) {	}

	setBalance(value:string){
		console.log(this.balance);
	}

	ionViewWillEnter(){
		var self = this;
		this.order_list = [];

		this.geoLoc.getCurrentPosition().then((resp) => {
			self.data.setLocation(resp.coords.latitude*10**5, resp.coords.longitude*10**5);
		}).catch((error) => {
			console.log('Error getting location', error);
		});


		//Balance
		this.data.getEthBalance().then(function(res){
			var total = parseInt(res)*10**(-18);
			self.eth_balance = total.toString().slice(0,5);
		});
    	this.data.contractInstance.methods.balance(this.data.getAccount().address).call().then(function(total){
    		self.data.contractInstance.methods.decimals().call().then(function(dec){
    			var c_value = parseInt(total)*10**(-parseInt(dec));
    			self.balance = c_value.toString().slice(0,5);
    		});
    	});
    	//User Orders id List
    	
    	this.data.contractInstance.methods.getOrdersByOwner(this.data.getAccount().address).call().then(function(list){
    		for(var i=0; i<list.length; i++){
    			self.data.contractInstance.methods.order_list(list[i]).call().then(function(res){
    				res.id = i;
    				self.order_list.push(res);
    			});
    		}
    	});

	}

	onTrack(id:string){
		this.data.contractInstance.methods.getOrdersDetailsById(id).call().then(function(data){
			console.log(data)
    	});
	}

	cancelOrder(id:number){
		this.data.contractInstance.methods.cancelOrder(id).send({from: this.data.getAccount().address, gas:2000000}, console.log);
		this.navCtrl.setRoot(this.navCtrl.getActive().component);
	}

	openNewOrder(){
		this.navCtrl.push(NewOrderPage);
	}

	onTest(){
		this.data.testOrder();
	}

}