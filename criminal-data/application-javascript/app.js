/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require('../../test-application/javascript/CAUtil.js');
const {
  buildCCPOrg1,
  buildWallet,
} = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'tdrive';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser1';

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      'ca.org1.example.com'
    );

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, mspOrg1);

    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg1,
      org1UserId,
      'org1.department1'
    );

    const gateway = new Gateway();

    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      });

      // Build a network instance based on the channel where the smart contract is deployed
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(chaincodeName);

      try {
        let result = await contract.evaluateTransaction(
          'CreateUser',
          'user_arif@gmail.com',
          'arif@gmail.com',
          '123456',
          'arif'
        );
        await contract.submitTransaction(
          'CreateUser',
          'user_arif@gmail.com',
          'arif@gmail.com',
          '123456',
          'arif'
        );
        console.log(`Create User Successfully\n Result: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}\n`);
      }

      // Create User

      try {
        let result = await contract.evaluateTransaction(
          'CreateUser',
          'user_shahriar@gmail.com',
          'shahriar@gmail.com',
          '123456',
          'shahriar'
        );
        await contract.submitTransaction(
          'CreateUser',
          'user_shahriar@gmail.com',
          'shahriar@gmail.com',
          '123456',
          'shahriar'
        );
        console.log(`Create User Successfully\n Result: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}\n`);
      }

      // Find User

      try {
        let result = await contract.evaluateTransaction(
          'FindUser',
          'arif@gmail.com',
          '123456'
        );
        console.log(`Found User Successfully\n Result: ${result}\n\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}\n\n`);
      }

      //Create File
      try {
        let result = await contract.evaluateTransaction(
          'CreateFile',
          'file_cert.txt_hash123',
          'cert.txt',
          '/files/cert.txt',
          'hash123',
          'arif@gmail.com'
        );
        await contract.submitTransaction(
          'CreateFile',
          'file_cert.txt_hash123',
          'cert.txt',
          '/files/cert.txt',
          'hash123',
          'arif@gmail.com'
        );
        console.log(`Create File Successfully\n Result: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      //Create File
      try {
        let result = await contract.evaluateTransaction(
          'CreateFile',
          'file_cert.txt_hash456',
          'cert2.txt',
          '/files/cert2.txt',
          'hash456',
          'arif@gmail.com'
        );
        await contract.submitTransaction(
          'CreateFile',
          'file_cert.txt_hash456',
          'cert2.txt',
          '/files/cert2.txt',
          'hash456',
          'arif@gmail.com'
        );
        console.log(`Create File Successfully\n Result: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      //Create File
      try {
        let result = await contract.evaluateTransaction(
          'CreateFile',
          'file_cert.txt_hash789',
          'cert3.txt',
          '/files/cert3.txt',
          'hash789',
          'arif@gmail.com'
        );
        await contract.submitTransaction(
          'CreateFile',
          'file_cert.txt_hash789',
          'cert3.txt',
          '/files/cert3.txt',
          'hash789',
          'arif@gmail.com'
        );
        console.log(`Create File Successfully\n Result: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Find the file
      try {
        let result = await contract.evaluateTransaction(
          'FindFile',
          'file_cert.txt_hash123'
        );
        console.log(`File found!, the file is: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Find file by user
      try {
        let result = await contract.evaluateTransaction(
          'FindFileByUser',
          'arif@gmail.com'
        );
        console.log(
          `File list found!, the file list for 'arif@gmail.com' is: ${result}`
        );
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Share file
      try {
        let result = await contract.evaluateTransaction(
          'ShareFile',
          'fileshare_cert.txt_hash123',
          'file_cert.txt_hash123',
          'shahriar@gmail.com'
        );
        console.log(`File is shared! result: ${result}\n`);

        await contract.submitTransaction(
          'ShareFile',
          'fileshare_cert.txt_hash123',
          'file_cert.txt_hash123',
          'shahriar@gmail.com'
        );
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Shared file list by file key
      try {
        let result = await contract.evaluateTransaction(
          'SharedFileListByFile',
          'fileshare_cert.txt_hash123'
        );
        console.log(`Shared file list found! result: ${result}\n`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Shared File list by user
      try {
        let result = await contract.evaluateTransaction(
          'SharedFileListByUser',
          'shahriar@gmail.com'
        );
        console.log(`Shared File list found for shahriar@gmail.com: ${result}`);
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Delete Share file
      try {
        let result = await contract.evaluateTransaction(
          'DeleteFileShare',
          'fileshare_cert.txt_hash123'
        );
        console.log(`File shared is deleted! result: ${result}\n`);

        await contract.submitTransaction(
          'DeleteFileShare',
          'fileshare_cert.txt_hash123'
        );
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Change file name
      try {
        let result = await contract.evaluateTransaction(
          'ChangeFileName',
          'file_cert.txt_hash123',
          'cert_edited.txt'
        );
        console.log(`Filename changed! result: ${result}\n`);

        await contract.submitTransaction(
          'ChangeFileName',
          'file_cert.txt_hash123',
          'cert_edite.txt'
        );
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      // Delete File
      try {
        let result = await contract.evaluateTransaction(
          'DeleteFile',
          'file_cert.txt_hash123'
        );
        console.log('File Deleted!\n');

        await contract.submitTransaction('DeleteFile', 'file_cert.txt_hash123');
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
  }
}

main();
