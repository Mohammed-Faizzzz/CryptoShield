pragma solidity ^0.5.0;

interface ITicketing {
    function seatToOwner(uint seatNumber) external view returns (address);
}

contract VerifyTicket {
    ITicketing ticketingContract;

    constructor(address _ticketingContractAddress) {
        ticketingContract = ITicketing(_ticketingContractAddress);
    }

    function isTicketValid(uint seatNumber, address owner) public view returns (bool) {
        address ownerOfSeat = ticketingContract.seatToOwner(seatNumber);
        return ownerOfSeat == owner;
    }
}
