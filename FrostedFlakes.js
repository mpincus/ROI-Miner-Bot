const ethers = require('ethers');

exports.frostedFlakesDefrost = async function frostedFlakesDefrost(contract, token) {
	console.log('begin defrost: ', token);
	console.log(contract.signer.getAddress());
	try {
		const compButton = await contract.defrost();
		await contract.enableAutoCompounding();
		const txReceipt = await compButton.wait()
		console.log('defrost status: ', token + ' ' + txReceipt.status)
	} catch (err) {
		console.log('defrost error:  ', token + ' ' + err.message)
	}
}
exports.frostedFlakesDisableCompound = async function frostedFlakesDisableCompound(contract, token) {
	console.log('disable autocompound: ', token);
	console.log(contract.signer.getAddress());
	try {
		const compButton = await contract.disableAutoCompounding()
		const txReceipt = await compButton.wait()
		console.log('compound status: ', token + ' ' + txReceipt.status)
	} catch (err) {
		console.log('compound error:  ', token + ' ' + err.message)
	}
}
exports.frostedFlakesEnableCompound = async function frostedFlakesEnableCompound(contract, token) {
	console.log('enable autocompound: ', token);
	console.log(contract.signer.getAddress());

	try {
		const compButton = await contract.enableAutoCompounding()
		const txReceipt = await compButton.wait()
		console.log('compound status: ', token + ' ' + txReceipt.status)
	} catch (err) {
		console.log('compound error:  ', token + ' ' + err.message)
	}
}
