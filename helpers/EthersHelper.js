const ethers = require('ethers');
const fs = require('fs');
const {Provider} = require("@ethersproject/abstract-provider");

//USAGE
/*
Ethers Provider.getBalance() will return the gas token of provider/rpc
contract.balanceOf() will return all other tokens
*/
exports.GetABalance = async function GetABalance(providerOrContract, walletAddress){
    if(Provider.isProvider(providerOrContract)){
        var balance = await providerOrContract.getBalance(
            walletAddress,
            'latest'
        );
        var str = ethers.utils.formatEther(balance);
        return str;
    }else{
        if(await providerOrContract.symbol() == 'USDC'){
            balance = ethers.utils.formatUnits(await providerOrContract.balanceOf(walletAddress),'mwei');
        } else {
            balance = ethers.utils.formatEther(await providerOrContract.balanceOf(walletAddress));
        }
        return balance;
    }
}

exports.getAllBalances = async function getAllBalances(arrOfProviderOrContracts, arrOfWallets){
    var tempStr=new Array();
    var t;
    for(let o in arrOfWallets){
	    for (let i in arrOfProviderOrContracts) {
            t = (await this.GetABalance(arrOfProviderOrContracts[i], arrOfWallets[o]));
            if(t != 0){
            tempStr.push(this.MakeReadable(t));
            }
	    }
    }
	return tempStr;
}
exports.formatBalances = async function formatBalances(arrOfProviderOrContracts, arrOfWallets){
    var tempStr=new Array();
    var bal;
    var name = '';
    for(let o in arrOfWallets){
        tempStr.push('Wallet' + this.safeMath(o))
	    for (let i in arrOfProviderOrContracts) {
            name = '';
            bal = (await this.GetABalance(arrOfProviderOrContracts[i], arrOfWallets[o]));
            if(bal != 0){
                if(arrOfProviderOrContracts[i]._isProvider){
                    name = await arrOfProviderOrContracts[i]._network.name;
                    name = name.toUpperCase() + ': ';
                    if(arrOfProviderOrContracts[i]._network.chainId == 250)
                        name = 'FTM: ';
                    if(arrOfProviderOrContracts[i].network.chainId == 43114)
                        name = 'AVAX: ';
                } else {
                    name = await arrOfProviderOrContracts[i].symbol() + ': ';
                }
                bal = this.MakeReadable(bal);
                tempStr.push(name+bal);
            }
	    }
    }
	return tempStr;
}

exports.WaitForUser = async function WaitForUser() {
    const readline = require("readline");

    function askQuestion(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise((resolve) =>
            rl.question(query, (ans) => {
                rl.close();
                resolve(ans);
            })
        );
    }
    const ans = askQuestion("DONE");

};

//USAGE
/*
str = '\n'+date.getFullYear()+':'+(date.getMonth()+1)+':'+date.getDate()+'\n\t'+
*/
exports.AppendFile = async function AppendFile(file, data){
    var str = str + data;
    fs.appendFile(file,data, (err) => {
        if (err) throw err;
      });

}

//USAGE
/*
make readable
*/
exports.MakeReadable = function MakeReadable(bigNum){
    var temp;
    if(ethers.BigNumber.isBigNumber(bigNum)){
        bigNum = ethers.utils.formatEther(bigNum);
    }
    temp = Number.parseFloat(bigNum).toFixed(6);
    return temp;
}
exports.safeMath = function safeMath(x){
    var v = parseInt(x)+1;
    v = v.toString()
    return v;
}
