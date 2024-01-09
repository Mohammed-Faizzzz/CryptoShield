const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const router = express.Router();
const { exec } = require('child_process');
const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:7545');

const accountManagerABI = [
                              {
                                "constant": true,
                                "inputs": [
                                  {
                                    "internalType": "address",
                                    "name": "",
                                    "type": "address"
                                  }
                                ],
                                "name": "users",
                                "outputs": [
                                  {
                                    "internalType": "string",
                                    "name": "xrplWalletAddress",
                                    "type": "string"
                                  },
                                  {
                                    "internalType": "bool",
                                    "name": "isRegistered",
                                    "type": "bool"
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
                                    "internalType": "string",
                                    "name": "xrplWalletAddress",
                                    "type": "string"
                                  }
                                ],
                                "name": "registerUser",
                                "outputs": [],
                                "payable": false,
                                "stateMutability": "nonpayable",
                                "type": "function"
                              },
                              {
                                "constant": true,
                                "inputs": [
                                  {
                                    "internalType": "address",
                                    "name": "userAddress",
                                    "type": "address"
                                  }
                                ],
                                "name": "isUserRegistered",
                                "outputs": [
                                  {
                                    "internalType": "bool",
                                    "name": "",
                                    "type": "bool"
                                  }
                                ],
                                "payable": false,
                                "stateMutability": "view",
                                "type": "function"
                              }
                            ]; // The ABI for smart contract
const accountManagerAddress = '0x06d1D781F8cD9863AfD4bfc001eBe3557317621B';
const accountManagerContract = new web3.eth.Contract(accountManagerABI, accountManagerAddress);

const hostingContractABI = [
                               {
                                 "inputs": [],
                                 "payable": false,
                                 "stateMutability": "nonpayable",
                                 "type": "constructor"
                               },
                               {
                                 "constant": true,
                                 "inputs": [
                                   {
                                     "internalType": "uint256",
                                     "name": "",
                                     "type": "uint256"
                                   }
                                 ],
                                 "name": "events",
                                 "outputs": [
                                   {
                                     "internalType": "string",
                                     "name": "eventName",
                                     "type": "string"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "numberOfTickets",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "ticketPrice",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "address",
                                     "name": "xrplWallet",
                                     "type": "address"
                                   },
                                   {
                                     "internalType": "address",
                                     "name": "ethereumAddress",
                                     "type": "address"
                                   },
                                   {
                                     "internalType": "bool",
                                     "name": "isActive",
                                     "type": "bool"
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
                                     "internalType": "address",
                                     "name": "",
                                     "type": "address"
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
                                     "internalType": "string",
                                     "name": "_eventName",
                                     "type": "string"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "_numberOfTickets",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "_ticketPrice",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "address",
                                     "name": "_organiserXrplWallet",
                                     "type": "address"
                                   },
                                   {
                                     "internalType": "address",
                                     "name": "_organiserEthWallet",
                                     "type": "address"
                                   }
                                 ],
                                 "name": "createEvent",
                                 "outputs": [],
                                 "payable": false,
                                 "stateMutability": "nonpayable",
                                 "type": "function"
                               },
                               {
                                 "constant": true,
                                 "inputs": [],
                                 "name": "getEventCount",
                                 "outputs": [
                                   {
                                     "internalType": "uint256",
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
                                     "internalType": "uint256",
                                     "name": "_eventId",
                                     "type": "uint256"
                                   }
                                 ],
                                 "name": "getEventDetails",
                                 "outputs": [
                                   {
                                     "internalType": "string",
                                     "name": "",
                                     "type": "string"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "address",
                                     "name": "",
                                     "type": "address"
                                   },
                                   {
                                     "internalType": "address",
                                     "name": "",
                                     "type": "address"
                                   },
                                   {
                                     "internalType": "bool",
                                     "name": "",
                                     "type": "bool"
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
                                     "internalType": "uint256",
                                     "name": "_eventId",
                                     "type": "uint256"
                                   },
                                   {
                                     "internalType": "uint256",
                                     "name": "_numberOfTickets",
                                     "type": "uint256"
                                   }
                                 ],
                                 "name": "sellTickets",
                                 "outputs": [],
                                 "payable": true,
                                 "stateMutability": "payable",
                                 "type": "function"
                               }
                             ]; // The ABI for smart contract
const hostingContractAddress = '0x5C07345E6A62F0936FE36aaf899e1591dA6F2416';
const hostingContract = new web3.eth.Contract(hostingContractABI, hostingContractAddress);


const ticketingContractABI = [
                                 {
                                   "inputs": [
                                     {
                                       "internalType": "uint256",
                                       "name": "_price",
                                       "type": "uint256"
                                     }
                                   ],
                                   "payable": false,
                                   "stateMutability": "nonpayable",
                                   "type": "constructor"
                                 },
                                 {
                                   "anonymous": false,
                                   "inputs": [
                                     {
                                       "indexed": true,
                                       "internalType": "address",
                                       "name": "buyer",
                                       "type": "address"
                                     },
                                     {
                                       "indexed": false,
                                       "internalType": "uint256",
                                       "name": "seatNumber",
                                       "type": "uint256"
                                     },
                                     {
                                       "indexed": false,
                                       "internalType": "uint256",
                                       "name": "quantity",
                                       "type": "uint256"
                                     }
                                   ],
                                   "name": "TicketPurchased",
                                   "type": "event"
                                 },
                                 {
                                   "constant": true,
                                   "inputs": [],
                                   "name": "maxQuantity",
                                   "outputs": [
                                     {
                                       "internalType": "uint256",
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
                                   "name": "owner",
                                   "outputs": [
                                     {
                                       "internalType": "address",
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
                                       "internalType": "address",
                                       "name": "",
                                       "type": "address"
                                     }
                                   ],
                                   "name": "ownerSeatCount",
                                   "outputs": [
                                     {
                                       "internalType": "uint256",
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
                                   "name": "price",
                                   "outputs": [
                                     {
                                       "internalType": "uint256",
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
                                       "internalType": "uint256",
                                       "name": "",
                                       "type": "uint256"
                                     }
                                   ],
                                   "name": "seatToOwner",
                                   "outputs": [
                                     {
                                       "internalType": "address",
                                       "name": "",
                                       "type": "address"
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
                                       "internalType": "uint256[]",
                                       "name": "seatNumbers",
                                       "type": "uint256[]"
                                     }
                                   ],
                                   "name": "purchaseTickets",
                                   "outputs": [],
                                   "payable": true,
                                   "stateMutability": "payable",
                                   "type": "function"
                                 },
                                 {
                                   "constant": false,
                                   "inputs": [
                                     {
                                       "internalType": "uint256",
                                       "name": "seatNumber",
                                       "type": "uint256"
                                     }
                                   ],
                                   "name": "refundTicket",
                                   "outputs": [],
                                   "payable": false,
                                   "stateMutability": "nonpayable",
                                   "type": "function"
                                 }
                               ]; // The ABI for smart contract
const ticketingContractAddress = '0x1C9Ab354f71A5b93c88fF33ea9028d6183756854';
const ticketingContract = new web3.eth.Contract(ticketingContractABI, ticketingContractAddress);


const testAccount = '0xfd762ccd6752480203eE4d0DA289E4eD0a545736'; //hardcoded for testing, remove

// Helper function to execute the Python script and parse the output
const generateXRPLWallet = async () => {
  return new Promise((resolve, reject) => {
    exec('python3 createWallet.py', (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
};

// Helper function to execute the Python script and parse the output
const buyTixUsingXRPL = async () => {
  return new Promise((resolve, reject) => {
    exec('python3 buyTicket.py', (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
};

// Function to check if a user is registered in the smart contract
async function checkUserRegistration(ethereumAddress) {
    try {
        const isRegistered = await accountManagerContract.methods.isUserRegistered(ethereumAddress).call({ from: testAccount, gas: 5000000 });
        return isRegistered;
    } catch (error) {
        console.error('Error checking user registration:', error);
        return false; // Handle the error appropriately
    }
}

// Function to register a user in the smart contract
async function registerUserInSmartContract(xrplWalletAddress, userEthereumAddress) {
    const response = await accountManagerContract.methods.registerUser(xrplWalletAddress).send({ from: testAccount, gas: 5000000 });
    return response;
}

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password, isOrganizer, ethereumAddress } = req.body;

    try {

            // Generate XRPL wallet
            const wallet = await generateXRPLWallet();
            console.log(wallet.address);

            // Check if the user is already registered in the smart contract
            const isRegistered = await checkUserRegistration(ethereumAddress);
            if (isRegistered) {
                return res.status(400).send('User already registered');
            }

            // Register the user in the smart contract
            await registerUserInSmartContract(ethereumAddress, wallet.address);

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = new User({
                name,
                email,
                password: hashedPassword,
                isOrganizer,
                xrplWallet: {
                      address: wallet.address
                    },
                ethereumAddress
            });

            try {
                await user.save();
                console.log('User successfully saved');
            } catch (saveError) {
                console.error('Error saving user:', saveError);
                // Handle the error, e.g., return an error response
                return res.status(500).send('Error saving user');
            }

            // Generate JWT Token
            const payload = { user: { id: user.id }};
            jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token, xrplWallet: user.xrplWallet });
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Host Event route
router.post('/host', async (req, res) => {
  const {
    eventName,
    location,
    date,
    time,
    numberOfTickets,
    ticketPrice,
  } = req.body;

//  const userId = req.user.email;
    const userId = "johndoe@example.com"; //hardcoded for testing


    // Fetch the user's information from the database
    const user = await User.findOne({ email: userId });


    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      xrplWallet,
      ethereumAddress,
    } = user;

  try {
    // Create an Event document in your MongoDB
    const event = new Event({
      eventName,
      name,
      location,
      date,
      time,
      numberOfTickets,
      ticketPrice,
      xrplWallet,
      ethereumAddress,
    });

    // Save the Event document to the database
    await event.save();

    // Lock ticket details in the Ethereum smart contract
    const accounts = await web3.eth.getAccounts();
    const result = await hostingContract.methods.createTickets(
      eventName,
      numberOfTickets,
      ticketPrice,
      xrplWallet,
      ethereumAddress
    ).send({ from: accounts[0] });

    // Handle the success response
    res.json({
      success: true,
      message: 'Event hosted successfully',
      transactionHash: result.transactionHash,
    });
  } catch (error) {
    console.error('Error hosting event:', error);
    res.status(500).json({ success: false, message: 'Failed to host the event' });
  }
});

// Purchase Ticket route
router.post('/purchase', async (req, res) => {
  const { seatNumber, userEthereumAddress } = req.body;
  const ticketingContract = new web3.eth.Contract(ticketingContractABI, ticketingContractAddress);

    try {
      // Call the purchaseTicket function of the Ticketing contract
      await ticketingContract.methods.purchaseTicket(seatNumber).send({ from: userEthereumAddress });
      try {
        // Generate XRPL wallet
        const purchase = await buyTixUsingXRPL();
        console.log("XRPL purchase successful");
      } catch (error) {
        console.error("Error making XRPL transaction:", error);
        res.status(500).send("Error making XRPL transaction");
      }
      res.status(200).send("Ticket purchased successfully");
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      res.status(500).send("Error purchasing ticket");
    }
});

//Verify Ticket route
router.post('/verify', async (req, res) => {
    const { seatNumber, ethereumAddress } = req.body;
});

module.exports = router;
