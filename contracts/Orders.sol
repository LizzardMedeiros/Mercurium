pragma solidity ^0.4.19;

import "./Mercurium.sol";

/**
 * The Orders contract does this and that...
 */
contract Orders is MercuriumToken{

	enum Status {Pendente, Transito, Entregue, Cancelado}

	struct User{
		bool available;
		bool isDeliverer;
		uint created;
		uint32 positive_reputations;
		uint32 negative_reputations;
		uint32 order_count;
	}
	
	struct Order {
		address sender;
		address deliverer;		
		string description;
		uint8 status;
		uint8 reputation_value;
		uint16[3] dimension;
		uint32 weight;
		int32[4] coords;
		uint price;
		uint created;
		uint updated;
		uint expected;
	}

	Order[] public order_list;
	mapping (address => User) public user;
	mapping (uint => address) public orderToOwner;

	//Modificadores
	modifier onlyCurrentDeliverer(uint order_id) {
    	require(msg.sender == order_list[order_id].deliverer);
    	_;
  	}
  	modifier onlyDeliverer() {
  		require (user[msg.sender].isDeliverer); 
  		_; 
  	}
  	modifier onlyOrderOwner(uint order_id) { 
  		require (order_list[order_id].sender == msg.sender); 
  		_; 
  	}
  	
  	//-------------------------Funções-----------------------
	function newOrder (uint16[3] _dimension, uint32 _weight, uint8 _reputation_value, uint256 _price, string _description, int32[4] _coords) hasEnough(_price) public {

		if(user[msg.sender].created == 0) user[msg.sender].created = now;

		balance[msg.sender] -= _price;
		guarantees[msg.sender] += _price;

		uint order_id = order_list.push(Order(
			msg.sender, //Sender
			address(0x0), //Deliverer
			_description,
			uint8(Status.Pendente), //Status pendente
			_reputation_value, //Reputation offered
			_dimension, //Object
			_weight,
			_coords, 
			_price,
			now, //Created
			now, //Updated
			0 //Deadline
		)) - 1;

		orderToOwner[order_id] = msg.sender;
		user[msg.sender].order_count++;

		emit NewOrder(order_id);
	}

	function cancelOrder (uint _order_id) onlyOrderOwner(_order_id) public {
		require (order_list[_order_id].status == uint8(Status.Pendente));
		require (guarantees[msg.sender] >= order_list[_order_id].price);
		
		guarantees[msg.sender] -= order_list[_order_id].price;
		balance[msg.sender] += order_list[_order_id].price;

		order_list[_order_id].status = uint8(Status.Cancelado);

		emit OrderStatusChanged(uint8(Status.Cancelado), _order_id, msg.sender);
	}

  	function registerAsDeliverer() public {
  		require (user[msg.sender].isDeliverer == false);
  		
  		user[msg.sender].isDeliverer = true;
  	}
	
	function acceptOrder(uint _order_id, uint _prevision_date) onlyDeliverer public {
 
		require (user[msg.sender].available);
		
		order_list[_order_id].deliverer = msg.sender;
		order_list[_order_id].updated = now;
		order_list[_order_id].expected = _prevision_date;
		order_list[_order_id].status = uint8(Status.Transito);

		user[msg.sender].available = false;
	}

	function getOrdersDetailsById(uint _order_id) external view returns(int32[] memory o_coords, uint16[] memory o_dimensions, uint[] memory o_timer){
		o_coords = new int32[](order_list[_order_id].coords.length);
		o_dimensions = new uint16[](order_list[_order_id].dimension.length);
		o_timer = new uint[](3);

		for(uint i=0; i<order_list[_order_id].coords.length; i++) o_coords[i] = order_list[_order_id].coords[i];
		for(i=0; i<order_list[_order_id].dimension.length; i++) o_dimensions[i] = order_list[_order_id].dimension[i];

		o_timer[0] = order_list[_order_id].created;
		o_timer[1] = order_list[_order_id].updated;
		o_timer[2] = order_list[_order_id].expected;

		return(o_coords, o_dimensions, o_timer);
	}

	function getOrdersByOwner (address _owner) external view returns(uint[] memory o_id){
		o_id = new uint[](user[_owner].order_count);
		uint counter = 0;
		for(uint i=0; i<order_list.length; i++){
			if(orderToOwner[i] == _owner){
				o_id[counter] = i;
				counter++;
			}
		}
		return (o_id);
	}
	
	function setOrderComplete (uint _order_id) onlyOrderOwner(_order_id) public {
		require (order_list[_order_id].status < uint8(Status.Entregue));

		order_list[_order_id].status = uint8(Status.Entregue);
		order_list[_order_id].updated = now;

		address deliverer_addr = order_list[_order_id].deliverer;
		//Estabelece um ponto de reputação
		user[deliverer_addr].positive_reputations += order_list[_order_id].reputation_value;

		//Executa o pagamento
		guarantees[msg.sender] -= order_list[_order_id].price;
		balance[deliverer_addr] += order_list[_order_id].price;
		user[deliverer_addr].available = true;	

		emit OrderStatusChanged(uint8(Status.Entregue), _order_id, deliverer_addr);
	}
	
	//Events
	event OrderStatusChanged(uint8 status, uint order_id, address indexed node);
	event NewOrder(uint id);
}