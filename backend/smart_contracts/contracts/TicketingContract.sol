pragma solidity ^0.5.0;

contract TicketingContract {
    address public owner;

    struct Event {
        address organiser;
        uint ticketPrice;
        uint maxQuantity;
        uint availableTickets;
        mapping(address => uint) ticketsPurchased;
    }

    mapping(address => Event) public events;

    event EventHosted(address indexed organiser, uint ticketPrice, uint maxQuantity, uint availableTickets);
    event TicketPurchased(address indexed buyer, uint quantity);

    constructor() public {
        owner = msg.sender; // The deployer (organizer) sets the initial organizer address
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    function hostEvent(uint _ticketPrice, uint _maxQuantity, uint _availableTickets) public onlyOwner {
        // Organizer can set the number of tickets
        // and the ticket price when hosting the event.
        Event storage newEvent = events[msg.sender];
        require(newEvent.organiser == address(0), "Event already hosted");
        newEvent.organiser = msg.sender;
        newEvent.ticketPrice = _ticketPrice;
        newEvent.maxQuantity = _maxQuantity;
        newEvent.availableTickets = _availableTickets;
        emit EventHosted(msg.sender, _ticketPrice, _maxQuantity, _availableTickets);
    }

    function purchaseTickets(uint _quantity) public payable {
        Event storage eventToPurchase = events[msg.sender];
        require(eventToPurchase.organiser != address(0), "Event does not exist");
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_quantity <= eventToPurchase.maxQuantity, "Exceeds maximum ticket limit");
        require(eventToPurchase.availableTickets + _quantity <= eventToPurchase.maxQuantity, "Not enough tickets available");
        uint totalCost = eventToPurchase.ticketPrice * _quantity;
        require(msg.value == totalCost, "Incorrect payment amount");

        eventToPurchase.ticketsPurchased[msg.sender] += _quantity;
        eventToPurchase.availableTickets += _quantity;

        emit TicketPurchased(msg.sender, _quantity);
    }

    function refundTickets(uint _quantity) public {
        Event storage eventToRefund = events[msg.sender];
        require(eventToRefund.organiser != address(0), "Event does not exist");
        require(eventToRefund.ticketsPurchased[msg.sender] >= _quantity, "Not enough tickets to refund");

        uint refundAmount = eventToRefund.ticketPrice * _quantity;

        eventToRefund.ticketsPurchased[msg.sender] -= _quantity;
        eventToRefund.availableTickets -= _quantity;

        msg.sender.transfer(refundAmount);
    }
}
