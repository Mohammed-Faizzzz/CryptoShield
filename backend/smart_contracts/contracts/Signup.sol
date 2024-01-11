// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Signup {
    struct User {
        string xrplWalletAddress;
        bool isRegistered;
//        bool isOrganiser;
    }

    mapping(address => User) public users;

    // Function to register a new user
    function registerUser(string memory xrplWalletAddress) public {
        require(!users[msg.sender].isRegistered, "User already registered.");
        users[msg.sender] = User(xrplWalletAddress, true);
    }

    // Function to check if a user is registered
    function isUserRegistered(address userAddress) public view returns (bool) {
        return users[userAddress].isRegistered;
    }
}
