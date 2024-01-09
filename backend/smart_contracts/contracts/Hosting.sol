// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Hosting {
    address public owner; // Address of the contract owner

    struct Event {
        string eventName;
        uint256 numberOfTickets;
        uint256 ticketPrice;
        address xrplWallet;
        address ethereumAddress;
        bool isActive; // Indicates if the event is active or not
    }

    Event[] public events; // List of hosted events

    constructor() public {
        owner = msg.sender; // Set the contract owner to the deployer's address
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this operation");
        _;
    }

    // Function to host a new event
    function createEvent(
        string calldata _eventName,
        uint256 _numberOfTickets,
        uint256 _ticketPrice,
        address _organiserXrplWallet,
        address _organiserEthWallet
    ) external onlyOwner {
        Event memory newEvent = Event({
            eventName: _eventName,
            numberOfTickets: _numberOfTickets,
            ticketPrice: _ticketPrice,
            organiserXrplWallet: _organiserXrplWallet,
            organiserEthWallet: _organiserEthWallet,
            isActive: true
        });

        events.push(newEvent);
    }

    // Function to get the total number of hosted events
    function getEventCount() external view returns (uint256) {
        return events.length;
    }

    // Function to get details of a specific event
    function getEventDetails(uint256 _eventId) external view returns (string memory, uint256, uint256, address, address, bool) {
        require(_eventId < events.length, "Event does not exist");
        Event memory eventToGet = events[_eventId];
        return (eventToGet.eventName, eventToGet.numberOfTickets, eventToGet.ticketPrice, eventToGet.organiserXrplWallet, eventToGet.organiserEthWallet, eventToGet.isActive);
    }

    // Function to sell tickets for a specific event
    function sellTickets(uint256 _eventId, uint256 _numberOfTickets) external payable {
        require(_eventId < events.length, "Event does not exist");
        Event storage eventToSell = events[_eventId];
        require(eventToSell.isActive, "Event is not active");
        require(_numberOfTickets > 0, "Number of tickets must be greater than zero");
        require(_numberOfTickets <= eventToSell.numberOfTickets, "Not enough tickets available");
        require(msg.value == _numberOfTickets * eventToSell.ticketPrice, "Incorrect payment amount");

        // Reduce the available tickets
        eventToSell.numberOfTickets -= _numberOfTickets;

        // Refund any excess payment
        if (msg.value > _numberOfTickets * eventToSell.ticketPrice) {
            address(msg.sender).transfer(msg.value - _numberOfTickets * eventToSell.ticketPrice);
        }
    }
}
