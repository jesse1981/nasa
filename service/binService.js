

module.exports = function(logFactory, config) {

    var log = logFactory.get("transactionService");

    var _self = this;
    var transactionData = {};
    var err = null;

    this.calcBin = function(username,password) {

        log.info("bin: start");
        var result = new Promise(function(resolve,reject){

            var user_data = {};
            var acct_data = {};
            var cust_data = {};
            var tran_data = {};

            // login...
            user_data = loginService.login()
            .then(function(){
                // list of accounts
                acct_data = accountService.accounts(loginService.userData.loginResponse.tokens["value"]);
            })
            .then(function() {
                // customer profile
                cust_data = customerService.profile(loginService.userData.loginResponse.tokens["value"]);
            })
            .then(function() {
                // transactions (first transactionAccount account)
                for (var i in acct_data.accountsResponse.accounts) {
                    if (acct_data.accountsResponse.accounts[i].accountType === "transactionAccount") {
                        var accountId       = acct_data.accountsResponse.accounts[i].accountIdDisplay;
                        var accountToken    = acct_data.accountsResponse.accounts[i].accountToken;

                        tran_data = transactionService(user_data.loginResponse.tokens["value"],accountToken);
                        break;
                    }
                }
            })
            .then(function() {
                // load merchant data
                var parser = parse({delimiter: ','}, function (err, data) {
                    merchantData = data;
                    return true;
                });
                fs.createReadStream(merchantFile).pipe(parser);
            })
            .then(function() {
                var rawData = [];
                var t = tran_data.transactionsResponse.transactions;
                for (var i in t) {
                    if (t[i].description === "TRANSFER DEBIT") 
                        rawData.push({
                           reference: t[i].refernece,
                           transactionTypeCode: t[i].transactionTypeCode,
                           date: t[i].date,
                           narrative: t[i].narrative,
                           amount: t[i].amount,
                           merchant: t[i].merchantName
                        });
                }

                // get Total-expenditure
                var totalExpenditure = 0;
                for (var i in rawData) totalExpenditure += parseFloat(rawData[i].amount);

                // get Rel_1
                for (var i in rawData) rawData[i].rel_1 = (rawData[i].amount / totalExpenditure);

                // get Rel_2
                var merchantReached = false;
                for (var i in rawData) {
                    for (var a in merchantData) {
                        if (rawData[i].merchant === merchantData[a][0]) {
                            rawData[i].rel_2    = parseFloat(rawData[i].rel_2 * merchantData[a][2]);
                            rawData[i].bin      = merchantData[a][3];
                            rawData[i].fac      = 0; //merchantData[a][?]      To-Do, get a bin factor from CSV
                            merchantReached = true;
                            break;
                        }
                    }
                    if (merchantReached === true) break;
                }

                // create Rel_3 array
                var rel_3_keys = [];
                var rel_3 = [];
                var index = 0;
                for (var a in rawData) {
                    index = rel_3_keys.indexOf(rawData[a].merchant);
                    if (index === -1) {
                        rel_3.push({
                            sum: 0,
                            bin: rawData[a].bin,
                            fac: rawData[a].fac 
                        });
                        rel_3_keys.push(rawData[a].merchant);
                        index = (rel_3.length-1);
                    }
                    rel_3[index].sum += parseFloat(rawData[a].rel_2);
                }

                // create bin_sums array
                var bin_keys = [];
                var bin_sums = [];
                var index = 0;
                for (var a in rel_3) {
                    index = bin_keys.indexOf(rel_3[a].bin);
                    if (index === -1) {
                        bin_sums.push({
                            name: rel_3[a].bin,
                            sum: 0,
                            fac: rel_3[a].fac
                        });
                        index = (bin_sums.length-1);
                        bin_keys.push(rel_3[a].bin);
                    }
                    bin_sums[index] += rel_3[a].sum;
                }

                // create Rel_4 array
                var rel_4 = [];
                for (var a in bin_sums) {
                    rel_4.push(bin_sums[a].sum * bin_sums[a].fac);
                }

                // create Rel_5
                var rel_5 = 0;
                for (var a in rel_4) rel_5 += rel_4[a];

                // final object (to send)
                var result = {
                    total: rel_5,
                    data: rel_4
                };
                
                return result;
                resolve();
            })
            .fail(function(err) {
                console.log("ERROR: " + err);
                log.warn("ERROR: " + err);
            });
        });
    };
};
