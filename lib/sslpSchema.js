/*
*
* SSLP - Version 2.0.0

* Solar Side Ledger Protocol
*
* A simplified token management system for the Solar network
*
* SSLPSchema
*
*/

// SSLP-1 / SSLP-2 Schema and Functions
// ==========================

/* Use Interfaces for Objects */

const implementjs = require('implement-js')
const implement = implementjs.default
const { Interface, type } = implementjs
const Big = require('big.js');
//const SparkMD5 = require('spark-md5'); // Faster than crypto
const crypto = require('crypto');

var sslpSchema = /** @class */ (function() {

    /* Vars */

    const SslpMasterAddress = "SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx";

    const activationHeight = 2031200;
    const activationHeightSslp2 = 2031200;

    // Use default values before these heights
    const mintableActivationHeight = 2031200;
    const pausableActivationHeight = 2031200;
    const pausableActivationHeightSslp2 = 2031200;

    const schemaVersion = 15;

    const SslpTransactionType = {
        "GENESIS": "GENESIS",
        "MINT": "MINT",
        "SEND": "SEND",
        "BURN": "BURN",
        "PAUSE": "PAUSE",
        "RESUME": "RESUME",
        "NEWOWNER": "NEWOWNER",
        "FREEZE": "FREEZE",
        "UNFREEZE": "UNFREEZE"
    };

    const Sslp2TransactionType = {
        "GENESIS": "GENESIS",
        "PAUSE": "PAUSE",
        "RESUME": "RESUME",
        "NEWOWNER": "NEWOWNER",
        "CLONE": "CLONE",
        "ADDMETA": "ADDMETA",
        "VOIDMETA": "VOIDMETA",
        "AUTHMETA": "AUTHMETA",
        "REVOKEMETA": "REVOKEMETA"
    };

    const SslpTransactionTypeHeight = {
        "GENESIS": 2031200,
        "MINT": 2031200,
        "SEND": 2031200,
        "BURN": 2031200,
        "PAUSE": 2031200,
        "RESUME": 2031200,
        "NEWOWNER": 2031200,
        "FREEZE": 2031200,
        "UNFREEZE": 2031200
    };

    const Sslp2TransactionTypeHeight = {
        "GENESIS": 2031200,
        "PAUSE": 2031200,
        "RESUME": 2031200,
        "NEWOWNER": 2031200,
        "CLONE": 2031200,
        "ADDMETA": 2031200,
        "VOIDMETA": 2031200,
        "AUTHMETA": 2031200,
        "REVOKEMETA": 2031200
    };

    /* Fees Milestone */

    const SslpGenesisCostHeight = {
        1: 1,
        2031200: 5000000000
    };

    const Sslp2GenesisCostHeight = {
        1: 1,
        2031200: 5000000000
    };

    const DeniedTickers = ['XQR', 'BTC', 'LTC', 'BCH', 'ETH', 'EOS', 'XRP', 'USDT', 'XMR', 'DASH', 'ETC', 'ARK', 'SXP', 'SOLAR'];

    /* Interfaces */

    /* SSLP-1 */

    const SslpTransactionOutput = Interface('SslpTransactionOutput')({
        schema_version: type('number'),
        address: type('string'),
        amount: type('string')
    }, {
        error: true,
        strict: true
    });

    const SslpTransactionDetails = Interface('SslpTransactionDetails')({
        schema_version: type('number'),
        transactionType: type('string'),
        senderAddress: type('string'),
        tokenIdHex: type('string'),
        versionType: type('number'),
        timestamp: type('string'),
        timestamp_unix: type('number'),
        symbol: type('string'),
        name: type('string'),
        documentUri: type('string'),
        decimals: type('number'),
        genesisOrMintQuantity: type('string'),
        sendOutput: type('object', SslpTransactionOutput),
        note: type('string'),
        amount_sxp: type('string'),
        fee_sxp: type('string')
    }, {
        error: true,
        strict: true
    });

    const SslpTokenDetails = Interface('SslpTokenDetails')({
        schema_version: type('number'),
        ownerAddress: type('string'),
        tokenIdHex: type('string'),
        versionType: type('number'),
        genesis_timestamp: type('string'),
        genesis_timestamp_unix: type('number'),
        symbol: type('string'),
        name: type('string'),
        documentUri: type('string'),
        decimals: type('number'),
        genesisQuantity: type('string'),
        pausable: type('boolean'),
        mintable: type('boolean')
    }, {
        error: true,
        strict: true
    });

    const SslpTokenStats = Interface('SslpTokenStats')({
        schema_version: type('number'),
        block_created_height: type('number'),
        block_created_id: type('string'),
        block_last_active_send: type('number'),
        block_last_active_mint: type('number'),
        creation_transaction_id: type('string'),
        qty_valid_txns_since_genesis: type('number'),
        qty_valid_token_addresses: type('number'),
        qty_token_minted: type('string'),
        qty_token_burned: type('string'),
        qty_token_circulating_supply: type('string'),
        qty_sxp_spent: type('string')
    }, {
        error: true,
        strict: true
    });

    const SslpTokenObject = Interface('SslpTokenObject')({
        schema_version: type('number'),
        type: type('string'),
        paused: type('boolean'),
        tokenDetails: type('object', SslpTokenDetails),
        tokenStats: type('object', SslpTokenStats),
        lastUpdatedBlock: type('number')
    }, {
        error: true,
        strict: true
    });

    const SslpAddressObject = Interface('SslpAddressObject')({
        schema_version: type('number'),
        recordId: type('string'),
        address: type('string'),
        tokenIdHex: type('string'),
        isOwner: type('boolean'),
        tokenBalance: type('string'),
        tokenDecimals: type('number'),
        lastUpdatedBlock: type('number'),
        isActive: type('boolean'),
    }, {
        error: true,
        strict: true
    });

    const SslpTransactionObject = Interface('SslpTransactionObject')({
        schema_version: type('number'),
        txid: type('string'),
        blockId: type('string'),
        blockHeight: type('number'),
        valid: type('boolean'),
        invalidReason: type('string'),
        transactionDetails: type('object', SslpTransactionDetails)
    }, {
        error: true,
        strict: true
    });

    /* SSLP-2 */

    const Sslp2TokenDetails = Interface('Sslp2TokenDetails')({
        schema_version: type('number'),
        ownerAddress: type('string'),
        tokenIdHex: type('string'),
        versionType: type('number'),
        genesis_timestamp: type('string'),
        genesis_timestamp_unix: type('number'),
        symbol: type('string'),
        name: type('string'),
        documentUri: type('string'),
        pausable: type('boolean')
    }, {
        error: true,
        strict: true
    });

    const Sslp2TokenStats = Interface('Sslp2TokenStats')({
        schema_version: type('number'),
        block_created_height: type('number'),
        block_created_id: type('string'),
        block_last_active_meta: type('number'),
        creation_transaction_id: type('string'),
        qty_valid_meta_since_genesis: type('number'),
        qty_valid_metaauth_addresses: type('number'),
        qty_valid_txns_since_genesis: type('number'),
        qty_valid_token_addresses: type('number'),
        qty_sxp_spent: type('string')
    }, {
        error: true,
        strict: true
    });

    const Sslp2TokenObject = Interface('Sslp2TokenObject')({
        schema_version: type('number'),
        type: type('string'),
        paused: type('boolean'),
        parent: type('string'),
        tokenDetails: type('object', Sslp2TokenDetails),
        tokenStats: type('object', Sslp2TokenStats),
        lastUpdatedBlock: type('number')
    }, {
        error: true,
        strict: true
    });

    const Sslp2AddressObject = Interface('Sslp2AddressObject')({
        schema_version: type('number'),
        recordId: type('string'),
        address: type('string'),
        tokenIdHex: type('string'),
        isOwner: type('boolean'),
        isMetaAuth: type('boolean'),
        lastUpdatedBlock: type('number'),
        isActive: type('boolean'),
    }, {
        error: true,
        strict: true
    });

    const Sslp2MetaDetails = Interface('Sslp2MetaDetails')({
        schema_version: type('number'),
        posterAddress: type('string'),
        tokenIdHex: type('string'),
        timestamp: type('string'),
        timestamp_unix: type('number'),
        metaName: type('string'),
        metaChunk: type('number'),
        metaData: type('string')
    }, {
        error: true,
        strict: true
    });

    const Sslp2MetaObject = Interface('Sslp2MetaObject')({
        schema_version: type('number'),
        txid: type('string'),
        blockId: type('string'),
        blockHeight: type('number'),
        metaDetails: type('object', Sslp2MetaDetails),
        void: type('boolean')
    }, {
        error: true,
        strict: true
    });


    const Sslp2TransactionDetails = Interface('Sslp2TransactionDetails')({
        schema_version: type('number'),
        transactionType: type('string'),
        senderAddress: type('string'),
        tokenIdHex: type('string'),
        versionType: type('number'),
        timestamp: type('string'),
        timestamp_unix: type('number'),
        symbol: type('string'),
        name: type('string'),
        documentUri: type('string'),
        note: type('string'),
        amount_sxp: type('string'),
        fee_sxp: type('string')
    }, {
        error: true,
        strict: true
    });

    const Sslp2TransactionObject = Interface('Sslp2TransactionObject')({
        schema_version: type('number'),
        txid: type('string'),
        blockId: type('string'),
        blockHeight: type('number'),
        valid: type('boolean'),
        invalidReason: type('string'),
        transactionDetails: type('object', Sslp2TransactionDetails)
    }, {
        error: true,
        strict: true
    });

    /* Functions */

    function sslpSchema() {
        return this;
    }

    sslpSchema.prototype.getTransactionTypes = function() {

        return SslpTransactionType;

    };

    sslpSchema.prototype.getSslp2TransactionTypes = function() {

        return Sslp2TransactionType;

    };

    sslpSchema.prototype.parseTransaction = function(txdata, bkdata, qdb) {

        return new Promise((resolve, reject) => {

            (async() => {

                var transactionData = txdata;
                var blockData = bkdata;

                var memoData = JSON.parse(txdata.memo);

                console.log(memoData);
                /* SSLP-1 Data Parser */

                if (memoData && memoData.sslp1 && blockData.height >= activationHeight) {

                    console.log('test1');

                    var contractData = memoData.sslp1;

                    // Some Error Checking

                    var validationcheck = true;
                    var invalidreason = '';

                    /*
				
					Token Variables:
						* Creator Provided Vars
							- decimals		(de)
							- symbol		(sy)
							- name			(na)
							- quantity		(qt)
							- documentUri	(du)
							- type			(tp)
							- note			(no)
							- pausable		(pa)
							- mintable		(mi)

						* System Provided Vars
							- tokenIdHex	(id)
				
					*/

                    if (!SslpTransactionType[contractData.tp]) //contractData.tp != 'GENESIS' && contractData.tp != 'MINT' && contractData.tp != 'BURN' && contractData.tp != 'SEND')
                    {
                        // Invalid Type

                        validationcheck = false;
                        invalidreason = 'Unknown Transaction Type';

                    }

                    if (SslpTransactionTypeHeight[contractData.tp] > blockData.height) {
                        // Invalid Type

                        validationcheck = false;
                        invalidreason = 'Method not yet active';

                    }

                    // Let's set a maximum for the quantity field...
                    var maxqt = Big('10000000000000000000');

                    console.log('test2');
                    if (contractData.tp == "GENESIS" || contractData.tp == "SEND" || contractData.tp == "MINT" || contractData.tp == "BURN") {

                        try {

                            var testnumber = Big(contractData.qt);

                            if (testnumber.lt(1) || testnumber.gt(maxqt)) // || !Number.isInteger(contractData.qt))
                            {
                                // Quantity cannot be less than one and must me an integer

                                validationcheck = false;
                                invalidreason = 'Quantity cannot be less than one and must me an integer';

                            }


                        } catch (e) {

                            // Quantity is not a number

                            validationcheck = false;
                            invalidreason = 'Quantity is not a number';

                        }

                    }

                    if (contractData.tp == 'GENESIS') {

                        try {

                            var testdigits = Big(contractData.de);

                        } catch (e) {

                            // Digits is not a number

                            validationcheck = false;
                            invalidreason = 'Decimals must be a number';

                        }

                        // Check Transaction Cost
                        var GenesisTransactionCost = Big(1);
                        for (var costHeight in SslpGenesisCostHeight) {
                            console.log(costHeight + ": " + SslpGenesisCostHeight[costHeight]);

                            var bigCostHeight = Big(costHeight);
                            var bigTestHeight = Big(blockData.height);
                            if (bigTestHeight.gte(bigCostHeight)) {
                                GenesisTransactionCost = Big(SslpGenesisCostHeight[costHeight]);
                            }
                        }

                        var totalFeesAmount = Big(transactionData.amount).plus(transactionData.fee);

                        if (GenesisTransactionCost.gt(totalFeesAmount)) {
                            validationcheck = false;
                            invalidreason = 'Generation Fee unsufficient.  ' + GenesisTransactionCost.toFixed(0) + ' SXP required';
                        }

                        if (!contractData.de || testdigits.lt(0) || testdigits.gt(8)) // || !Number.isInteger(contractData.de))
                        {
                            // Decimal formatting issue.  Should be a number between 0 and 8

                            validationcheck = false;
                            invalidreason = 'Decimal formatting issue.	Should be a number between 0 and 8';

                        }

                        if (contractData.sy.length < 3 || contractData.sy.length > 24) {

                            // Symbol (Ticker) size issue.	Should be a string between 3 and 24 characters

                            validationcheck = false;
                            invalidreason = 'Symbol length issue.  Should be a string between 3 and 8 characters';

                        }

                        if (DeniedTickers.indexOf(contractData.sy.toUpperCase()) > -1) {

                            validationcheck = false;
                            invalidreason = 'Symbol rejected.  This is a reserved ticker.';

                        }

                        if (contractData.na.length < 3 || contractData.na.length > 24) {

                            // Token name size issue.  Should be a string between 3 and 24 characters

                            validationcheck = false;
                            invalidreason = 'Token name length issue.  Should be a string between 3 and 24 characters';

                        }

                        if (contractData.du && contractData.du.length > 180) {

                            // Document Uri size issue.	 Should be a string no more than 180 characters, or it can be empty

                            validationcheck = false;
                            invalidreason = 'Token document uri too long.  Should be empty or no more than 180 characters';

                        }

                        if (contractData.no && contractData.no.length > 180) {

                            // Note size issue.	 Should be a string no more than 180 characters, or it can be empty

                            validationcheck = false;
                            invalidreason = 'Note field too long.  Should be empty or no more than 180 characters';

                        }

                        if (contractData.pa && contractData.pa.toString() == "true") {

                            contractData.pa = true;

                        } else if (contractData.pa && contractData.pa.toString() == "false") {

                            contractData.pa = false;

                        } else {
                            if (pausableActivationHeight > blockData.height) {
                                contractData.pa = true;
                            } else {
                                contractData.pa = false;
                            }
                        }

                        if (contractData.mi && contractData.mi.toString() == "true") {

                            contractData.mi = true;

                        } else if (contractData.mi && contractData.mi.toString() == "false") {

                            contractData.mi = false;

                        } else {
                            if (mintableActivationHeight > blockData.height) {
                                contractData.mi = true;
                            } else {
                                contractData.mi = false;
                            }
                        }

                    } else if (!contractData.id) {

                        var regtest = /[0-9A-Fa-f]{32}/g;

                        if (!contractData.id) {

                            // ID variable is required for MINT, BURN, and SEND

                            validationcheck = false;
                            invalidreason = 'ID variable is required for MINT, BURN, SEND, PAUSE, and RESUME';

                        } else if (!regtest.test(contractData.id)) {

                            // ID variable should be a hexidecimal number

                            validationcheck = false;
                            invalidreason = 'ID variable should be a 32 character hexidecimal number';

                        }

                    }
                    console.log('test3');
                    if (validationcheck === false) {

                        var TransactionOutput = {
                            schema_version: schemaVersion,
                            address: transactionData.sender,
                            amount: '0'
                        }

                        var TransactionDetails = {
                            schema_version: schemaVersion,
                            transactionType: 'ERROR',
                            senderAddress: transactionData.sender,
                            tokenIdHex: '',
                            versionType: 1,
                            timestamp: transactionData.timestamp.human,
                            timestamp_unix: transactionData.timestamp.unix,
                            symbol: '',
                            name: '',
                            documentUri: '',
                            decimals: 0,
                            genesisOrMintQuantity: '0',
                            sendOutput: TransactionOutput,
                            note: '',
                            amount_sxp: Big(transactionData.amount).toFixed(0),
                            fee_sxp: Big(transactionData.fee).toFixed(0)
                        }

                        var TransactionObject = {
                            schema_version: schemaVersion,
                            txid: transactionData.id,
                            blockId: blockData.id,
                            blockHeight: blockData.height,
                            valid: false,
                            invalidReason: invalidreason,
                            transactionDetails: TransactionDetails
                        }

                        await qdb.insertDocument('transactions', TransactionObject);

                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);

                        resolve(false);

                    } else {

                        console.log('test4');
                        // End Error Checking

                        if (contractData.tp == 'GENESIS' && transactionData.recipient == SslpMasterAddress) {
                            // New Token Request

                            var failed = false;

                            var genesisAmount = Big(contractData.qt);

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: genesisAmount.toFixed(0)
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var rawTokenId = 'SSLP1.' + contractData.sy + '.' + blockData.height + '.' + transactionData.id;
                            //var tokenId = SparkMD5.hash(rawTokenId);
                            var tokenId = crypto.createHash('sha256').update(rawTokenId).digest('hex');


                            var tSymbol = contractData.sy.toUpperCase();
                            var tName = contractData.na;

                            var tDecimals = parseInt(contractData.de);

                            if (contractData.du) tDocumentUri = contractData.du
                            else tDocumentUri = '';

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'GENESIS',
                                senderAddress: transactionData.sender,
                                tokenIdHex: tokenId,
                                versionType: 1,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: tSymbol,
                                name: tName,
                                documentUri: tDocumentUri,
                                decimals: tDecimals,
                                genesisOrMintQuantity: genesisAmount.toFixed(0),
                                sendOutput: TransactionOutput,
                                note: tNote,
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            try {

                                implement(SslpTransactionDetails)(TransactionDetails);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var TokenDetails = {
                                schema_version: schemaVersion,
                                ownerAddress: transactionData.sender,
                                tokenIdHex: tokenId,
                                versionType: 1,
                                genesis_timestamp: transactionData.timestamp.human,
                                genesis_timestamp_unix: transactionData.timestamp.unix,
                                symbol: tSymbol,
                                name: tName,
                                documentUri: tDocumentUri,
                                decimals: tDecimals,
                                genesisQuantity: genesisAmount.toFixed(0),
                                pausable: contractData.pa,
                                mintable: contractData.mi
                            }

                            try {

                                implement(SslpTokenDetails)(TokenDetails);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }


                            var TokenStats = {
                                schema_version: schemaVersion,
                                block_created_height: blockData.height,
                                block_created_id: blockData.id,
                                block_last_active_send: 0,
                                block_last_active_mint: blockData.height,
                                creation_transaction_id: transactionData.id,
                                qty_valid_txns_since_genesis: 0,
                                qty_valid_token_addresses: 1,
                                qty_token_minted: genesisAmount.toFixed(0),
                                qty_token_burned: "0",
                                qty_token_circulating_supply: genesisAmount.toFixed(0),
                                qty_sxp_spent: Big(transactionData.amount).toFixed(0)
                            }

                            try {

                                implement(SslpTokenStats)(TokenStats);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }



                            var TokenObject = {
                                schema_version: schemaVersion,
                                type: 'SSLP1',
                                paused: false,
                                tokenDetails: TokenDetails,
                                tokenStats: TokenStats,
                                lastUpdatedBlock: blockData.height
                            }

                            try {

                                implement(SslpTokenObject)(TokenObject);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var rawRecordId = transactionData.sender + '.' + tokenId;
                            //var recordId = SparkMD5.hash(rawRecordId);
                            var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                            var AddressObject = {
                                schema_version: schemaVersion,
                                recordId: recordId,
                                address: transactionData.sender,
                                tokenIdHex: tokenId,
                                isOwner: true,
                                tokenBalance: genesisAmount.toFixed(0),
                                tokenDecimals: tDecimals,
                                lastUpdatedBlock: blockData.height,
                                isActive: true
                            }

                            try {

                                implement(SslpAddressObject)(AddressObject);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }


                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: true,
                                invalidReason: '',
                                transactionDetails: TransactionDetails
                            }

                            try {

                                implement(SslpTransactionObject)(TransactionObject);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            console.log('-------------------------------------');
                            console.log('Token Object');
                            console.log(TokenObject);
                            console.log('Address Object');
                            console.log(AddressObject);
                            console.log('Transaction Object');
                            console.log(TransactionObject);
                            console.log('-------------------------------------');

                            if (failed === false) {

                                await qdb.insertDocument('tokens', TokenObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'tokens', {}, TokenObject);


                                await qdb.insertDocument('addresses', AddressObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);


                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                resolve(true);

                            } else {

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'GENESIS',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: '',
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Genesis Failed',
                                    transactionDetails: TransactionDetails
                                }


                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);

                                resolve(false);


                            }

                        } else if (contractData.tp == 'MINT' && transactionData.recipient == SslpMasterAddress) {
                            // Mint more tokens

                            var failed = false;

                            var mintAmount = Big(contractData.qt);

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: mintAmount.toFixed(0)
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            // Check if it actually exists
                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'MINT',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Mint Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'MINT',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Mint Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Mint failed:  Not the token owner');

                                resolve(false);

                            } else if (findToken.tokenDetails.mintable != true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'MINT',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Mint Failed - Not Mintable',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Mint failed:  Not mintable');

                                resolve(false);

                            } else if (findToken.paused == true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'MINT',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Mint Failed - Token is Paused',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Mint failed:  Token is paused');

                                resolve(false);

                            } else {

                                // It's ok

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;


                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'MINT',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: mintAmount.toFixed(0),
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                try {

                                    implement(SslpTransactionDetails)(TransactionDetails);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }


                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: true,
                                    invalidReason: '',
                                    transactionDetails: TransactionDetails
                                }

                                try {

                                    implement(SslpTransactionObject)(TransactionObject);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }

                                console.log('-------------------------------------');
                                console.log('Transaction Object');
                                console.log(TransactionObject);
                                console.log('-------------------------------------');

                                if (failed === false) {

                                    var rawRecordId = transactionData.sender + '.' + tokenId;
                                    //var recordId = SparkMD5.hash(rawRecordId);
                                    var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                    var findAddress = await qdb.findDocument('addresses', { "recordId": recordId });
                                    if (findAddress == null) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'MINT',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Mint Failed - Address Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Mint to addresses not found');

                                        resolve(false);

                                    } else {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var senderbalance = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.sendOutput.address": findAddress.address }, 'transactionDetails.sendOutput.amount');

                                        var senderbalancesend = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.senderAddress": findAddress.address, "transactionDetails.transactionType": "SEND" }, 'transactionDetails.sendOutput.amount');

                                        var totalsenderbalance = Big(senderbalance).minus(senderbalancesend);

                                        await qdb.updateDocument('addresses', { "recordId": recordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": recordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var totalMinted = Big(findToken.tokenStats.qty_token_minted).plus(mintAmount);
                                        var circSupply = Big(findToken.tokenStats.qty_token_circulating_supply).plus(mintAmount);

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_mint": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_token_minted": totalMinted.toFixed(0), "tokenStats.qty_token_circulating_supply": circSupply.toFixed(0), "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_mint": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_token_minted": totalMinted.toFixed(0), "tokenStats.qty_token_circulating_supply": circSupply.toFixed(0), "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    }

                                } else {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'MINT',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Mint Failed - General Error',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    resolve(false);

                                }

                            }

                        } else if (contractData.tp == 'SEND') {
                            // Send tokens to another address

                            var failed = false;

                            var sendAmount = Big(contractData.qt);

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.recipient,
                                amount: sendAmount.toFixed(0)
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'SEND',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Send Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else {


                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;


                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'SEND',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                try {

                                    implement(SslpTransactionDetails)(TransactionDetails);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }


                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: true,
                                    invalidReason: '',
                                    transactionDetails: TransactionDetails
                                }

                                try {

                                    implement(SslpTransactionObject)(TransactionObject);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }

                                console.log('-------------------------------------');
                                console.log('Transaction Object');
                                console.log(TransactionObject);
                                console.log('-------------------------------------');

                                if (failed === false) {

                                    // Sender //

                                    var srawRecordId = transactionData.sender + '.' + tokenId;
                                    //var srecordId = SparkMD5.hash(srawRecordId);
                                    var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                    var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });
                                    if (findSenderAddress == null) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.recipient,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'SEND',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Send Failed - Sender Address Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender addresses not found');

                                        resolve(false);

                                    } else if (findSenderAddress.isActive == false) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.recipient,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'SEND',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Send Failed - Sender Address Frozen',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender addresses frozen');

                                        resolve(false);

                                    } else if (Big(findSenderAddress.tokenBalance).lt(sendAmount)) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.recipient,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'SEND',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Send Failed - Insufficient Funds',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender does not have enough funds');

                                        resolve(false);

                                    } else if (findToken.paused == true) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.recipient,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'SEND',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Send Failed - Token is Paused',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Token is paused');

                                        resolve(false);

                                    } else {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var senderbalance = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.sendOutput.address": findSenderAddress.address }, 'transactionDetails.sendOutput.amount');

                                        var senderbalancesend = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.senderAddress": findSenderAddress.address, "transactionDetails.transactionType": "SEND" }, 'transactionDetails.sendOutput.amount');

                                        var totalsenderbalance = Big(senderbalance).minus(senderbalancesend);

                                        await qdb.updateDocument('addresses', { "recordId": srecordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": srecordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });


                                        // Recipient

                                        var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                        //var rrecordId = SparkMD5.hash(rrawRecordId);
                                        var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');

                                        var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });
                                        if (findRecipientAddress == null) {

                                            // Create New Record

                                            var AddressObject = {
                                                schema_version: schemaVersion,
                                                recordId: rrecordId,
                                                address: transactionData.recipient,
                                                tokenIdHex: tokenId,
                                                isOwner: false,
                                                tokenBalance: sendAmount.toFixed(0),
                                                tokenDecimals: tDecimals,
                                                lastUpdatedBlock: blockData.height,
                                                isActive: true
                                            }

                                            try {

                                                implement(SslpAddressObject)(AddressObject);

                                            } catch (e) {

                                                console.log(e);

                                            }


                                            await qdb.insertDocument('addresses', AddressObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);


                                        } else {

                                            // Update Record

                                            var senderbalance = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.sendOutput.address": findRecipientAddress.address }, 'transactionDetails.sendOutput.amount');

                                            var senderbalancesend = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.senderAddress": findRecipientAddress.address, "transactionDetails.transactionType": "SEND" }, 'transactionDetails.sendOutput.amount');

                                            var totalsenderbalance = Big(senderbalance).minus(senderbalancesend);

                                            await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });


                                        }



                                        var newTokenAddrs = await qdb.findDocumentCount('addresses', { "tokenIdHex": tokenId });

                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_send": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_token_addresses": newTokenAddrs, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_send": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_token_addresses": newTokenAddrs, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    }

                                } else {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.recipient,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'SEND',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Send Failed - General Error',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    resolve(false);

                                }

                            }

                        } else if (contractData.tp == 'BURN' && transactionData.recipient == SslpMasterAddress) {
                            // Burn tokens

                            var failed = false;

                            var burnAmount = Big(contractData.qt).times(-1);
                            var absBurnAmount = Big(contractData.qt);

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: burnAmount.toFixed(0)
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            var srawRecordId = transactionData.sender + '.' + tokenId;
                            //var srecordId = SparkMD5.hash(srawRecordId);
							var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');
							
                            var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'BURN',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Burn Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'BURN',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Burn Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Burn failed:  Not the token owner');

                                resolve(false);

                            } else if (findToken.paused == true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'BURN',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Burn Failed - Token is Paused',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Burn failed:  Token is paused');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                if (findSenderAddress == null) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'BURN',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Burn Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender addresses not found');

                                    resolve(false);

                                } else if (Big(findSenderAddress.tokenBalance).lt(absBurnAmount)) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'BURN',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Burn Failed - Insufficient Funds',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender does not have enough funds');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'BURN',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: burnAmount.toFixed(0),
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(SslpTransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(SslpTransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {

                                        var rawRecordId = transactionData.sender + '.' + tokenId;
                                        //var recordId = SparkMD5.hash(rawRecordId);
                                        var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                        var findAddress = await qdb.findDocument('addresses', { "recordId": recordId });
                                        if (findAddress == null) {

                                            console.log('Error: Address not found');
                                            resolve(false);
                                            return;

                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var senderbalance = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.sendOutput.address": findAddress.address }, 'transactionDetails.sendOutput.amount');

                                        var senderbalancesend = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true, "transactionDetails.senderAddress": findAddress.address, "transactionDetails.transactionType": "SEND" }, 'transactionDetails.sendOutput.amount');

                                        var totalsenderbalance = Big(senderbalance).minus(senderbalancesend);

                                        await qdb.updateDocument('addresses', { "recordId": recordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": recordId }, { "tokenBalance": totalsenderbalance.toFixed(0), "lastUpdatedBlock": blockData.height });


                                        var totalBurned = Big(findToken.tokenStats.qty_token_burned).plus(absBurnAmount);
                                        var circSupply = Big(findToken.tokenStats.qty_token_circulating_supply).plus(burnAmount);

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_token_burned": totalBurned.toFixed(0), "tokenStats.qty_token_circulating_supply": circSupply.toFixed(0), "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_token_burned": totalBurned.toFixed(0), "tokenStats.qty_token_circulating_supply": circSupply.toFixed(0), "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'BURN',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Burn Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if (contractData.tp == 'PAUSE' && transactionData.recipient == SslpMasterAddress) {

                            // Pause Contract

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: "0"
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            var srawRecordId = transactionData.sender + '.' + tokenId;
                            //var srecordId = SparkMD5.hash(srawRecordId);
                            var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                            var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'PAUSE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Pause Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'PAUSE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Pause Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Pause failed:	Not the token owner');

                                resolve(false);

                            } else if (findToken.tokenDetails.pausable != true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'PAUSE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Pause Failed - Not Pausable',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Pause failed:	Not pausable');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                if (findSenderAddress == null) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'PAUSE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Pause Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else if (findToken.paused == true) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'PAUSE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Pause Failed - Already Paused',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Contract is already paused');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'PAUSE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(SslpTransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(SslpTransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {

                                        var rawRecordId = transactionData.sender + '.' + tokenId;
                                        //var recordId = SparkMD5.hash(rawRecordId);
                                        var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                        var findAddress = await qdb.findDocument('addresses', { "recordId": recordId });
                                        if (findAddress == null) {

                                            console.log('Error: Address not found');
                                            resolve(false);
                                            return;

                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": true, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": true, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'PAUSE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Pause Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }

                        } else if (contractData.tp == 'RESUME' && transactionData.recipient == SslpMasterAddress) {

                            // Resume Contract

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: "0"
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            var srawRecordId = transactionData.sender + '.' + tokenId;
                            //var srecordId = SparkMD5.hash(srawRecordId);
                            var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                            var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'RESUME',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Resume Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.sender,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'RESUME',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Resume Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Resume failed:	 Not the token owner');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                if (findSenderAddress == null) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'RESUME',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Resume Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else if (findToken.paused == false) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.sender,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'RESUME',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Resume Failed - Not Paused',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Contract is not paused');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'RESUME',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(SslpTransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(SslpTransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {

                                        var rawRecordId = transactionData.sender + '.' + tokenId;
                                        //var recordId = SparkMD5.hash(rawRecordId);
                                        var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                        var findAddress = await qdb.findDocument('addresses', { "recordId": recordId });
                                        if (findAddress == null) {

                                            console.log('Error: Address not found');
                                            resolve(false);
                                            return;

                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": false, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": false, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'RESUME',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Resume Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }

                        } else if (contractData.tp == 'NEWOWNER' && transactionData.recipient != SslpMasterAddress) {

                            // Assign new ownership of token

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.recipient,
                                amount: "0"
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'NEWOWNER',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token NewOwner Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'NEWOWNER',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token NewOwner Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('New Ownership failed:	Not the token owner');

                                resolve(false);

                            } else if (findToken.paused == true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'NEWOWNER',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token NewOwner Failed - Token is Paused',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('New ownership failed:	Token is paused');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;


                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });


                                if (findSenderAddress == null) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.recipient,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'NEWOWNER',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token NewOwner Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'NEWOWNER',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(SslpTransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(SslpTransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {


                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        // Sender no longer owner

                                        await qdb.updateDocument('addresses', { "recordId": srecordId }, { "isOwner": false, "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": srecordId }, { "isOwner": false, "lastUpdatedBlock": blockData.height });


                                        // Recipient

                                        var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                        //var rrecordId = SparkMD5.hash(rrawRecordId);
                                        var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');

                                        var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });

                                        if (findRecipientAddress == null) {

                                            // Create New Record

                                            var AddressObject = {
                                                schema_version: schemaVersion,
                                                recordId: rrecordId,
                                                address: transactionData.recipient,
                                                tokenIdHex: tokenId,
                                                isOwner: true,
                                                tokenBalance: "0",
                                                tokenDecimals: tDecimals,
                                                lastUpdatedBlock: blockData.height,
                                                isActive: true
                                            }

                                            try {

                                                implement(SslpAddressObject)(AddressObject);

                                            } catch (e) {

                                                console.log(e);

                                            }


                                            await qdb.insertDocument('addresses', AddressObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);



                                        } else {

                                            // Update Record
                                            await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "isOwner": true, "lastUpdatedBlock": blockData.height });

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "isOwner": true, "lastUpdatedBlock": blockData.height });


                                        }

                                        //

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "tokenDetails.ownerAddress": transactionData.recipient, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "tokenDetails.ownerAddress": transactionData.recipient, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'NEWOWNER',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token NewOwner Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if (contractData.tp == 'FREEZE' && transactionData.recipient != SslpMasterAddress) {

                            // Freeze Address for Token

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.recipient,
                                amount: "0"
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'FREEZE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address Freeze Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'FREEZE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address Freeze Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Freeze failed: Not the token owner');

                                resolve(false);

                            } else if (transactionData.recipient == transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'FREEZE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address Freeze Failed - Cannot Freeze Self',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Freeze failed: Cannot Freeze Self');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;


                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });


                                if (findSenderAddress == null) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.recipient,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'FREEZE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Address Freeze Failed - Owner Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'FREEZE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(SslpTransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(SslpTransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    //console.log('-------------------------------------');
                                    //console.log('Transaction Object');
                                    //console.log(TransactionObject);
                                    //console.log('-------------------------------------');

                                    var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                    //var rrecordId = SparkMD5.hash(rrawRecordId);
                                    var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');

                                    var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });

                                    if (failed === false && findRecipientAddress !== null) {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        // Set Address Inactive

                                        await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "isActive": false, "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "isActive": false, "lastUpdatedBlock": blockData.height });



                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });



                                        resolve(true);

                                    } else if (findRecipientAddress == null) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'FREEZE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address Freeze Failed - Recipient Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    } else {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'FREEZE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address Freeze Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }

                        } else if (contractData.tp == 'UNFREEZE' && transactionData.recipient != SslpMasterAddress) {

                            // Un-Freeze Address for Token

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.recipient,
                                amount: "0"
                            }

                            try {

                                implement(SslpTransactionOutput)(TransactionOutput);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP1" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;
                                var tDecimals = 0;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'UNFREEZE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address UnFreeze Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'UNFREEZE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address UnFreeze Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Freeze failed: Not the token owner');

                                resolve(false);

                            } else if (transactionData.recipient == transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;

                                var TransactionOutput = {
                                    schema_version: schemaVersion,
                                    address: transactionData.recipient,
                                    amount: "0"
                                }

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'UNFREEZE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 1,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    decimals: tDecimals,
                                    genesisOrMintQuantity: "0",
                                    sendOutput: TransactionOutput,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address UnFreeze Failed - Cannot Freeze Self',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Freeze failed: Cannot Freeze Self');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tDecimals = findToken.tokenDetails.decimals;


                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });


                                if (findSenderAddress == null) {

                                    var TransactionOutput = {
                                        schema_version: schemaVersion,
                                        address: transactionData.recipient,
                                        amount: "0"
                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'UNFREEZE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Address UnFreeze Failed - Owner Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'UNFREEZE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 1,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        decimals: tDecimals,
                                        genesisOrMintQuantity: "0",
                                        sendOutput: TransactionOutput,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(SslpTransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(SslpTransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    //console.log('-------------------------------------');
                                    //console.log('Transaction Object');
                                    //console.log(TransactionObject);
                                    //console.log('-------------------------------------');

                                    var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                    //var rrecordId = SparkMD5.hash(rrawRecordId);
									var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');
									
                                    var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });

                                    if (failed === false && findRecipientAddress !== null) {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        // Set Address Active

                                        await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "isActive": true, "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "isActive": true, "lastUpdatedBlock": blockData.height });


                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else if (findRecipientAddress == null) {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'UNFREEZE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address UnFreeze Failed - Recipient Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    } else {

                                        var TransactionOutput = {
                                            schema_version: schemaVersion,
                                            address: transactionData.sender,
                                            amount: "0"
                                        }

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'UNFREEZE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 1,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            decimals: tDecimals,
                                            genesisOrMintQuantity: "0",
                                            sendOutput: TransactionOutput,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address UnFreeze Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }

                        } else if ((contractData.tp == 'FREEZE' || contractData.tp == 'UNFREEZE') && transactionData.recipient == SslpMasterAddress) {

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: "0"
                            }

                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'ERROR',
                                senderAddress: transactionData.sender,
                                tokenIdHex: '',
                                versionType: 1,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: '',
                                name: '',
                                documentUri: '',
                                decimals: 0,
                                genesisOrMintQuantity: "0",
                                sendOutput: TransactionOutput,
                                note: '',
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: false,
                                invalidReason: 'SSLP1 Token - This command must be sent to the address which to take action,',
                                transactionDetails: TransactionDetails
                            }

                            await qdb.insertDocument('transactions', TransactionObject);

                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                            // Invalid command
                            console.log("SSLP1 - Invalid Command");

                            resolve(false);

                        } else if ((contractData.tp == 'GENESIS' || contractData.tp == 'MINT' || contractData.tp == 'BURN' || contractData.tp == 'PAUSE' || contractData.tp == 'RESUME') && transactionData.recipient != SslpMasterAddress) {

                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: "0"
                            }

                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'ERROR',
                                senderAddress: transactionData.sender,
                                tokenIdHex: '',
                                versionType: 1,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: '',
                                name: '',
                                documentUri: '',
                                decimals: 0,
                                genesisOrMintQuantity: "0",
                                sendOutput: TransactionOutput,
                                note: '',
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: false,
                                invalidReason: 'SSLP1 Token - This command must be sent to the Master SSLP Address: ' + SslpMasterAddress,
                                transactionDetails: TransactionDetails
                            }

                            await qdb.insertDocument('transactions', TransactionObject);

                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                            // Invalid command
                            console.log("SSLP1 - Invalid Command");

                            resolve(false);

                        } else {


                            var TransactionOutput = {
                                schema_version: schemaVersion,
                                address: transactionData.sender,
                                amount: "0"
                            }

                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'ERROR',
                                senderAddress: transactionData.sender,
                                tokenIdHex: '',
                                versionType: 1,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: '',
                                name: '',
                                documentUri: '',
                                decimals: 0,
                                genesisOrMintQuantity: "0",
                                sendOutput: TransactionOutput,
                                note: '',
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: false,
                                invalidReason: 'SSLP1 Token - Invalid Command',
                                transactionDetails: TransactionDetails
                            }

                            await qdb.insertDocument('transactions', TransactionObject);

                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                            // Invalid command
                            console.log("SSLP1 - Invalid Command");

                            resolve(false);

                        }

                    }

                }

                /* SSLP-2 Parser */
                if (memoData && memoData.sslp2 && blockData.height >= activationHeightSslp2) {

                    var contractData = memoData.sslp2;

                    // Some Error Checking

                    var validationcheck = true;
                    var invalidreason = '';

                    /*
				
					SSLP2 Variables:
						* Creator Provided Vars
							- symbol		(sy)
							- name			(na)
							- documentUri	(du)
							- type			(tp)
							- note			(no)
							- pausable		(pa)

						* System Provided Vars
							- tokenIdHex	(id)
				
					*/

                    if (!Sslp2TransactionType[contractData.tp]) {
                        // Invalid Type

                        validationcheck = false;
                        invalidreason = 'Unknown Transaction Type';

                    }

                    if (Sslp2TransactionTypeHeight[contractData.tp] > blockData.height) {
                        // Invalid Type

                        validationcheck = false;
                        invalidreason = 'Method not yet active';

                    }

                    if (contractData.tp == 'GENESIS') {

                        // Check Transaction Cost
                        var GenesisTransactionCost = Big(1);
                        for (var costHeight in Sslp2GenesisCostHeight) {
                            console.log(costHeight + ": " + Sslp2GenesisCostHeight[costHeight]);

                            var bigCostHeight = Big(costHeight);
                            var bigTestHeight = Big(blockData.height);
                            if (bigTestHeight.gte(bigCostHeight)) {
                                GenesisTransactionCost = Big(Sslp2GenesisCostHeight[costHeight]);
                            }
                        }

                        var totalFeesAmount = Big(transactionData.amount).plus(transactionData.fee);

                        if (GenesisTransactionCost.gt(totalFeesAmount)) {
                            validationcheck = false;
                            invalidreason = 'Generation Fee unsufficient.  ' + GenesisTransactionCost.toFixed(0) + ' SXP required';
                        }

                        if (contractData.sy.length < 3 || contractData.sy.length > 8) {

                            // Symbol (Ticker) size issue.	Should be a string between 3 and 8 characters

                            validationcheck = false;
                            invalidreason = 'Symbol length issue.  Should be a string between 3 and 8 characters';

                        }

                        if (DeniedTickers.indexOf(contractData.sy.toUpperCase()) > -1) {

                            validationcheck = false;
                            invalidreason = 'Symbol rejected.  This is a reserved ticker.';

                        }

                        if (contractData.na.length < 3 || contractData.na.length > 24) {

                            // Token name size issue.  Should be a string between 3 and 24 characters

                            validationcheck = false;
                            invalidreason = 'Token name length issue.  Should be a string between 3 and 24 characters';

                        }

                        if (contractData.du && contractData.du.length > 180) {

                            // Document Uri size issue.	 Should be a string no more than 180 characters, or it can be empty

                            validationcheck = false;
                            invalidreason = 'Token document uri too long.  Should be empty or no more than 180 characters';

                        }

                        if (contractData.no && contractData.no.length > 180) {

                            // Note size issue.	 Should be a string no more than 180 characters, or it can be empty

                            validationcheck = false;
                            invalidreason = 'Note field too long.  Should be empty or no more than 180 characters';

                        }

                        if (contractData.pa && contractData.pa.toString() == "true") {

                            contractData.pa = true;

                        } else if (contractData.pa && contractData.pa.toString() == "false") {

                            contractData.pa = false;

                        } else {
                            if (pausableActivationHeightSslp2 > blockData.height) {
                                contractData.pa = true;
                            } else {
                                contractData.pa = false;
                            }
                        }


                    } else if (contractData.tp == 'ADDMETA' || contractData.tp == 'VOIDMETA') {

                        if (!contractData.na) {

                            contractData.na = '';

                        } else if (contractData.na && contractData.na.length > 32) {

                            contractData.na = contractData.na.substr(0, 32);

                        }

                        try {

                            var testdigits = Big(contractData.ch);

                        } catch (e) {

                            // Chunk is not a number - default to 0

                            contractData.ch = 0;

                        }

                        if (!contractData.dt) {

                            contractData.dt = '';

                        }

                    } else if (!contractData.id) {

                        var regtest = /[0-9A-Fa-f]{32}/g;

                        if (!contractData.id) {

                            // ID variable is required for all methods except genesis

                            validationcheck = false;
                            invalidreason = 'ID variable is required for all methods except GENESIS';

                        } else if (!regtest.test(contractData.id)) {

                            // ID variable should be a hexidecimal number

                            validationcheck = false;
                            invalidreason = 'ID variable should be a 32 character hexidecimal number';

                        }

                    }

                    if (validationcheck === false) {

                        var TransactionDetails = {
                            schema_version: schemaVersion,
                            transactionType: 'ERROR',
                            senderAddress: transactionData.sender,
                            tokenIdHex: '',
                            versionType: 2,
                            timestamp: transactionData.timestamp.human,
                            timestamp_unix: transactionData.timestamp.unix,
                            symbol: '',
                            name: '',
                            documentUri: '',
                            note: '',
                            amount_sxp: Big(transactionData.amount).toFixed(0),
                            fee_sxp: Big(transactionData.fee).toFixed(0)
                        }

                        var TransactionObject = {
                            schema_version: schemaVersion,
                            txid: transactionData.id,
                            blockId: blockData.id,
                            blockHeight: blockData.height,
                            valid: false,
                            invalidReason: invalidreason,
                            transactionDetails: TransactionDetails
                        }

                        await qdb.insertDocument('transactions', TransactionObject);

                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);

                        resolve(false);


                    } else {

                        // End Error Checking

                        if (contractData.tp == 'GENESIS' && transactionData.recipient == SslpMasterAddress) {
                            // New Token Request

                            var failed = false;

                            var rawTokenId = 'SSLP2.' + contractData.sy + '.' + blockData.height + '.' + transactionData.id;
                            //var tokenId = SparkMD5.hash(rawTokenId);
                            var tokenId = crypto.createHash('sha256').update(rawTokenId).digest('hex');

                            var tSymbol = contractData.sy.toUpperCase();
                            var tName = contractData.na;

                            if (contractData.du) tDocumentUri = contractData.du
                            else tDocumentUri = '';

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'GENESIS',
                                senderAddress: transactionData.sender,
                                tokenIdHex: tokenId,
                                versionType: 2,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: tSymbol,
                                name: tName,
                                documentUri: tDocumentUri,
                                note: tNote,
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            try {

                                implement(Sslp2TransactionDetails)(TransactionDetails);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var TokenDetails = {
                                schema_version: schemaVersion,
                                ownerAddress: transactionData.sender,
                                tokenIdHex: tokenId,
                                versionType: 2,
                                genesis_timestamp: transactionData.timestamp.human,
                                genesis_timestamp_unix: transactionData.timestamp.unix,
                                symbol: tSymbol,
                                name: tName,
                                documentUri: tDocumentUri,
                                pausable: contractData.pa
                            }

                            try {

                                implement(Sslp2TokenDetails)(TokenDetails);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }


                            var TokenStats = {
                                schema_version: schemaVersion,
                                block_created_height: blockData.height,
                                block_created_id: blockData.id,
                                block_last_active_meta: 0,
                                creation_transaction_id: transactionData.id,
                                qty_valid_txns_since_genesis: 0,
                                qty_valid_token_addresses: 1,
                                qty_valid_meta_since_genesis: 0,
                                qty_valid_metaauth_addresses: 1,
                                qty_sxp_spent: Big(transactionData.amount).toFixed(0)
                            }

                            try {

                                implement(Sslp2TokenStats)(TokenStats);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }



                            var TokenObject = {
                                schema_version: schemaVersion,
                                type: 'SSLP2',
                                paused: false,
                                parent: '',
                                tokenDetails: TokenDetails,
                                tokenStats: TokenStats,
                                lastUpdatedBlock: blockData.height
                            }

                            try {

                                implement(Sslp2TokenObject)(TokenObject);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            var rawRecordId = transactionData.sender + '.' + tokenId;
                            //var recordId = SparkMD5.hash(rawRecordId);
                            var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                            var AddressObject = {
                                schema_version: schemaVersion,
                                recordId: recordId,
                                address: transactionData.sender,
                                tokenIdHex: tokenId,
                                isOwner: true,
                                isMetaAuth: true,
                                lastUpdatedBlock: blockData.height,
                                isActive: true
                            }

                            try {

                                implement(Sslp2AddressObject)(AddressObject);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }


                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: true,
                                invalidReason: '',
                                transactionDetails: TransactionDetails
                            }

                            try {

                                implement(Sslp2TransactionObject)(TransactionObject);

                            } catch (e) {

                                console.log(e);
                                failed = true;

                            }

                            console.log('-------------------------------------');
                            console.log('Token Object');
                            console.log(TokenObject);
                            console.log('Address Object');
                            console.log(AddressObject);
                            console.log('Transaction Object');
                            console.log(TransactionObject);
                            console.log('-------------------------------------');

                            if (failed === false) {

                                await qdb.insertDocument('tokens', TokenObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'tokens', {}, TokenObject);


                                await qdb.insertDocument('addresses', AddressObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);


                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                resolve(true);

                            } else {


                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'GENESIS',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: '',
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Genesis Failed',
                                    transactionDetails: TransactionDetails
                                }


                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                resolve(false);

                            }

                        } else if (contractData.tp == 'PAUSE' && transactionData.recipient == SslpMasterAddress) {

                            // Pause Contract


                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            var srawRecordId = transactionData.sender + '.' + tokenId;
                            //var srecordId = SparkMD5.hash(srawRecordId);
							var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');
							
                            var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'PAUSE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Pause Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'PAUSE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Pause Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Pause failed:	Not the token owner');

                                resolve(false);

                            } else if (findToken.tokenDetails.pausable != true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'PAUSE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Pause Failed - Not Pausable',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Pause failed:	Not pausable');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                if (findSenderAddress == null) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'PAUSE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Pause Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else if (findToken.paused == true) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'PAUSE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Pause Failed - Already Paused',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Contract is already paused');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'PAUSE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {

                                        var rawRecordId = transactionData.sender + '.' + tokenId;
                                        //var recordId = SparkMD5.hash(rawRecordId);
                                        var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                        var findAddress = await qdb.findDocument('addresses', { "recordId": recordId });
                                        if (findAddress == null) {

                                            console.log('Error: Address not found');
                                            resolve(false);
                                            return;

                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": true, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": true, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'PAUSE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Pause Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if (contractData.tp == 'RESUME' && transactionData.recipient == SslpMasterAddress) {

                            // Resume Contract

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            var srawRecordId = transactionData.sender + '.' + tokenId;
                            //var srecordId = SparkMD5.hash(srawRecordId);
                            var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                            var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'RESUME',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Resume Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'RESUME',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Resume Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Resume failed:	 Not the token owner');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                if (findSenderAddress == null) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'RESUME',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Resume Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else if (findToken.paused == false) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'RESUME',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Resume Failed - Not Paused',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Contract is not paused');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'RESUME',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {

                                        var rawRecordId = transactionData.sender + '.' + tokenId;
                                        //var recordId = SparkMD5.hash(rawRecordId);
                                        var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                        var findAddress = await qdb.findDocument('addresses', { "recordId": recordId });
                                        if (findAddress == null) {

                                            console.log('Error: Address not found');
                                            resolve(false);
                                            return;

                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": false, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "paused": false, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'RESUME',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Resume Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }

                        } else if (contractData.tp == 'NEWOWNER' && transactionData.recipient != SslpMasterAddress) {


                            // Assign new ownership of token

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'NEWOWNER',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token NewOwner Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'NEWOWNER',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token NewOwner Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('New Ownership failed:	Not the token owner');

                                resolve(false);

                            } else if (findToken.paused == true) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'NEWOWNER',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token NewOwner Failed - Token is Paused',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('New ownership failed:	Token is paused');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                                if (findSenderAddress == null) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'NEWOWNER',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token NewOwner Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'NEWOWNER',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('-------------------------------------');

                                    if (failed === false) {


                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        // Sender no longer owner

                                        await qdb.updateDocument('addresses', { "recordId": srecordId }, { "isOwner": false, "isMetaAuth": false, "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": srecordId }, { "isOwner": false, "isMetaAuth": false, "lastUpdatedBlock": blockData.height });


                                        // Recipient

                                        var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                        //var rrecordId = SparkMD5.hash(rrawRecordId);
                                        var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');

                                        var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });

                                        if (findRecipientAddress == null) {

                                            // Create New Record

                                            var AddressObject = {
                                                schema_version: schemaVersion,
                                                recordId: rrecordId,
                                                address: transactionData.recipient,
                                                tokenIdHex: tokenId,
                                                isOwner: true,
                                                isMetaAuth: true,
                                                lastUpdatedBlock: blockData.height,
                                                isActive: true
                                            }

                                            try {

                                                implement(Sslp2AddressObject)(AddressObject);

                                            } catch (e) {

                                                console.log(e);

                                            }


                                            await qdb.insertDocument('addresses', AddressObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);



                                        } else {

                                            // Update Record
                                            await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "isOwner": true, "isMetaAuth": true, "lastUpdatedBlock": blockData.height });

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "isOwner": true, "isMetaAuth": true, "lastUpdatedBlock": blockData.height });


                                        }

                                        //

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "tokenDetails.ownerAddress": transactionData.recipient, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "tokenDetails.ownerAddress": transactionData.recipient, "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'NEWOWNER',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token NewOwner Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if (contractData.tp == 'CLONE' && transactionData.recipient == SslpMasterAddress) {

                            // Clone a Token & Set Parent

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'CLONE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Clone Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'CLONE',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Clone Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Clone failed:	Not the token owner');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;
                                var tPausable = findToken.tokenDetails.pausable;

                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                                if (findSenderAddress == null) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'CLONE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Clone Failed - Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else {


                                    var failed = false;

                                    var rawTokenIdClone = 'SSLP2.' + contractData.sy + '.' + blockData.height + '.' + transactionData.id;
                                    //var tokenIdClone = SparkMD5.hash(rawTokenIdClone);
                                    var tokenIdClone = crypto.createHash('sha256').update(rawTokenIdClone).digest('hex');

                                    if (contractData.no) tNote = contractData.no

                                    var TransactionDetailsClone = {
                                        schema_version: schemaVersion,
                                        transactionType: 'CLONE',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetailsclone);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'GENESIS',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenIdClone,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    var TokenDetails = {
                                        schema_version: schemaVersion,
                                        ownerAddress: transactionData.sender,
                                        tokenIdHex: tokenIdClone,
                                        versionType: 2,
                                        genesis_timestamp: transactionData.timestamp.human,
                                        genesis_timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        pausable: tPausable
                                    }

                                    try {

                                        implement(Sslp2TokenDetails)(TokenDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TokenStats = {
                                        schema_version: schemaVersion,
                                        block_created_height: blockData.height,
                                        block_created_id: blockData.id,
                                        block_last_active_meta: 0,
                                        creation_transaction_id: transactionData.id,
                                        qty_valid_txns_since_genesis: 0,
                                        qty_valid_token_addresses: 1,
                                        qty_valid_meta_since_genesis: 0,
                                        qty_valid_metaauth_addresses: 1,
                                        qty_sxp_spent: Big(transactionData.amount).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TokenStats)(TokenStats);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }



                                    var TokenObject = {
                                        schema_version: schemaVersion,
                                        type: 'SSLP2',
                                        paused: false,
                                        parent: tokenIdClone,
                                        tokenDetails: TokenDetails,
                                        tokenStats: TokenStats,
                                        lastUpdatedBlock: blockData.height
                                    }

                                    try {

                                        implement(Sslp2TokenObject)(TokenObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }
                                    //////
                                    var rawRecordId = transactionData.sender + '.' + tokenIdClone;
                                    //var recordId = SparkMD5.hash(rawRecordId);
                                    var recordId = crypto.createHash('sha256').update(rawRecordId).digest('hex');

                                    var AddressObject = {
                                        schema_version: schemaVersion,
                                        recordId: recordId,
                                        address: transactionData.sender,
                                        tokenIdHex: tokenIdClone,
                                        isOwner: true,
                                        isMetaAuth: true,
                                        lastUpdatedBlock: blockData.height,
                                        isActive: true
                                    }

                                    try {

                                        implement(Sslp2AddressObject)(AddressObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    var TransactionObjectClone = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObjectClone);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    console.log('-------------------------------------');
                                    console.log('Token Object');
                                    console.log(TokenObject);
                                    console.log('Address Object');
                                    console.log(AddressObject);
                                    console.log('Transaction Object');
                                    console.log(TransactionObject);
                                    console.log('Transaction Object Clone');
                                    console.log(TransactionObjectClone);
                                    console.log('-------------------------------------');

                                    if (failed === false) {

                                        (async() => {

                                            await qdb.insertDocument('tokens', TokenObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'tokens', {}, TokenObject);


                                            await qdb.insertDocument('addresses', AddressObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);


                                            await qdb.insertDocument('transactions', TransactionObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                            await qdb.insertDocument('transactions', TransactionObjectClone);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObjectClone);


                                            resolve(true);

                                        })();

                                    } else {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'CLONE',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Clone Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if (contractData.tp == 'ADDMETA' && transactionData.recipient == SslpMasterAddress) {

                            // Add Meta Information to a Token


                            var failed = false;

                            try {

                                var chunkNumber = parseInt(Big(contractData.ch).toFixed(0));

                            } catch (e) {

                                var chunkNumber = parseInt(Big(0).toFixed(0));

                            }

                            var metaName = contractData.na;
                            var metaData = contractData.dt;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var tokenId = contractData.id;

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'ADDMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token AddMeta Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else {


                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'ADDMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                try {

                                    implement(Sslp2TransactionDetails)(TransactionDetails);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }


                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: true,
                                    invalidReason: '',
                                    transactionDetails: TransactionDetails
                                }

                                try {

                                    implement(Sslp2TransactionObject)(TransactionObject);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }

                                console.log('-------------------------------------');
                                console.log('Transaction Object');
                                console.log(TransactionObject);
                                console.log('-------------------------------------');

                                if (failed === false) {

                                    // Sender //

                                    var srawRecordId = transactionData.sender + '.' + tokenId;
                                    //var srecordId = SparkMD5.hash(srawRecordId);
                                    var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                    var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });
                                    if (findSenderAddress == null) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'ADDMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token AddMeta Failed - Sender Address Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender addresses not found');

                                        resolve(false);

                                    } else if (findSenderAddress.isMetaAuth == false) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'ADDMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token AddMeta Failed - Sender Address Not Authorized',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender addresses not authorized');

                                        resolve(false);

                                    } else if (findToken.paused == true) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'ADDMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token AddMeta Failed - Token is Paused',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Token is paused');

                                        resolve(false);

                                    } else {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);



                                        // Create New Record

                                        var MetaDetails = {
                                            schema_version: schemaVersion,
                                            posterAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            metaName: metaName,
                                            metaChunk: chunkNumber,
                                            metaData: metaData
                                        }

                                        try {

                                            implement(Sslp2MetaDetails)(MetaDetails);

                                        } catch (e) {

                                            console.log(e);
                                        }

                                        var MetaObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            metaDetails: MetaDetails,
                                            void: false
                                        }

                                        try {

                                            implement(Sslp2MetaObject)(MetaObject);

                                        } catch (e) {

                                            console.log(e);
                                        }

                                        await qdb.insertDocument('metadata', MetaObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'metadata', {}, MetaObject);



                                        var newTokenMetas = await qdb.findDocumentCount('metadata', { "metaDetails.tokenIdHex": tokenId });

                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');


                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_meta": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_meta_since_genesis": newTokenMetas, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_meta": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_meta_since_genesis": newTokenMetas, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    }

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'ADDMETA',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token AddMeta Failed - General Error',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    resolve(false);

                                }

                            }


                        } else if (contractData.tp == 'VOIDMETA' && transactionData.recipient == SslpMasterAddress) {

                            // Add Meta Information to a Token


                            var failed = false;

                            try {

                                var chunkNumber = parseInt(Big(contractData.ch).toFixed(0));

                            } catch (e) {

                                var chunkNumber = parseInt(Big(0).toFixed(0));

                            }

                            var metaName = contractData.na;
                            var metaData = contractData.dt;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var tokenId = contractData.id;

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'VOIDMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token VoidMeta Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else {


                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'VOIDMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                try {

                                    implement(Sslp2TransactionDetails)(TransactionDetails);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }


                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: true,
                                    invalidReason: '',
                                    transactionDetails: TransactionDetails
                                }

                                try {

                                    implement(Sslp2TransactionObject)(TransactionObject);

                                } catch (e) {

                                    console.log(e);
                                    failed = true;

                                }

                                console.log('-------------------------------------');
                                console.log('Transaction Object');
                                console.log(TransactionObject);
                                console.log('-------------------------------------');

                                if (failed === false) {

                                    // Sender //

                                    var srawRecordId = transactionData.sender + '.' + tokenId;
                                    //var srecordId = SparkMD5.hash(srawRecordId);
                                    var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                    var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });
                                    if (findSenderAddress == null) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'VOIDMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token VoidMeta Failed - Sender Address Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender addresses not found');

                                        resolve(false);

                                    } else if (findSenderAddress.isMetaAuth == false) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'VOIDMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token VoidMeta Failed - Sender Address Not Authorized',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Sender addresses not authorized');

                                        resolve(false);

                                    } else if (findToken.paused == true) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'VOIDMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token VoidMeta Failed - Token is Paused',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        console.log('Error: Token is paused');

                                        resolve(false);

                                    } else {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);



                                        // Update Record
                                        /*
                                        										var MetaDetails = {
                                        											schema_version: schemaVersion,
                                        											posterAddress: transactionData.sender,
                                        											tokenIdHex: tokenId,
                                        											timestamp: transactionData.timestamp.human,
                                        											timestamp_unix: transactionData.timestamp.unix,
                                        											metaName: metaName,
                                        											metaChunk: chunkNumber,
                                        											metaData: metaData
                                        										}
										
                                        										try 
                                        										{
                                        				
                                        											implement(Sslp2MetaDetails)(MetaDetails);
										
                                        										} catch (e) {
                                        				
                                        											console.log(e);
                                        										}
										
                                        										var MetaObject = {
                                        											schema_version: schemaVersion,
                                        											txid: transactionData.id,
                                        											blockId: blockData.id,
                                        											blockHeight: blockData.height,
                                        											metaDetails: MetaDetails
                                        										}
										
                                        										try 
                                        										{
                                        				
                                        											implement(Sslp2MetaObject)(MetaObject);
										
                                        										} catch (e) {
                                        				
                                        											console.log(e);
                                        										}
										
                                        										await qdb.insertDocument('metadata', MetaObject);
										
                                        										await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'metadata', {}, MetaObject);
										
										
                                        							
                                        										var newTokenMetas = await qdb.findDocumentCount('metadata', {"metaDetails.tokenIdHex": tokenId });
										
                                        										var newValidTxns = await qdb.findDocumentCount('transactions', {"transactionDetails.tokenIdHex": tokenId, "valid": true });
										
                                        										var sxpspent = await qdb.findDocumentBigSum('transactions', {"transactionDetails.tokenIdHex": tokenId}, 'transactionDetails.amount_sxp');
										
										
                                        										await qdb.updateDocument('tokens', {"tokenDetails.tokenIdHex": tokenId }, {"lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_meta": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_meta_since_genesis": newTokenMetas, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });
										
                                        										await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', {"tokenDetails.tokenIdHex": tokenId }, {"lastUpdatedBlock": blockData.height, "tokenStats.block_last_active_meta": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_meta_since_genesis": newTokenMetas, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });
										
                                        */
                                        resolve(true);

                                    }

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'VOIDMETA',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token VoidMeta Failed - General Error',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    resolve(false);

                                }

                            }


                        } else if (contractData.tp == 'AUTHMETA' && transactionData.recipient != SslpMasterAddress) {


                            // Authorize AddMeta to Address for Token

                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'AUTHMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address AuthMeta Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'AUTHMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address AuthMeta Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('AuthMeta failed: Not the token owner');

                                resolve(false);

                            } else if (transactionData.recipient == transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'AUTHMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address AuthMeta Failed - Owner always authorized',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('AuthMeta failed: Owner always authorized');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                                if (findSenderAddress == null) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'AUTMETA',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Address AuthMeta Failed - Owner Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: AuthMeta Sender address not found');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'AUTHMETA',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    //console.log('-------------------------------------');
                                    //console.log('Transaction Object');
                                    //console.log(TransactionObject);
                                    //console.log('-------------------------------------');

                                    var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                    //var rrecordId = SparkMD5.hash(rrawRecordId);
                                    var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');

                                    var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });

                                    if (failed === false) {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });


                                        if (findRecipientAddress == null) {

                                            // Create New Record

                                            var AddressObject = {
                                                schema_version: schemaVersion,
                                                recordId: rrecordId,
                                                address: transactionData.recipient,
                                                tokenIdHex: tokenId,
                                                isOwner: false,
                                                isMetaAuth: true,
                                                lastUpdatedBlock: blockData.height,
                                                isActive: true
                                            }

                                            try {

                                                implement(Sslp2AddressObject)(AddressObject);

                                            } catch (e) {

                                                console.log(e);

                                            }


                                            await qdb.insertDocument('addresses', AddressObject);

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'addresses', {}, AddressObject);


                                        } else {

                                            // Set MetaAuth Active

                                            await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "isMetaAuth": true, "lastUpdatedBlock": blockData.height });

                                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "isMetaAuth": true, "lastUpdatedBlock": blockData.height });

                                        }

                                        var newTokenAddrs = await qdb.findDocumentCount('addresses', { "tokenIdHex": tokenId });

                                        var newAuthMetaAddrs = await qdb.findDocumentCount('addresses', { $and: [{ "tokenIdHex": tokenId }, { "isAuthMeta": true }] });

                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');


                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_token_addresses": newTokenAddrs, "tokenStats.qty_valid_metaauth_addresses": newAuthMetaAddrs, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_token_addresses": newTokenAddrs, "tokenStats.qty_valid_metaauth_addresses": newAuthMetaAddrs, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'AUTHMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address AuthMeta Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if (contractData.tp == 'REVOKEMETA' && transactionData.recipient != SslpMasterAddress) {

                            // Un-Freeze Address for Token


                            var failed = false;

                            var tokenId = contractData.id;

                            var tNote = '';
                            if (contractData.no) tNote = contractData.no

                            var findToken = await qdb.findDocument('tokens', { $and: [{ "tokenDetails.tokenIdHex": tokenId }, { "type": "SSLP2" }] });

                            // Check if it actually exists

                            if (findToken == null) {

                                var tSymbol = null;
                                var tName = null;
                                var tDocumentUri = null;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'REVOKEMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address RevokeMeta Failed - Token Does Not Exist',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('Token does not exist');

                                resolve(false);

                            } else if (findToken.tokenDetails.ownerAddress != transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'REVOKEMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address RevokeMeta Failed - Not Owner',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('RemoveMeta failed: Not the token owner');

                                resolve(false);

                            } else if (transactionData.recipient == transactionData.sender) {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var TransactionDetails = {
                                    schema_version: schemaVersion,
                                    transactionType: 'REVOKEMETA',
                                    senderAddress: transactionData.sender,
                                    tokenIdHex: tokenId,
                                    versionType: 2,
                                    timestamp: transactionData.timestamp.human,
                                    timestamp_unix: transactionData.timestamp.unix,
                                    symbol: tSymbol,
                                    name: tName,
                                    documentUri: tDocumentUri,
                                    note: tNote,
                                    amount_sxp: Big(transactionData.amount).toFixed(0),
                                    fee_sxp: Big(transactionData.fee).toFixed(0)
                                }

                                var TransactionObject = {
                                    schema_version: schemaVersion,
                                    txid: transactionData.id,
                                    blockId: blockData.id,
                                    blockHeight: blockData.height,
                                    valid: false,
                                    invalidReason: 'Token Address RevokeMeta Failed - Owner always authorized',
                                    transactionDetails: TransactionDetails
                                }

                                await qdb.insertDocument('transactions', TransactionObject);

                                await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                console.log('RevokeMeta failed: Owner always authorized');

                                resolve(false);

                            } else {

                                var tSymbol = findToken.tokenDetails.symbol;
                                var tName = findToken.tokenDetails.name;
                                var tDocumentUri = findToken.tokenDetails.documentUri;

                                var srawRecordId = transactionData.sender + '.' + tokenId;
                                //var srecordId = SparkMD5.hash(srawRecordId);
                                var srecordId = crypto.createHash('sha256').update(srawRecordId).digest('hex');

                                var findSenderAddress = await qdb.findDocument('addresses', { "recordId": srecordId });

                                if (findSenderAddress == null) {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'REVOKEMETA',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: false,
                                        invalidReason: 'Token Address RevokeMeta Failed - Owner Address Not Found',
                                        transactionDetails: TransactionDetails
                                    }

                                    await qdb.insertDocument('transactions', TransactionObject);

                                    await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                    console.log('Error: Sender address not found');

                                    resolve(false);

                                } else {

                                    var TransactionDetails = {
                                        schema_version: schemaVersion,
                                        transactionType: 'REVOKEMETA',
                                        senderAddress: transactionData.sender,
                                        tokenIdHex: tokenId,
                                        versionType: 2,
                                        timestamp: transactionData.timestamp.human,
                                        timestamp_unix: transactionData.timestamp.unix,
                                        symbol: tSymbol,
                                        name: tName,
                                        documentUri: tDocumentUri,
                                        note: tNote,
                                        amount_sxp: Big(transactionData.amount).toFixed(0),
                                        fee_sxp: Big(transactionData.fee).toFixed(0)
                                    }

                                    try {

                                        implement(Sslp2TransactionDetails)(TransactionDetails);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }


                                    var TransactionObject = {
                                        schema_version: schemaVersion,
                                        txid: transactionData.id,
                                        blockId: blockData.id,
                                        blockHeight: blockData.height,
                                        valid: true,
                                        invalidReason: '',
                                        transactionDetails: TransactionDetails
                                    }

                                    try {

                                        implement(Sslp2TransactionObject)(TransactionObject);

                                    } catch (e) {

                                        console.log(e);
                                        failed = true;

                                    }

                                    //console.log('-------------------------------------');
                                    //console.log('Transaction Object');
                                    //console.log(TransactionObject);
                                    //console.log('-------------------------------------');

                                    var rrawRecordId = transactionData.recipient + '.' + tokenId;
                                    //var rrecordId = SparkMD5.hash(rrawRecordId);
                                    var rrecordId = crypto.createHash('sha256').update(rrawRecordId).digest('hex');

                                    var findRecipientAddress = await qdb.findDocument('addresses', { "recordId": rrecordId });

                                    if (failed === false && findRecipientAddress !== null) {

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        var newValidTxns = await qdb.findDocumentCount('transactions', { "transactionDetails.tokenIdHex": tokenId, "valid": true });

                                        // Set Address 

                                        await qdb.updateDocument('addresses', { "recordId": rrecordId }, { "isMetaAuth": false, "lastUpdatedBlock": blockData.height });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'addresses', { "recordId": rrecordId }, { "isMetaAuth": false, "lastUpdatedBlock": blockData.height });


                                        var sxpspent = await qdb.findDocumentBigSum('transactions', { "transactionDetails.tokenIdHex": tokenId }, 'transactionDetails.amount_sxp');

                                        var newAuthMetaAddrs = await qdb.findDocumentCount('addresses', { $and: [{ "tokenIdHex": tokenId }, { "isAuthMeta": true }] });


                                        await qdb.updateDocument('tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_metaauth_addresses": newAuthMetaAddrs, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'update', 'tokens', { "tokenDetails.tokenIdHex": tokenId }, { "lastUpdatedBlock": blockData.height, "tokenStats.qty_valid_txns_since_genesis": newValidTxns, "tokenStats.qty_valid_metaauth_addresses": newAuthMetaAddrs, "tokenStats.qty_sxp_spent": Big(sxpspent).toFixed(0) });


                                        resolve(true);

                                    } else if (findRecipientAddress == null) {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'REVOKEMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address RevokeMeta Failed - Recipient Not Found',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    } else {

                                        var TransactionDetails = {
                                            schema_version: schemaVersion,
                                            transactionType: 'REVOKEMETA',
                                            senderAddress: transactionData.sender,
                                            tokenIdHex: tokenId,
                                            versionType: 2,
                                            timestamp: transactionData.timestamp.human,
                                            timestamp_unix: transactionData.timestamp.unix,
                                            symbol: tSymbol,
                                            name: tName,
                                            documentUri: tDocumentUri,
                                            note: tNote,
                                            amount_sxp: Big(transactionData.amount).toFixed(0),
                                            fee_sxp: Big(transactionData.fee).toFixed(0)
                                        }

                                        var TransactionObject = {
                                            schema_version: schemaVersion,
                                            txid: transactionData.id,
                                            blockId: blockData.id,
                                            blockHeight: blockData.height,
                                            valid: false,
                                            invalidReason: 'Token Address RevokeMeta Failed - General Error',
                                            transactionDetails: TransactionDetails
                                        }

                                        await qdb.insertDocument('transactions', TransactionObject);

                                        await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                                        resolve(false);

                                    }

                                }

                            }


                        } else if ((contractData.tp == 'AUTHMETA' || contractData.tp == 'REVOKEMETA') && transactionData.recipient == SslpMasterAddress) {


                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'ERROR',
                                senderAddress: transactionData.sender,
                                tokenIdHex: '',
                                versionType: 2,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: '',
                                name: '',
                                documentUri: '',
                                note: '',
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: false,
                                invalidReason: 'SSLP2 Token - This command must be sent to the address which to take action,',
                                transactionDetails: TransactionDetails
                            }

                            await qdb.insertDocument('transactions', TransactionObject);

                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                            // Invalid command
                            console.log("SSLP2 - Invalid Command");

                            resolve(false);


                        } else if ((contractData.tp == 'GENESIS' || contractData.tp == 'CLONE' || contractData.tp == 'ADDMETA' || contractData.tp == 'PAUSE' || contractData.tp == 'RESUME') && transactionData.recipient != SslpMasterAddress) {


                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'ERROR',
                                senderAddress: transactionData.sender,
                                tokenIdHex: '',
                                versionType: 2,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: '',
                                name: '',
                                documentUri: '',
                                note: '',
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: false,
                                invalidReason: 'SSLP2 Token - This command must be sent to the Master SSLP Address: ' + SslpMasterAddress,
                                transactionDetails: TransactionDetails
                            }

                            await qdb.insertDocument('transactions', TransactionObject);

                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                            // Invalid command
                            console.log("SSLP2 - Invalid Command");

                            resolve(false);


                        } else {


                            var TransactionDetails = {
                                schema_version: schemaVersion,
                                transactionType: 'ERROR',
                                senderAddress: transactionData.sender,
                                tokenIdHex: '',
                                versionType: 2,
                                timestamp: transactionData.timestamp.human,
                                timestamp_unix: transactionData.timestamp.unix,
                                symbol: '',
                                name: '',
                                documentUri: '',
                                note: '',
                                amount_sxp: Big(transactionData.amount).toFixed(0),
                                fee_sxp: Big(transactionData.fee).toFixed(0)
                            }

                            var TransactionObject = {
                                schema_version: schemaVersion,
                                txid: transactionData.id,
                                blockId: blockData.id,
                                blockHeight: blockData.height,
                                valid: false,
                                invalidReason: 'SSLP2 Token - Invalid Command',
                                transactionDetails: TransactionDetails
                            }

                            await qdb.insertDocument('transactions', TransactionObject);

                            await qdb.createJournalEntry(transactionData.id, blockData.id, blockData.height, transactionData.timestamp.human, transactionData.timestamp.unix, 'insert', 'transactions', {}, TransactionObject);


                            // Invalid command
                            console.log("SSLP2 - Invalid Command");

                            resolve(false);


                        }

                        /* End SSLP-2 */

                    }

                }

            })();
        });

    };

    sslpSchema.prototype.indexDatabase = function(qdb) {

        return new Promise((resolve, reject) => {

            (async() => {

                var mclient = await qdb.connect();
                qdb.setClient(mclient);

                /* SSLP-1 & SSLP-2 */
                response = await qdb.createIndex('tokens', { "tokenDetails.tokenIdHex": 1 }, true);
                response = await qdb.createIndex('tokens', { "tokenDetails.symbol": 1 }, false);
                response = await qdb.createIndex('tokens', { "tokenDetails.name": 1 }, false);
                response = await qdb.createIndex('tokens', { "tokenDetails.ownerAddress": 1 }, false);
                response = await qdb.createIndex('tokens', { "tokenStats.creation_transaction_id": 1 }, false);
                response = await qdb.createIndex('tokens', { "type": 1 }, false);
                response = await qdb.createIndex('tokens', { "parent": 1 }, false);
                response = await qdb.createIndex('tokens', { "lastUpdatedBlock": 1 }, false);

                /* SSLP-1 & SSLP-2 */
                response = await qdb.createIndex('addresses', { "recordId": 1 }, true);
                response = await qdb.createIndex('addresses', { "address": 1 }, false);
                response = await qdb.createIndex('addresses', { "tokenIdHex": 1 }, false);
                response = await qdb.createIndex('addresses', { "isOwner": 1 }, false);
                response = await qdb.createIndex('addresses', { "isMetaAuth": 1 }, false);
                response = await qdb.createIndex('addresses', { "lastUpdatedBlock": 1 }, false);

                /* SSLP-1 & SSLP-2 */
                response = await qdb.createIndex('transactions', { "txid": 1 }, true);
                response = await qdb.createIndex('transactions', { "blockId": 1 }, false);
                response = await qdb.createIndex('transactions', { "blockHeight": 1 }, false);
                response = await qdb.createIndex('transactions', { "transactionDetails.senderAddress": 1 }, false);
                response = await qdb.createIndex('transactions', { "transactionDetails.tokenIdHex": 1 }, false);
                response = await qdb.createIndex('transactions', { "transactionDetails.timestamp_unix": 1 }, false);
                response = await qdb.createIndex('transactions', { "transactionDetails.transactionType": 1 }, false);
                response = await qdb.createIndex('transactions', { "transactionDetails.sendOutput.address": 1 }, false);

                /* SSLP-2 Only */
                response = await qdb.createIndex('metadata', { "txid": 1 }, true);
                response = await qdb.createIndex('metadata', { "blockId": 1 }, false);
                response = await qdb.createIndex('metadata', { "blockHeight": 1 }, false);
                response = await qdb.createIndex('metadata', { "metaDetails.posterAddress": 1 }, false);
                response = await qdb.createIndex('metadata', { "metaDetails.tokenIdHex": 1 }, false);
                response = await qdb.createIndex('metadata', { "metaDetails.timestamp_unix": 1 }, false);
                response = await qdb.createIndex('metadata', { "metaDetails.chunk": 1 }, false);
                response = await qdb.createIndex('metadata', { "metaDetails.name": 1 }, false);

                /* Journal Format 
				
                {
                	_id: autoincrement,
                	txid: ...,
                	blockId: ...,
                	blockHeight: ...,
                	timestamp: ...,
                	timestamp_unix: ...,
                	action: (insert, update, delete),
                	fieldData: (if update or delete),
                	recordData:  ...,  
                	recordHash: ...,  md5(action . jsonencode(fielddata) . jsonencode(actiondata))
                	chainHash: ...	md5(previousrecordhash . thisrecordhash)
				
                }
				
                */
                /* SSLP-1 & SSLP-2 */
                response = await qdb.createIndex('journal', { "txid": 1 }, false);
                response = await qdb.createIndex('journal', { "blockId": 1 }, false);
                response = await qdb.createIndex('journal', { "blockHeight": 1 }, false);
                response = await qdb.createIndex('journal', { "recordHash": 1 }, false);
                response = await qdb.createIndex('journal', { "chainHash": 1 }, false);

                response = await qdb.createIndex('counters', { "collection ": 1, "field": 1 }, true);

                await qdb.close();

                resolve(true);

            })();

        });

    };

    return sslpSchema;

}());

exports.default = sslpSchema;