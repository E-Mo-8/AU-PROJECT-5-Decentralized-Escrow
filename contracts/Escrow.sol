// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

	bool public isApproved;


	constructor(address _arbiter, address _beneficiary) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Approved(uint);
	event Refunded(uint);

	function approve() external {
		require(msg.sender == arbiter);
		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Approve ailed to send Ether");
		emit Approved(balance);
		isApproved = true;
	}

	function refund() external {
		require(msg.sender == arbiter);
		uint balance = address(this).balance;
		(bool rfnd, ) = payable(depositor).call{value: balance}("");
 		require(rfnd, "Refund failed to send Ether");
		emit Refunded(balance);
		isApproved = false;
	}

	
}
