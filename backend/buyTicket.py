# Define the network client
import json

from xrpl.clients import JsonRpcClient
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/" #change the url once ready for deployment
client = JsonRpcClient(JSON_RPC_URL)

