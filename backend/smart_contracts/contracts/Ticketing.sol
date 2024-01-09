pragma solidity ^0.5.0;

contract Ticketing {
    address public owner;
    mapping(uint => address) public seatToOwner;
    mapping(address => uint) public ownerSeatCount;
    uint public price;
    uint public maxQuantity = 5; // Maximum number of tickets a user can buy

    event TicketPurchased(address indexed buyer, uint seatNumber, uint quantity);

    constructor(uint _price) {
        owner = msg.sender;
        price = _price;
    }

    function purchaseTickets(uint[] memory seatNumbers) public payable {
        require(seatNumbers.length <= maxQuantity, "Exceeds maximum ticket limit");
        uint totalCost = price * seatNumbers.length;
        require(msg.value == totalCost, "Incorrect payment amount");

        for(uint i = 0; i < seatNumbers.length; i++) {
            uint seatNumber = seatNumbers[i];
            require(seatToOwner[seatNumber] == address(0), "Seat already taken"); // Checks if that specific seat is allotted to someone else
            seatToOwner[seatNumber] = msg.sender; // Assigns the seat to the buyer
            emit TicketPurchased(msg.sender, seatNumber, seatNumbers.length);
        }
        ownerSeatCount[msg.sender] += seatNumbers.length;
    }

    function refundTicket(uint seatNumber) public {
        require(seatToOwner[seatNumber] == msg.sender, "Not ticket owner");
        seatToOwner[seatNumber] = address(0);
        ownerSeatCount[msg.sender]--;
        payable(msg.sender).transfer(price);
    }
}
