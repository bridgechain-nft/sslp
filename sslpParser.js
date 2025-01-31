/*
 *
 * SSLP - Version 2.0.0
 *
 * Solar Side Ledger Protocol
 *
 * A simplified token management system for the Solar network
 *
 * SSLPParser - Parse the blockchain for SSLP items
 *
 */

const redis = require('redis'); // a really fast nosql keystore
const fs = require('fs'); // so we can read the config ini file from disk
const ini = require('ini'); // so we can parse the ini files properties
const Big = require('big.js'); // required unless you want floating point math issues
const nodemailer = require('nodemailer'); // for sending error reports about this node
const crypto = require('crypto'); // for creating hashes of things
//const SparkMD5 = require('spark-md5'); // Faster than crypto for md5
const asyncv3 = require('async'); // Async Helper

//const { Client } = require('pg'); // Postgres
const { Client } = require("@alessiodf/wsapi-client");

const { Transactions: SolarTransactions, Managers: SolarManagers, Utils: SolarUtils, Identities: SolarIdentities } = require("@solar-network/crypto");
SolarManagers.configManager.setFromPreset("mainnet");
const { onShutdown } = require('node-graceful-shutdown');

var shuttingdown = false;
var safetoshutdown = false;

// On Shutdown - Do some Cleanup
onShutdown("parser", async function() {

    shuttingdown = true;
    let counter = 0;

    return new Promise((resolve, reject) => {

        var shutdowncheck = setInterval(function() {
        
        	counter++;

            console.log('Checking if shutdown is safe... ' + safetoshutdown.toString());
            if (safetoshutdown == true) {
                resolve(true);
            }
            
            if (counter > 100) resolve(true);

        }, 1000);

    });

});

var iniconfig = ini.parse(fs.readFileSync('sslp.ini', 'utf-8'))

// WS Connection
const wsClient = new Client(iniconfig.ws_client);

// Mongo Connection Details
const mongoconnecturl = iniconfig.mongo_connection_string;
const mongodatabase = iniconfig.mongo_database;

// MongoDB Library
const SSLPDB = require("./lib/sslpDB");
const qdb = new SSLPDB.default(mongoconnecturl, mongodatabase);


// SSLP-1 Token Schema
const SSLPSchema = require("./lib/sslpSchema");
const sslp = new SSLPSchema.default();

// Declaring some variable defaults

const SSLPactivationHeight = 2031200;
const SSLPactivationBlockId = 'fbac47fc191a06e6b280fd2589298cbb623b88d9cdcd1866c6ea227dd559ed2c';

var scanBlockId = 0;
var lastBlockId = '';
var sigblockhash = '';
var sigtokenhash = '';
var sigaddrhash = '';
var sigtrxhash = '';
var previoushash = '';
var fullhash = '';
var processedItems = false;
var lastBlockNotify = Math.floor(new Date() / 1000);

var scanLock = false;
var scanLockTimer = 0;

var rclient;
var rclienttwo;

dorun();

function dorun() {

    (async() => {
    
    	await wsClient.connect();

        // Connect to Redis and setup some async call definitions
        // Primary redis connection for get, set, del
        rclient = redis.createClient(iniconfig.redis_port, iniconfig.redis_host, { detect_buffers: true });
        // Subscription redis connection
        rclienttwo = rclient.duplicate();

        // Let us know when we connect or have an error with redis
        rclient.on('connect', () => console.log('Connected to Redis'));
        rclient.on('error', (err) => console.log('Redis Client Error', err));

        await rclient.connect();
        await rclienttwo.connect();

        var lbreply = await rclient.get('SSLP_lastscanblock');

        var ignorerunparams = await rclient.get('SSLP_ignorerunparameters');

        // Resync/Rescan Flag or Unknown last scan -  rescans all transaction (ie. #node sslpParser.js resync)

        if ((ignorerunparams == null && process.argv.length == 3 && process.argv[2] == 'resync') || lbreply == null) {

            console.log("--------------------");
            console.log("Forcing a Rescan....");
            console.log("--------------------");

            await rclient.set('SSLP_lastscanblock', Big(SSLPactivationHeight).toFixed(0));
            await rclient.set('SSLP_lastblockid', SSLPactivationBlockId);

            // Remove items from MongoDB

            let response = {};
            let exists = true;

            var mclient = await qdb.connect();
            qdb.setClient(mclient);

            exists = await qdb.doesCollectionExist('tokens');
            console.log("Does collection 'tokens' Exist: " + exists);
            if (exists == true) {
                console.log("Removing all documents from 'tokens'");
                await qdb.removeDocuments('tokens', {});
            } else {
                console.log("Creating new collection 'tokens'");
                await qdb.createCollection('tokens', {});
            }

            exists = await qdb.doesCollectionExist('addresses');
            console.log("Does collection 'addresses' Exist: " + exists);
            if (exists == true) {
                console.log("Removing all documents from 'addresses'");
                await qdb.removeDocuments('addresses', {});
            } else {
                console.log("Creating new collection 'addresses'");
                await qdb.createCollection('addresses', {});
            }

            exists = await qdb.doesCollectionExist('transactions');
            console.log("Does collection 'transactions' Exist: " + exists);
            if (exists == true) {
                console.log("Removing all documents from 'transactions'");
                await qdb.removeDocuments('transactions', {});
            } else {
                console.log("Creating new collection 'transactions'");
                await qdb.createCollection('transactions', {});
            }

            exists = await qdb.doesCollectionExist('journal');
            console.log("Does collection 'journal' Exist: " + exists);
            if (exists == true) {
                console.log("Removing all documents from 'journal'");
                await qdb.removeDocuments('journal', {});
            } else {
                console.log("Creating new collection 'journal'");
                await qdb.createCollection('journal', {});
            }

            exists = await qdb.doesCollectionExist('metadata');
            console.log("Does collection 'metadata' Exist: " + exists);
            if (exists == true) {
                console.log("Removing all documents from 'metadata'");
                await qdb.removeDocuments('metadata', {});
            } else {
                console.log("Creating new collection 'metadata'");
                await qdb.createCollection('metadata', {});
            }

            exists = await qdb.doesCollectionExist('counters');
            console.log("Does collection 'counters' Exist: " + exists);
            if (exists == true) {
                console.log("Removing all documents from 'counters'");
                await qdb.removeDocuments('counters', {});
                await qdb.insertDocument('counters', { collection: 'journal', field: 'id', current: 0 });
            }

            await sslp.indexDatabase(qdb);

            await qdb.close();

            // Initialze things
            initialize();

        } else if (ignorerunparams == null && process.argv.length == 4 && process.argv[2] == 'rollback') {

            /* Roll back to specified blockheight and resume from there:   node sslpParser.js rollback 122343 */

            var rollbackHeight = parseInt(process.argv[3]);

            var mclient = await qdb.connect();
            qdb.setClient(mclient);

            console.log("Performing Rollback to Block Height: " + rollbackHeight);

            await rebuildDbFromJournal(rollbackHeight, qdb);

            initialize();

        } else {
            await rclient.del('SSLP_ignorerunparameters');
            // These aren't the droids we are looking for, move along...  
            initialize();
        }

    })();

}

// Main Functions
// ==========================

function initialize() {

    downloadChain();
    blockNotifyQueue();

}

function blockNotifyQueue() {

    (async() => {

        var data = await rclienttwo.blPop('blockNotify', iniconfig.polling_interval);

        if (data == 'blockNotify,new') {
            newblocknotify();
        } else {
            var currentIntervalTime = Math.floor(new Date() / 1000);
            if (lastBlockNotify < (currentIntervalTime - iniconfig.polling_interval)) {
                newblocknotify();
            }
        }

        blockNotifyQueue();

    })();

}

function downloadChain() {

    scanLock = true;
    scanLockTimer = Math.floor(new Date() / 1000);

    (async() => {

        var doresync = await rclient.get('SSLP_resyncfromjournalheight');

        if (doresync != null) {

            // out of sync with peers...

            var mclient = await qdb.connect();
            qdb.setClient(mclient);

            await rebuildDbFromJournal(parseInt(doresync), qdb);

            await rclient.del('SSLP_resyncfromjournalheight');

            await qdb.close();

        } else {

			/* old pgsql
			
            var pgclient = new Client({ user: iniconfig.pg_username, database: iniconfig.pg_database, password: iniconfig.pg_password });
            await pgclient.connect()
            var message = await pgclient.query('SELECT * FROM blocks ORDER BY height DESC LIMIT 1')
            await pgclient.end()

			*/
			
			
			
			let blockInfo = await wsClient.get("blocks?limit=1");

console.log(blockInfo);

            var topHeight = 0;
            if (blockInfo && blockInfo.data && blockInfo.data[0].height) {
                var topHeight = blockInfo.data[0].height;
                lastBlockId = blockInfo.data[0].id;
            }
            
            console.log('Current Block Height: #' + topHeight + '.....');

        }

        scanLock = false;
        scanLockTimer = 0;

        doScan();

    })();

}

function syncJournalFromPeer() {

    // TODO



}

function rebuildDbFromJournal(journalHeight, qdb) {

    return new Promise((resolve) => {

        (async() => {

            journalHeight = parseInt(journalHeight);

            var startTime = (new Date()).getTime();

            try {

                // Remove Journal Entries above the rollback	
                await qdb.removeDocuments('journal', { "blockHeight": { $gt: journalHeight } });

                // Remove all tokens
                await qdb.removeDocuments('tokens', {});

                // Remove all addresses
                await qdb.removeDocuments('addresses', {});

                // Remove all transactions
                await qdb.removeDocuments('transactions', {});

                // Remove all metadata
                await qdb.removeDocuments('metadata', {});

                // Remove all counters
                await qdb.removeDocuments('counters', {});
                await qdb.insertDocument('counters', { collection: 'journal', field: 'id', current: 0 });

                // Get last journal entry after pruning			
                var findLastJournal = await qdb.findDocumentsWithId('journal', {}, 1, { "_id": -1 }, 0);

                var lastJournalEntry = findLastJournal[0];

                if (!lastJournalEntry) {

                    // Something Broke.  Start over....

                    await rclient.del('SSLP_lastblockid');
                    await rclient.del('SSLP_lastscanblock');

                    await rclient.set('SSLP_ignorerunparameters', '1');
                    process.exit(-1);

                } else {

                    var lastJournalID = lastJournalEntry['_id'];
                    var lastJournalBlockId = lastJournalEntry['blockId'];
                    var lastJournalBlockHeight = lastJournalEntry['blockHeight'];

                    await rclient.set('SSLP_lastscanblock', Big(lastJournalBlockHeight).toFixed(0));
                    await rclient.set('SSLP_lastblockid', lastJournalBlockId);

                    console.log('ROLLBACK TO: ' + lastJournalID + ":" + lastJournalBlockHeight + ":" + lastJournalBlockId);

                    // Update Counters to new top Journal
                    await qdb.updateDocument('counters', { "collection": "journal", "field": "id" }, { "current": parseInt(lastJournalID) });

                    // Rebuild DB via Journal

                    var jLimit = 1000;
                    var jStart = 0;
                    var jContinue = 1;

                    while (jContinue == 1) {

                        var getJournals = await qdb.findDocumentsWithId('journal', {}, jLimit, { "_id": 1 }, jStart);

                        console.log('Rebuilding ' + getJournals.length + ' Journal Entries....');

                        jStart = jStart + jLimit;

                        for (ji = 0; ji < getJournals.length; ji++) {

                            var journalItem = getJournals[ji];

                            var journalAction = journalItem['action'];
                            var journalCollection = journalItem['collectionName'];
                            var journalField = JSON.parse(journalItem['fieldData']);
                            var journalRecord = JSON.parse(journalItem['recordData']);

                            if (journalAction == 'insert') {

                                await qdb.insertDocument(journalCollection, journalRecord);

                            } else if (journalAction == 'update') {

                                await qdb.updateDocument(journalCollection, journalField, journalRecord);

                            } else {
                                console.log('UNKNOWN Journal Action - FATAL');

                                await rclient.del('SSLP_lastblockid');
                                await rclient.del('SSLP_lastscanblock');

                                await rclient.set('SSLP_ignorerunparameters', '1');
                                process.exit(-1);
                            }

                            lastJournalID = journalItem['_id'];
                            lastJournalBlockId = journalItem['blockId'];
                            lastJournalBlockHeight = journalItem['blockHeight'];

                        }

                        if (getJournals.length < jLimit) jContinue = 0;

                    }

                    await rclient.set('SSLP_lastscanblock', Big(lastJournalBlockHeight).toFixed(0));
                    await rclient.set('SSLP_lastblockid', lastJournalBlockId);
                    await qdb.updateDocument('counters', { "collection": "journal", "field": "id" }, { "current": parseInt(lastJournalID) });

                    console.log('Journal Rebuild Completed..');
                    console.log("lastJournalId: " + lastJournalID);
                    console.log("lastJournalBlockId: " + lastJournalBlockId);
                    console.log("lastJournalBlockHeight: " + lastJournalBlockHeight);

                }

            } catch (e) {

                console.log('Error During Rollback - FATAL');
                console.log(e);
                console.log("Last Journal Entry:");
                console.log(lastJournalEntry);

                await rclient.del('SSLP_lastblockid');
                await rclient.del('SSLP_lastscanblock');

                await rclient.set('SSLP_ignorerunparameters', '1');
                process.exit(-1);
            }

            var endTime = (new Date()).getTime();

            var elapsedTime = (endTime - startTime) / 1000;

            console.log('Rollback completed in ' + elapsedTime + ' seconds');

            resolve(true);

        })();

    });

}

function doScan() {

    (async() => {

        scanLock = true;
        scanLockTimer = Math.floor(new Date() / 1000);

        var reply = await rclient.get('SSLP_lastscanblock');

        if (reply == null) {
            scanBlockId = SSLPactivationHeight;
        } else {
            scanBlockId = parseInt(reply);
        }

        //

        var replytwo = await rclient.get('SSLP_lastblockid');

        if (replytwo == null) {
            lastBlockId = '';
        } else {
            lastBlockId = replytwo;
        }

        //

        console.log('Scanning from Height: #' + scanBlockId + '.....');

        var currentHeight = 0;

		/*
        var pgclient = new Client({ user: iniconfig.pg_username, database: iniconfig.pg_database, password: iniconfig.pg_password });
        await pgclient.connect()
        var message = await pgclient.query('SELECT * FROM blocks ORDER BY height DESC LIMIT 1');
        */
        
		let blockInfo = await wsClient.get("blocks?limit=1");
        
        if (blockInfo && blockInfo.data && blockInfo.data.length > 0) 
        {
        
        	currentHeight = parseInt(blockInfo.data[0].height);

        	console.log('New SSLP Block Height: #' + currentHeight);

			var mclient = await qdb.connect();
			qdb.setClient(mclient);

			await whilstScanBlocks(scanBlockId, currentHeight, wsClient, qdb);
			
		}
		else
		{
		
			console.log('Unable to get last block information..');
			process.exit(-1);
		
		}

    })();

}


async function whilstScanBlocks(count, max, wsClient, qdb) {

    return new Promise((resolve) => {

        asyncv3.whilst(
            function test(cb) { cb(null, count < max) },
            function iter(callback) {

                (async() => {

                    if (shuttingdown == true) {

                        safetoshutdown = true;

                    } else {

                        count++;

                        scanLockTimer = Math.floor(new Date() / 1000);

                        if (count % 1000 == 0 || count == max) console.log("Next scan from Height: #" + count);

                        //var message = await pgclient.query('SELECT id, number_of_transactions, height, previous_block FROM blocks WHERE height = $1 LIMIT 1', [count]);

						let message = await wsClient.get("blocks?height=" + count);

                        if (message && message.data) {

                            let blockdata = message.data[0];
                            
                            if (blockdata && blockdata.id) {

                                let blockidcode = blockdata.id;
                                let blocktranscount = blockdata.transactions;
                                let thisblockheight = blockdata.height;
                                let previousblockid = blockdata.previous;


//console.log(blockdata);

                                if (lastBlockId != previousblockid && thisblockheight > 1) {

                                    // New code attempts a rollback

                                    let rollbackHeight = thisblockheight - 5;
                                    if (rollbackHeight < 0) {

                                        console.log('Error:	 Last Block ID is incorrect!  Rescan Required!');

                                        console.log("Expected: " + previousblockid);
                                        console.log("Received: " + lastBlockId);
                                        console.log("ThisBlockHeight: " + thisblockheight);
                                        console.log("LastScanBlock: " + count);

                                        await rclient.del('SSLP_lastblockid');
                                        await rclient.del('SSLP_lastscanblock');

                                        await rclient.set('SSLP_ignorerunparameters', '1');
                                        process.exit(-1);

                                    } else {

                                        console.log('Error:	 Last Block ID is incorrect!  Attempting to rollback 5 blocks!');

                                        await rebuildDbFromJournal(rollbackHeight, qdb);

                                        await rclient.set('SSLP_ignorerunparameters', '1');
                                        process.exit(-1);

                                    }


                                } else {

                                    lastBlockId = blockidcode;
                                    processedItems = false;
                                    
                                    if (parseInt(blocktranscount) > 0 && thisblockheight >= SSLPactivationHeight) {

                                        //var tresponse = await pgclient.query('SELECT * FROM transactions WHERE block_id = $1 ORDER BY sequence ASC', [blockidcode]);
                                        
										let tresponse = await wsClient.get("blocks/" + blockidcode + "/transactions");

                                        if (tresponse && tresponse.data) {

                                            for (let ti = 0; ti < tresponse.data.length; ti++) {

                                                let origtxdata = tresponse.data[ti];
                                                
                                                if (origtxdata.asset && origtxdata.asset.transfers && origtxdata.asset.transfers.length > 0 && origtxdata.memo && origtxdata.memo != '')
                                                {

													let txdata = {};
													txdata.id = origtxdata.id
													txdata.blockId = origtxdata.blockId;
													txdata.version = origtxdata.version;
													txdata.type = origtxdata.type;
													txdata.amount = origtxdata.asset.transfers[0].amount;
													txdata.fee = origtxdata.fee;
													txdata.sender = SolarIdentities.Address.fromPublicKey(origtxdata.senderPublicKey);
													txdata.senderPublicKey = origtxdata.senderPublicKey;
													txdata.recipient = origtxdata.asset.transfers[0].recipientId;
													if (origtxdata.memo != null && origtxdata.memo != '') {
														try {
															txdata.memo = origtxdata.memo;
														} catch (e) {
															txdata.memo = null;
														}
													} else {
														txdata.memo = null;
													}
													txdata.confirmations = origtxdata.confirmations; // parseInt(max) - parseInt(thisblockheight);
													txdata.timestamp = blockdata.timestamp;
													
//console.log(origtxdata);

													var isjson = false;

													try {
														JSON.parse(txdata.memo);
														isjson = true;
													} catch (e) {
														//console.log("memo is not JSON");
													}

													if (isjson === true) {

														var parsejson = JSON.parse(txdata.memo);

														if (parsejson.sslp1) {

															console.log(txdata);

															var txmessage = await qdb.findDocuments('transactions', { "txid": txdata.id });
															if (txmessage.length == 0) {
																try {
																	var SSLPresult = await sslp.parseTransaction(txdata, blockdata, qdb);
																} catch (e) {
																	error_handle(e, 'parseTransaction', 'error');
																}
																processedItems = true;
															} else {
																console.log('ERROR:	 We already have TXID: ' + txdata.id);
															}

														} else if (parsejson.sslp2) {

															console.log(txdata);

															var txmessage = await qdb.findDocuments('metadata', { "txid": txdata.id });
															if (txmessage.length == 0) {
																try {
																	var SSLPresult = await sslp.parseTransaction(txdata, blockdata, qdb);
																} catch (e) {
																	error_handle(e, 'parseTransaction', 'error');
																}
																processedItems = true;
															} else {
																console.log('ERROR:	 We already have TXID: ' + txdata.id);
															}

														}

													}

										

												}

                                            }

                                            await rclient.set('SSLP_lastscanblock', Big(thisblockheight).toFixed(0));
                                            await rclient.set('SSLP_lastblockid', blockidcode);

                                            callback(null, count);


                                        } else {

                                            await rclient.set('SSLP_lastscanblock', Big(thisblockheight).toFixed(0));
                                            await rclient.set('SSLP_lastblockid', blockidcode)

                                            // This needs to be handled.  TODO:	 Missing transactions when there should be some

                                            console.log('Error:  Expecting transactions but there were none...');

                                            callback(null, count);
                                        }



                                    } else {

                                        await rclient.set('SSLP_lastscanblock', Big(thisblockheight).toFixed(0));
                                        await rclient.set('SSLP_lastblockid', blockidcode);

                                        try {
                                            callback(null, count);
                                        } catch (e) {
                                            console.log(e);
                                        }


                                    }

                                }

                            } else {

                                console.log("Block #" + count + " missing blockdata info.. This is a fatal error...");
                                process.exit(-1);

                            }

                        } else {

                            console.log("Block #" + count + " not found in database.. This is a fatal error...");
                            process.exit(-1);

                        }

                    }

                })();

            },
            function(err, n) {

                (async() => {

                    await qdb.close();
                    //await pgclient.end()

                    scanLock = false;
                    scanLockTimer = 0;

                    resolve(true);

                })();

            }

        );

    });

}

function newblocknotify() {

    lastBlockNotify = Math.floor(new Date() / 1000);

    console.log('Found New Blocks............');

    if (scanLock == true) {
        // Check if it is a stale lock (iniconfig.scanlock_staletime >= 90 should work best, less than that and it might not actually be stale...)
        var currentUnixTime = Math.floor(new Date() / 1000);
        if (scanLockTimer < (currentUnixTime - iniconfig.scanlock_staletime)) {
            // force unlock
            console.log("Forcing scanlock Unlock....");
            scanLock = false;
        }


        console.log('Scanner already running...');
    } else {
        downloadChain();
    }

    return true;

}





// Helpers
// ==========================

function hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

function decimalPlaces(num) {
    var match = (Big(num).toString()).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
        -
        (match[2] ? +match[2] : 0));
}

function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);

    var bignum = new Big(num);
    var multiplied = parseInt(bignum.times(calcDec));
    var newbig = new Big(multiplied);
    var returnval = newbig.div(calcDec);

    return returnval.toFixed(dec);
}

function error_handle(error, caller = 'unknown', severity = 'error') {

    var scriptname = 'SSLPParser.js';

    console.log("Error Handle has been called!");

    console.log(error);

    let transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });
    transporter.sendMail({
        from: iniconfig.error_from_email,
        to: iniconfig.error_to_email,
        subject: 'OhNo! Error in ' + scriptname + ' at ' + caller,
        text: 'OhNo! Error in ' + scriptname + ' at ' + caller + '\n\n' + JSON.stringify(error)
    }, (err, info) => {
        console.log(err);
        console.log(info);
    });

}
