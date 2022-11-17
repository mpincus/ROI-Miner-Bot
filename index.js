require('dotenv').config();
const ethers = require('ethers');
const minerHelper = require('./helpers/MinerHelper');
const etherHelper = require('./helpers/EthersHelper');
const abi = require('erc-20-abi');
const {MULTI_MINER_ABI, TOASTED_AVAX_ABI, BAKED_BEANS_ABI, ELK_OF_FORTUNE_ABI, CAKE_OF_FORTUNE_ABI, FROSTED_FLAKES_ABI} = require('./MinerABIs.js');

//initialize RPCs(providers)
const ftmRPC = new ethers.providers.JsonRpcProvider(process.env.FTM_RPC_URL);
const maticRPC = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const avaxRPC = new ethers.providers.JsonRpcProvider(process.env.AVAX_RPC_URL);
const bnbRPC = new ethers.providers.JsonRpcProvider(process.env.BNB_RPC_URL);
//initialize wallets, cant think of a better way to do this
const ethersWallet = [
	new ethers.Wallet(process.env.PKEY_three, maticRPC),
	new ethers.Wallet(process.env.PKEY_two, maticRPC),
	new ethers.Wallet(process.env.PKEY_two, avaxRPC),
	new ethers.Wallet(process.env.PKEY_two, ftmRPC),
	new ethers.Wallet(process.env.PKEY_two, bnbRPC),
]


//smartcontract addresses
const MATIC_MINER_CONTRACT = "0xf08665261ef76E56e732c711330e905020E445DA";
const AVAX_MINER_CONTRACT = "0x0c01328A0D8E996433Dd9720F40D896089eb966D";
const FTM_MINER_CONTRACT = "0x69e7D335E8Da617E692d7379e03FEf74ef295899";
const SPELL_MINER_CONTRACT = "0x7BaE1b65105eD76dC9F14f3b541003829782E60f";
const TOMB_MINER_CONTRACT = "0x43c12d45Ce42ec3CC24D4fD7e8Dba87f69ECCEcB";
const POLYGON_USDC_MINER_CONTRACT = "0xFF53b9822E114c0AE46cBdE4F7b4C642f8F9bbAA";
const TOASTED_AVAX_CONTRACT = "0x1765e75bbF6cE8C43a13eD91C032A137d102f4d4";
const BAKED_BEANS_BNB_CONTRACT = "0xE2D26507981A4dAaaA8040bae1846C14E0Fb56bF";
const ELK_OF_FORTUNE_MINER_CONTRACT = "0xc36d17085b26fc5dCBBB46A6A2068b3AdE2CdAb5";
const CAKE_OF_FORTUNE__CONTRACT = "0x07694C31d496290632DEFE3Bc048c82B20b28036";

const FROSTED_FLAKES_CONTRACT = "0x1745A5Be4497b4eC1E9666516BD81d8608471D4b";


//symbols for rewards.txt, could prob simplify this
const multiMinerTokens = ['MATIC', 'USDC', 'MATIC', 'AVAX', 'FTM', 'SPELL', 'TOMB'];
const bakeHouseTokens = ['AVAX', 'BNB'];
const fortuneHunersTokens = ['ELK', 'CAKE'];
const multiMiner = [
	new ethers.Contract(MATIC_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[0]),
	new ethers.Contract(POLYGON_USDC_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[0]),
	new ethers.Contract(MATIC_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[1]),
	new ethers.Contract(AVAX_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[2]),
	new ethers.Contract(FTM_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[3]),
	new ethers.Contract(SPELL_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[3]),
	new ethers.Contract(TOMB_MINER_CONTRACT, MULTI_MINER_ABI, ethersWallet[3])
];
const bakeHouse = [
	new ethers.Contract(TOASTED_AVAX_CONTRACT, TOASTED_AVAX_ABI, ethersWallet[2]),
	new ethers.Contract(BAKED_BEANS_BNB_CONTRACT, BAKED_BEANS_ABI, ethersWallet[4])
];
const fortuneHunters = [
	new ethers.Contract(ELK_OF_FORTUNE_MINER_CONTRACT, ELK_OF_FORTUNE_ABI, ethersWallet[4]),
	new ethers.Contract(CAKE_OF_FORTUNE__CONTRACT, CAKE_OF_FORTUNE_ABI, ethersWallet[4])
];
const frostedFlakes = [
	new ethers.Contract(FROSTED_FLAKES_CONTRACT, FROSTED_FLAKES_ABI, ethersWallet[4])
];
//token addresses and contracts
const usdcToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const spellToken = "0x468003b688943977e6130f4f68f23aad939a1040";
const tombToken = "0x6c021ae822bea943b2e66552bde1d2696a53fbb7";
const elkToken = "0xeEeEEb57642040bE42185f49C52F7E9B38f8eeeE";
const cakeToken = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
const usdcContract = new ethers.Contract(usdcToken, abi, maticRPC);
const spellContract = new ethers.Contract(spellToken, abi, ftmRPC);
const tombContract = new ethers.Contract(tombToken, abi, ftmRPC);
const elkContract = new ethers.Contract(elkToken, abi, bnbRPC);
const cakeContract = new ethers.Contract(cakeToken,abi,bnbRPC)

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
	elkContract,
	cakeContract
]
const walletArr = [
	ethersWallet[0].address,
	ethersWallet[1].address
]
iBalance = []; oBalance = []; rBalance = [];

const XLSX = require("xlsx");
const sheet = require('spread_sheet');
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

function exportToExcel(aoa, sheetName){
	var str = [[dateObject.getFullYear() + ':' + (dateObject.getMonth() + 1) + ':' + dateObject.getDate()]];
	var strarr = [];
	let aoa2 = aoa.map(x=>' '+x);
	aoa2.forEach(item=>{
			strarr.push(item.split(' '));
		});
	sheet.addRow(str, './MinerStats.xlsx', sheetName,function(err,result){});
	sheet.addRow(strarr, './MinerStats.xlsx', sheetName,function(err,result){});
}



function initializeSheets(){
	var fs = require('fs');
	if(!fs.existsSync('./MinerStats.xlsx')){

			var workbook = XLSX.utils.book_new();
			workbook.SheetNames.push('PNL');
			workbook.SheetNames.push('Rewards');
			workbook.SheetNames.push('Balance');			
			XLSX.writeFile(workbook, "MinerStats.xlsx");

		}
	}

async function main() {
	/*
	keep daily record of unclaimed rewards
	probably a way to code this with less code
	*/
	rewards1 = []; rewards2 = []; rewards3 = [];
	rewards1 = await minerHelper.getAllUnclaimedRewards(bakeHouse, bakeHouseTokens, 'BakeHouse');
	rewards2 = await minerHelper.getAllUnclaimedRewards(multiMiner, multiMinerTokens, 'MultiMiner');
	rewards3 = await minerHelper.getAllUnclaimedRewards(fortuneHunters, fortuneHunersTokens, 'FortuneHunters');
	rewards = rewards1.concat(rewards2, rewards3);

	initializeSheets();
	exportToExcel(rewards, 'Rewards');

	await SaveData('rewards.txt', rewards);

	/*
	hold initial balances, without formatting, to compare later
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
	//fortune hunters sell 1st and 15th of month, compound others
//	if (dateObject.getDay() === 0 || dateObject.getDay() === 14) {
	if (dateObject.getDay() == 2 || dateObject.getDay() == 5) {

		for (let i = 0; i < fortuneHunters.length; i++) {
			await minerHelper.Sell(fortuneHunters[i], fortuneHunersTokens[i]);
		}
	} else {
		var t = await minerHelper.multiRewards(fortuneHunters[0], fortuneHunters[0].signer.address);
		t = await minerHelper.MakeReadable(t);
		if (t > 15) { //only if atleast 15 elk available for lotto
			for (let i = 0; i < fortuneHunters.length; i++) {
				await minerHelper.Compound(fortuneHunters[i], fortuneHunersTokens[i]);
			}
		}
	}
	//frostedFlakes, data not recorded need to implement 11/17/22
	//SELL/DEFROST AND ENABLE AUTOCOMPOUND
	if(dateObject,getDay()==5){
		for(let i=0;i<frostedFlakes.length;i++){
			frostedFlakesDefrost(frostedFlakes[i], "frostedFlakes");
		}

	}
	//DISABLE AUTOCOMPOUND
	if(dateObject.getDay()==4){
		for(let i=0;i<frostedFlakes.length;i++){
			frostedFlakesDisableCompound(frostedFlakes[i], "frostedFlakes");
	}
	/*
	store new balances
	*/
	iBalanceFormat = await etherHelper.formatBalances(balanceArr, walletArr);
	exportToExcel(iBalanceFormat,'Balance');
	await SaveData('balance.txt', iBalanceFormat);
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
	cause blockchains dont play nice
	*/
	iBalanceFormat.removeByValue(/.+?(?=:)/);
	/*
	record difference in balance to see gains(and gasfee if compounding)
	regex looks for data preceding :, then concat difference
	*/
	oBalance = await etherHelper.getAllBalances(balanceArr, walletArr)
	for (var i in oBalance) {
		var t = parseFloat(oBalance[i] - iBalance[i]);
		t = (iBalanceFormat[i].match(/.+?(?=:)/)) + ': ' + t;
		rBalance.push(t);
	}
	exportToExcel(rBalance, 'PNL');
	SaveData('pnl.txt', rBalance);

	//etherHelper.WaitForUser();
}

async function frostedFlakesDefrost(contract, token){
	console.log('begin defrost: ', token);
    console.log(contract.signer.getAddress());
    let overrides = {
        from: contract.signer.address,
        gasPrice: contract.signer.getGasPrice(),
        gasLimit: 150000
    }
    try {
        const compButton = await contract.defrost(contract.signer.address, overrides);
		await contract.enableAutoCompounding();
        const txReceipt = await compButton.wait()
        console.log('defrost status: ', token + ' ' + txReceipt.status)
    } catch (err) {
        console.log('defrost error:  ', token + ' ' + err.message)
        console.log('\nretry');
        return Compound(contract, token);
    }
}
async function frostedFlakesDisableCompound(contract, token){
	console.log('disable autocompound: ', token);
    console.log(contract.signer.getAddress());
    let overrides = {
        from: contract.signer.address,
        gasPrice: contract.signer.getGasPrice(),
        gasLimit: 150000
    }
    try {
        const compButton = await contract.disableAutoCompounding(contract.signer.address, overrides)
        const txReceipt = await compButton.wait()
        console.log('compound status: ', token + ' ' + txReceipt.status)
    } catch (err) {
        console.log('compound error:  ', token + ' ' + err.message)
        console.log('\nretry');
        return Compound(contract, token);
    }
}

main();



// const frostedFlakes = new ethers.Contract(FROSTED_FLAKES_CONTRACT, FROSTED_FLAKES_ABI, ethersWallet[4]);

//  async function test(){
// // 	console.log(await frostedFlakes.getFirstDeposit(walletArr[1]));
// 	console.log(frostedFlakes);
//  }
//  test();