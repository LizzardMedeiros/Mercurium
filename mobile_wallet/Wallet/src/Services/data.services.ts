import Web3 from 'web3';
export class DataService{
	private web3;
	private account;
	private abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "orderToOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "user",
      "outputs": [
        {
          "name": "available",
          "type": "bool"
        },
        {
          "name": "isDeliverer",
          "type": "bool"
        },
        {
          "name": "created",
          "type": "uint256"
        },
        {
          "name": "positive_reputations",
          "type": "uint32"
        },
        {
          "name": "negative_reputations",
          "type": "uint32"
        },
        {
          "name": "order_count",
          "type": "uint32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "order_list",
      "outputs": [
        {
          "name": "sender",
          "type": "address"
        },
        {
          "name": "deliverer",
          "type": "address"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "reputation_value",
          "type": "uint8"
        },
        {
          "name": "weight",
          "type": "uint32"
        },
        {
          "name": "price",
          "type": "uint256"
        },
        {
          "name": "created",
          "type": "uint256"
        },
        {
          "name": "updated",
          "type": "uint256"
        },
        {
          "name": "expected",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "balance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "guarantees",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "status",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "order_id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "node",
          "type": "address"
        }
      ],
      "name": "OrderStatusChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "NewOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_dimension",
          "type": "uint16[3]"
        },
        {
          "name": "_weight",
          "type": "uint32"
        },
        {
          "name": "_reputation_value",
          "type": "uint8"
        },
        {
          "name": "_price",
          "type": "uint256"
        },
        {
          "name": "_description",
          "type": "string"
        },
        {
          "name": "_coords",
          "type": "uint32[4]"
        }
      ],
      "name": "newOrder",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_order_id",
          "type": "uint256"
        }
      ],
      "name": "cancelOrder",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "registerAsDeliverer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_order_id",
          "type": "uint256"
        },
        {
          "name": "_prevision_date",
          "type": "uint256"
        }
      ],
      "name": "acceptOrder",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_order_id",
          "type": "uint256"
        }
      ],
      "name": "getOrdersDetailsById",
      "outputs": [
        {
          "name": "o_coords",
          "type": "uint32[]"
        },
        {
          "name": "o_dimensions",
          "type": "uint16[]"
        },
        {
          "name": "o_timer",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getOrdersByOwner",
      "outputs": [
        {
          "name": "o_id",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_order_id",
          "type": "uint256"
        }
      ],
      "name": "setOrderComplete",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
	private addr_contract = "0xf12b5dd4ead5f743c6baa640b0216200e89b60da";
	public contractInstance;
	public from = [];

	constructor(){
		if(typeof this.web3 !== 'undefined'){
			this.web3 = new Web3(this.web3.currentProvider);
		}else{
			this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
		}
		this.contractInstance = new this.web3.eth.Contract(this.abi, this.addr_contract);

	}
	createNewAccount(){
		this.account = this.web3.eth.accounts.create(this.web3.utils.randomHex(32));
	}
	setAccountByPrivateKey(entry: string){
		this.account = this.web3.eth.accounts.privateKeyToAccount('0x'+entry);
	}
	getEthBalance(){
		return this.web3.eth.getBalance(this.account.address);
	}
	getWeb3(){
		return this.web3;
	}
	getAccount(){
		return this.account;
	}

	testOrder(){
		this.contractInstance.methods.newOrder([0,0,0], 10, 10, 5, "desc", [0,0,0,0]).send({from: this.account.address, gas:2000000}, console.log);
	}

	//---------------------------------
	sendNewOrder(width: any, height: any, depth: any, weight: any, price: any, reputation: any, description: string){
		let dim = [width, height, depth];
		let coord = this.from.concat([0,0]);

		this.contractInstance.methods.newOrder(dim, weight, price, reputation, description, coord).send({from: this.account.address, gas:2000000}, console.log);
	}

	setLocation(lat, long){
		var tmp = [lat, long];
		this.from = tmp;
		console.log(tmp);
	}
}