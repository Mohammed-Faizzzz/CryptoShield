# Define the network client
import json

from xrpl.clients import JsonRpcClient
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/" #change the url once ready for deployment
client = JsonRpcClient(JSON_RPC_URL)

# Create a wallet using the testnet faucet:
# https://xrpl.org/xrp-testnet-faucet.html
from xrpl.wallet import generate_faucet_wallet
test_wallet = generate_faucet_wallet(client, debug=True)


wallet_details = {
    "address": test_wallet.classic_address
}

print(json.dumps(wallet_details))
# print output

