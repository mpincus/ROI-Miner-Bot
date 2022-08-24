//USAGE
/*
var utilies = require('./helpers/WaitForUser');
utilies.WaitForUser();
*/
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
    const ans = askQuestion("test1");
    console.log("test");
};
