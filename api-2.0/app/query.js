const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')


const helper = require('./helper')
const query = async (channelName, chaincodeName, args, fcn, username, org_name) => {

    try {

        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(org_name) //.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;

        switch (fcn) {
            case "GetDocumentUsingCarContract":
                console.log("=============")
                result = await contract.evaluateTransaction('SmartContract:'+fcn, args[0]);
                break;
            case "getAssetHistory":
                console.log("==============")
                result = await contract.evaluateTransaction('getAssetHistory', args[0]);
                break;
            case "queryCar":
                console.log("=============")
                result = await contract.evaluateTransaction('queryCar', args[0]);
                break;
            case "queryCarByOwner":
                console.log("=============")
                result = await contract.evaluateTransaction('queryCarByOwner', args[0]);
                break;
            case "queryCarForSale":
                console.log("=============")
                result = await contract.evaluateTransaction('queryCarForSale', args[0]);
                break;
            case "queryCarForResale":
                console.log("=============")
                result = await contract.evaluateTransaction('queryCarForResale', args[0]);
                break;
            case "queryAllInsuranceSchemes":
                console.log("=============")
                result = await contract.evaluateTransaction('queryAllInsuranceSchemes', args[0]);
                break;
            case "queryAllInsuranceClaimRequests":
                console.log("=============")
                result = await contract.evaluateTransaction('queryAllInsuranceClaimRequests', args[0]);
                break;
            case "queryAllInspectionRequests":
                console.log("=============")
                result = await contract.evaluateTransaction('queryAllInspectionRequests', args[0]);
                break;
            case "queryRegistrationsNotVerified":
                console.log("=============")
                result = await contract.evaluateTransaction('queryRegistrationsNotVerified', args[0]);
                break;
            case "queryInsuranceNotVerified":
                console.log("=============")
                result = await contract.evaluateTransaction('queryInsuranceNotVerified', args[0]);
                break;
            case "queryInsuranceByAgency":
                console.log("=============")
                result = await contract.evaluateTransaction('queryInsuranceByAgency', args[0]);
                break;
            case "queryInsuranceClaimRequestsByAgency":
                console.log("=============")
                result = await contract.evaluateTransaction('queryInsuranceClaimRequestsByAgency', args[0]);
                break;
            case "queryAllScrapRequests":
                console.log("=============")
                result = await contract.evaluateTransaction('queryAllScrapRequests', args[0]);
                break;
            default:
                break;
        }

        console.log(result)
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        result = JSON.parse(result.toString());
        return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}

exports.query = query