//USAGE
/*
var sleep = require('./helpers/Sleep');
sleep.Sleep(time);
*/
exports.Sleep = async function(time){
await new Promise(resolve => setTimeout(resolve, time));
}