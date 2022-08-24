const ethers = require('ethers');

//USAGE
/*
var minerHelper = require('./helpers/MinerHelper');
minerHelper.Compound(ethers minerContract,string tokenSymbol);
*/
exports.Compound = async function Compound(contract, token) {
    console.log('begin compound: ', token);
    console.log(contract.signer.getAddress());
    let overrides = {
        from: contract.signer.address,
        gasPrice: contract.signer.getGasPrice(),
        gasLimit: 150000
    }
    try {
        const compButton = await contract.hatchEggs(contract.signer.address, overrides)
        const txReceipt = await compButton.wait()
        console.log('compound status: ', token + ' ' + txReceipt.status)
    } catch (err) {
        console.log('compound error:  ', token + ' ' + err.message)
        console.log('\nretry');
        return Compound(contract, token);
    }
}

//USAGE
/*
var minerHelper = require('./helpers/MinerHelper');
minerHelper.Sell(ethers minerContract, string tokenSymbol);
*/
exports.Sell = async function Sell(contract, token) {
    console.log('begin sell: ', token);
    console.log(contract.signer.getAddress());
    try {
        const button = await contract.sellEggs({
            //from: contract.signer.address,
            gasPrice: contract.signer.getGasPrice(),
            gasLimit: 150000
        })
        const txReceipt = await button.wait()
        console.log('sell status: ', token + ': ' + txReceipt.status + ': GasUsed' + txReceipt.gasUsed)
    } catch (err) {
        console.log('sell error:  ', token + ': ' + err.message)
        console.log('\nretry');
        return Sell(contract,token);
    }
}

//USAGE: get unclaimed rewards
/*

 */
exports.multiRewards = async function multiRewards(contract, walletAddress){
    var eggs = await contract.getEggsSinceLastHatch(walletAddress);
    var result = await contract.calculateEggSell(eggs);
    return result;
}
//USAGE
/*
pass array to multirewards function
*/
exports.getAllUnclaimedRewards = async function getAllUnclaimedRewards(arrOfContracts, arrOfSymbols, nameOfMiner){
    var tempStr=new Array();
    var t;
	tempStr.push(nameOfMiner);
	for (let i in arrOfContracts) {
        t = (await this.multiRewards(arrOfContracts[i], arrOfContracts[i].signer.address));
        t = await this.MakeReadable(t);        
		tempStr.push(arrOfSymbols[i] + ': ' + (t));
	}
	return tempStr;
}
exports.MakeReadable = async function MakeReadable(bigNum){
    var temp;
    var length = ethers.BigNumber.from(bigNum).toString().length;
    if(ethers.BigNumber.isBigNumber(bigNum)){
        if(length<10){ //because usdc miner coders kill leading 0s
            bigNum = ethers.utils.formatUnits(bigNum,length);

        }else{
            bigNum = ethers.utils.formatUnits(bigNum,18);
        }
    }
    temp = Number.parseFloat(bigNum).toFixed(6);

    return temp;
}
