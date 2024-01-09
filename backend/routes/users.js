const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { exec } = require('child_process');
const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:7545');
const Signup = require('../smart_contracts/build/contracts/Signup.json');
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
const accountManagerAddress = '0x49372BC3bce59Af66Fa0066a325dbe9EaA68d877';

const accountManagerContract = new web3.eth.Contract(accountManagerABI, accountManagerAddress);

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

module.exports = router;
