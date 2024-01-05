// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Ticketing {
    address public organizer;
    uint public ticketPrice;
    uint public totalTickets;
    uint public ticketsSold;
    mapping(address => uint) public ticketsBought;

    constructor(uint _ticketPrice, uint _totalTickets) public {
        organizer = msg.sender;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        ticketsSold = 0;
    }

    function buyTicket(uint quantity) public payable {
        require(msg.value == (ticketPrice * quantity), "Incorrect payment");
        require(ticketsSold + quantity <= totalTickets, "Not enough tickets");

        ticketsSold += quantity;
        ticketsBought[msg.sender] += quantity;
    }

    function getRefund() public {
        uint tickets = ticketsBought[msg.sender];
        require(tickets > 0, "No tickets to refund");

        ticketsBought[msg.sender] = 0;
        ticketsSold -= tickets;
        msg.sender.transfer(tickets * ticketPrice);
    }
}
