pragma solidity ^0.4.19;

/**
 * The base contract of Mercurium
 */
contract Mercurium {
	address public owner;

	modifier onlyOwner() { 
		require (msg.sender == owner); 
		_; 
	}

	constructor () public {
		owner = msg.sender;
	}

	function setOwner (address _newOwner) onlyOwner public {
		require (_newOwner != address(0x0));
		owner = _newOwner;
	}
	
}

contract MercuriumToken is Mercurium {

    string public name = "Mercurium";
    string public symbol = "MRC";
    uint8 public decimals = 7;
    uint256 public totalSupply = 10000000000000000; //100000000 coins total

    /* This creates an array with all balances */
    mapping (address => uint256) public balance;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (address => uint256) public guarantees;//Garantias para pagamento ou restituições (calção)
    
    modifier hasEnough(uint256 _value) { 
    	require (balance[msg.sender] > _value); 
    	_; 
    }

    constructor() public {
        balance[msg.sender] = totalSupply;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) hasEnough(_value) public {
    	require (_to != address(0x0) && balance[_to] + _value > balance[_to]);

        balance[msg.sender] -= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
}