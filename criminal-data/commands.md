Start test network:

./network.sh createChannel -ca -c mychannel -s couchdb

Install Chaincode:

./network.sh deployCC -ccn tdrive -ccp ../t_drive/chaincode-javascript/ -ccl javascript

Stopping the network:

./network.sh down

CouchDB:
"http://localhost:5984/\_utils/"
username: admin
pass: adminpw
