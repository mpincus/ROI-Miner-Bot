require('dotenv').config();
const ethers = require('ethers');
const minerHelper = require('./helpers/MinerHelper');
const etherHelper = require('./helpers/EthersHelper');
const abi = require('erc-20-abi');

//intialize RPCs(providers)
const ftmRPC = new ethers.providers.JsonRpcProvider(process.env.FTM_RPC_URL);
const maticRPC = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const avaxRPC = new ethers.providers.JsonRpcProvider(process.env.AVAX_RPC_URL);
const bnbRPC = new ethers.providers.JsonRpcProvider(process.env.BNB_RPC_URL);
//intialize wallets, cant think of a better way to do this
const polywalletaed = new ethers.Wallet(process.env.PKEY_three, maticRPC);
const polywalletb16c = new ethers.Wallet(process.env.PKEY_two, maticRPC);
const avaxwalletb16c = new ethers.Wallet(process.env.PKEY_two, avaxRPC);
const ftmwalletb16c = new ethers.Wallet(process.env.PKEY_two, ftmRPC);
const bnbwalletb16c = new ethers.Wallet(process.env.PKEY_two, bnbRPC);
//smartcontract ABIs
const MULTI_MINER_ABI = [{ "constant": true, "inputs": [], "name": "ceoAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getMyMiners", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "initialized", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "rt", "type": "uint256" }, { "name": "rs", "type": "uint256" }, { "name": "bs", "type": "uint256" }], "name": "calculateTrade", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "eth", "type": "uint256" }, { "name": "contractBalance", "type": "uint256" }], "name": "calculateEggBuy", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "marketEggs", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "sellEggs", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "devFee", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [], "name": "seedMarket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "ref", "type": "address" }], "name": "hatchEggs", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getMyEggs", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lastHatch", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "claimedEggs", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "hatcheryMiners", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "EGGS_TO_HATCH_1MINERS", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "eth", "type": "uint256" }], "name": "calculateEggBuySimple", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "eggs", "type": "uint256" }], "name": "calculateEggSell", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "referrals", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "ceoAddress2", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "adr", "type": "address" }], "name": "getEggsSinceLastHatch", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "ref", "type": "address" }], "name": "buyEggs", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }]
const TOASTED_AVAX_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "beanRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ref", "type": "address" }], "name": "buyEggs", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eth", "type": "uint256" }, { "internalType": "uint256", "name": "contractBalance", "type": "uint256" }], "name": "calculateEggBuy", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eth", "type": "uint256" }], "name": "calculateEggBuySimple", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eggs", "type": "uint256" }], "name": "calculateEggSell", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "fund", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "getEggsSinceLastHatch", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "getMyEggs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "getMyMiners", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ref", "type": "address" }], "name": "getReferredMiners", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ref", "type": "address" }], "name": "hatchEggs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "seedMarket", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "sellEggs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "newVal", "type": "bool" }], "name": "setInitialized", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "newVal", "type": "bool" }], "name": "setOpen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_dailyReward", "type": "uint256" }], "name": "updateDailyReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_devFeeVal", "type": "uint256" }], "name": "updateDevFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "_recAdd", "type": "address" }], "name": "updateRecAddr", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_refFee", "type": "uint256" }], "name": "updateRefFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const BAKED_BEANS_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "beanRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ref", "type": "address" }], "name": "buyEggs", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eth", "type": "uint256" }, { "internalType": "uint256", "name": "contractBalance", "type": "uint256" }], "name": "calculateEggBuy", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eth", "type": "uint256" }], "name": "calculateEggBuySimple", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eggs", "type": "uint256" }], "name": "calculateEggSell", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "getEggsSinceLastHatch", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "getMyEggs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "adr", "type": "address" }], "name": "getMyMiners", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ref", "type": "address" }], "name": "hatchEggs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "seedMarket", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "sellEggs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
//smartcontract objects
const MATIC_MINER_CONTRACT = "0xf08665261ef76E56e732c711330e905020E445DA"
const AVAX_MINER_CONTRACT = "0x0c01328A0D8E996433Dd9720F40D896089eb966D"
const FTM_MINER_CONTRACT = "0x69e7D335E8Da617E692d7379e03FEf74ef295899"
const SPELL_MINER_CONTRACT = "0x7BaE1b65105eD76dC9F14f3b541003829782E60f"
const TOMB_MINER_CONTRACT = "0x43c12d45Ce42ec3CC24D4fD7e8Dba87f69ECCEcB"
const POLYGON_USDC_MINER_CONTRACT = "0xFF53b9822E114c0AE46cBdE4F7b4C642f8F9bbAA"
const TOASTED_AVAX_CONTRACT = "0x1765e75bbF6cE8C43a13eD91C032A137d102f4d4";
const BAKED_BEANS_BNB_CONTRACT = "0xE2D26507981A4dAaaA8040bae1846C14E0Fb56bF";
//symbols for rewards.txt, could prob simplify this
const multiMinerTokens = ['MATICw3', 'USDC', 'MATICw2', 'AVAX', 'FTM', 'SPELL', 'TOMB'];
const bakeHouseTokens = ['AVAX', 'BNB'];
const multiMiner = [
	new ethers.Contract(MATIC_MINER_CONTRACT, MULTI_MINER_ABI, polywalletaed),
	new ethers.Contract(POLYGON_USDC_MINER_CONTRACT, MULTI_MINER_ABI, polywalletaed),
	new ethers.Contract(MATIC_MINER_CONTRACT, MULTI_MINER_ABI, polywalletb16c),
	new ethers.Contract(AVAX_MINER_CONTRACT, MULTI_MINER_ABI, avaxwalletb16c),
	new ethers.Contract(FTM_MINER_CONTRACT, MULTI_MINER_ABI, ftmwalletb16c),
	new ethers.Contract(SPELL_MINER_CONTRACT, MULTI_MINER_ABI, ftmwalletb16c),
	new ethers.Contract(TOMB_MINER_CONTRACT, MULTI_MINER_ABI, ftmwalletb16c),
];
const bakeHouse = [
	new ethers.Contract(TOASTED_AVAX_CONTRACT, TOASTED_AVAX_ABI, avaxwalletb16c),
	new ethers.Contract(BAKED_BEANS_BNB_CONTRACT, BAKED_BEANS_ABI, bnbwalletb16c),
];

//token addresses and contracts
const usdcToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const spellToken = "0x468003b688943977e6130f4f68f23aad939a1040";
const tombToken = "0x6c021ae822bea943b2e66552bde1d2696a53fbb7";
const elkToken = "0xeEeEEb57642040bE42185f49C52F7E9B38f8eeeE";
const usdcContract = new ethers.Contract(usdcToken, abi, maticRPC);
const spellContract = new ethers.Contract(spellToken, abi, ftmRPC);
const tombContract = new ethers.Contract(tombToken, abi, ftmRPC);
const elkContract = new ethers.Contract(elkToken, abi, bnbRPC);

const dateObject = new Date();
//providers and contracts to get balances
const balanceArr = [
	maticRPC,
	bnbRPC,
	avaxRPC,
	ftmRPC,
	usdcContract,
	spellContract,
	tombContract,
	elkContract
]
//only necassary for gastokens that i cant find contract address for
const walletArr = [
	polywalletb16c.address,
	polywalletaed.address
]
iBalance = []; oBalance = []; rBalance = [];

async function main() {
	/*
	keep daily record of unclaimed rewards
	probably a way to code this with less code
	*/
	rewards1 = []; rewards2 = [];
	rewards1 = await minerHelper.getAllUnclaimedRewards(bakeHouse, bakeHouseTokens, 'BakeHouse');
	rewards2 = await minerHelper.getAllUnclaimedRewards(multiMiner, multiMinerTokens, 'MultiMiner');
	rewards = rewards1.concat(rewards2);
	await SaveData('rewards.txt', rewards);
	/*
	store initial balances
	*/
	iBalance = await etherHelper.formatBalances(balanceArr, walletArr);
	/*
	copy iBalance to iBalanceFormat, not necassary as is
	could decrease iterations using regex and array.split()
	to remove formating but fuck regex
	*/
	iBalanceFormat = iBalance.map((x) => x);
	await SaveData('balance.txt', iBalanceFormat);
	/*
	empty iBalance array, may or maynot be necassary
	*/
	iBalance.forEach((i) => {
		iBalance.pop();
	})
	/*
	hold initial balances, without formating, to compare later
	 */
	iBalance = await etherHelper.getAllBalances(balanceArr, walletArr);
	/*
	alternate days compound and pocket of multichain miner //sunday=0
	*/
	
	if ((dateObject.getDay() % 2) == 0) {
		for (let i = 0; i < multiMiner.length; i++) {
			await minerHelper.Compound(multiMiner[i], multiMinerTokens[i]);
		}
	} else {
		for (let i = 0; i < multiMiner.length; i++) {
			await minerHelper.Sell(multiMiner[i], multiMinerTokens[i]);
		}
	}
	//	bakedbeans and toastedavax sell friday, compound other days   
	
	if (dateObject.getDay() == 5) {
		for (let i = 0; i < bakeHouse.length; i++) {
			await minerHelper.Sell(bakeHouse[i], bakeHouseTokens[i]);
		}
	} else {
		for (let i = 0; i < bakeHouse.length; i++) {
			await minerHelper.Compound(bakeHouse[i], bakeHouseTokens[i]);
		}
	}
	
	/*
	keep daily of record change in wallet balances
	cause javascript is gay doesnt provide method for removing from
	array at index.
	needed to define in main() because undefined error...
	Array.prototype.method caused issues elsewhere because gayness
	*/
	iBalanceFormat.removeByValue = function rBV(val) {
		for (var i = 0; i < this.length; i++) {
			if (!(RegExp(val).test(this[i]))) { //return true if not regex match
				this.splice(i, 1);
				i--;
			}
		}
		return this;
	}
	/*
	create remove extra lines from iBalanceFormat to get symbol data 
	cause multiverse of blockchain doesnt believe in standardizing symbols
	*/
	iBalanceFormat.removeByValue(/.+?(?=:)/);
	/*
	record difference in balance to see gains(and gasfee if counpounding)
	regex looks for data preceeding :, then concat difference
	in hindsight could have used whitepsace for regex
	*/
	oBalance = await etherHelper.getAllBalances(balanceArr, walletArr)
	for (var i in oBalance) {
		var t = parseFloat(oBalance[i] - iBalance[i]);
		t = (iBalanceFormat[i].match(/.+?(?=:)/)) + ': ' + t;
		rBalance.push(t);
	}
	SaveData('pnl.txt', rBalance);

	etherHelper.WaitForUser();
}
main();
/* 
start with timestamp as string, concat string with each element of array
then save string to file
*/
async function SaveData(file, tempStr) {
	var str = '\n' + dateObject.getFullYear() + ':' + (dateObject.getMonth() + 1) + ':' + dateObject.getDate() + '\n\t';
	tempStr.forEach((item) => {
		str = str + item + '\n\t';
	});
	etherHelper.AppendFile(file, str);
}

