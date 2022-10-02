/*
 *
 * SSLP - Version 2.0.0
 *
 * Solar Side Ledger Protocol
 *
 * A simplified token management system for the Solar network
 *
 * SSLPDB
 *
 */


/*
 * MongoDB Functions
 */

const { MongoClient } = require('mongodb');
//const autoIncrement = require('mongo-autoincrement')
const assert = require('assert');
const Big = require('big.js');
//const crypto				= require('crypto');
const SparkMD5 = require('spark-md5'); // Faster than crypto
const _ = require('underscore-node');

var sslpDB = /** @class */ (function() {

    var connectionString;
    var dbName;
    var db;
    var client;

    function sslpDB(connectionString, dbName) {
        if (connectionString === void 0)
            this.connectionString = 'mongodb://localhost:27017';
        else
            this.connectionString = connectionString;

        if (dbName === void 0)
            this.dbName = 'solarslp';
        else
            this.dbName = dbName;

        return this;

    }

    sslpDB.prototype.connect = async function() {

        var connectionString = this.connectionString;
        var dbName = this.dbName;

        try {
            const client = new MongoClient(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();

            return client;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.setClient = function(client) {

        this.client = client;
        this.db = client.db(this.dbName);
        return true;

    };

    sslpDB.prototype.ping = async function() {

        try {
            var reply = await this.db.command({ ping: 1 });
            return reply;
        } catch (e) {
            throw new Error(e);
        }

    };

    sslpDB.prototype.close = function(client) {

        return this.client.close();

    };

    /* Just a testing function */
    sslpDB.prototype.getConnectionString = function() {

        return this.connectionString;

    };

    sslpDB.prototype.findDocument = async function(collection, query) {

        try {
            var dbcol = this.db.collection(collection);
            var docs = await dbcol.findOne(query, { projection: { _id: 0 } });
            return docs;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.findDocuments = async function(collection, query, limit = 100, sort = {}, skip = 0) {

        try {
            var dbcol = this.db.collection(collection);
            var docs = await dbcol.find(query, { projection: { _id: 0 }, limit: limit, sort: sort, skip: skip }).toArray();
            return docs;
        } catch (e) {
            throw new Error(e);;
        }

    }

    sslpDB.prototype.findDocumentsWithId = async function(collection, query, limit = 100, sort = {}, skip = 0) {

        try {
            var dbcol = this.db.collection(collection);
            var docs = await dbcol.find(query, { limit: limit, sort: sort, skip: skip }).toArray();
            return docs;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.findDocumentCount = async function(collection, query) {

        try {
            var dbcol = this.db.collection(collection);
            var count = await dbcol.find(query, {}).count();
            return count;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.findDocumentBigSum = async function(collection, query, sumfield) {

        try {
            var dbcol = this.db.collection(collection);
            var results = await dbcol.find(query, {}).toArray();
            let sum = _.reduce(results, function(memo, thisdoc) {
                try {
                    return new Big(memo).plus(eval("thisdoc." + sumfield)); // << TODO:	 This is kind of a NO NO - We shouldn't use eval
                } catch (e) {
                    return new Big(memo);
                }

            }, 0);
            return sum;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.findDocumentHash = async function(collection, query, field, sort) {

        try {
            var dbcol = this.db.collection(collection);
            var results = await dbcol.find(query, { projection: { _id: 0 }, limit: 10, sort: sort, skip: 0 }).toArray();

            let fieldcat = _.reduce(results, function(memo, thisdoc) {

                return memo + '' + eval("thisdoc." + field); // << TODO:  This is kind of a NO NO - We shouldn't use eval

            }, 0);

            if (fieldcat) {
                var hashcat = SparkMD5.hash(fieldcat);
            } else {
                var hashcat = SparkMD5.hash('');
            }

            return hashcat;

        } catch (e) {
            throw new Error(e);;
        }

    }

    sslpDB.prototype.insertDocument = async function(collection, query) {

        try {
            var dbcol = this.db.collection(collection);
            var result = await dbcol.insertOne(query);
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.insertDocuments = async function(collection, query) {

        try {
            var dbcol = this.db.collection(collection);
            var result = dbcol.insertMany([query]);
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.autoInc = async function(collection, field) {
        var dbcol = this.db.collection('counters');
        var result = await dbcol.findOneAndUpdate({
            collection: collection,
            field: field
        }, { $inc: { current: 1 } }, { returnDocument: 'after' });

        return result.value && result.value.current;

    }

    sslpDB.prototype.createJournalEntry = async function(txid, blockId, blockHeight, timestamp, timestampUnix, action, collectionName, fieldData, recordData) {

        try {

            var autoIndex = await this.autoInc('journal', 'id');

            delete fieldData['_id'];
            delete recordData['_id'];

            var recordHash = SparkMD5.hash(action + '' + JSON.stringify(fieldData) + '' + JSON.stringify(recordData));

            var insertData = {
                txid: txid,
                blockId: blockId,
                blockHeight: blockHeight,
                timestamp: timestamp,
                timestamp_unix: timestampUnix,
                action: action,
                collectionName: collectionName,
                fieldData: JSON.stringify(fieldData),
                recordData: JSON.stringify(recordData),
                recordHash: recordHash,
                chainHash: ''
            };

            var lastIndex = 0;
            if (Big(autoIndex).gt(1)) {
                var lastIndex = parseInt(Big(autoIndex).minus(1).toFixed(0));
            }

            insertData._id = autoIndex;

            console.log('autoIndex: ' + autoIndex);

            var dbcol = this.db.collection('journal');
            await dbcol.insertOne(insertData);

            if (autoIndex == 1) // This is the first entry
            {

                // chainHash = recordHash
                console.log('update after insert #1 - ' + recordHash);

                var updateresult = await dbcol.updateOne({ "_id": autoIndex }, { $set: { "chainHash": recordHash } });

                return updateresult;

            } else {

                var docs = await dbcol.findOne({ '_id': lastIndex }, {});

                console.log('lastRecordHash: ' + docs.recordHash);

                var chainHash = SparkMD5.hash(docs.recordHash + '' + recordHash);

                console.log('chainHash: ' + chainHash);

                var result = await dbcol.updateOne({ "_id": autoIndex }, { $set: { "chainHash": chainHash } });

                return result;

            }

        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.updateDocument = async function(collection, findquery, setquery) {

        try {
            var dbcol = this.db.collection(collection);
            var result = await dbcol.updateOne(findquery, { $set: setquery });
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.removeDocument = async function(collection, query) {

        try {
            var dbcol = this.db.collection(collection);
            var result = await dbcol.deleteOne(query);
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.removeDocuments = async function(collection, query) {

        try {
            var dbcol = this.db.collection(collection);
            var result = await dbcol.deleteMany(query);
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.createIndex = async function(collection, query, unique = true) {

        try {
            if (unique == true) sparse = false;
            else sparse = true;
            var dbcol = this.db.collection(collection);
            var result = await dbcol.createIndex(query, { background: true, sparse: sparse, unique: unique });
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.createCollection = async function(collection, options = {}) {

        try {
            var result = await this.db.createCollection(collection, options);
            return result;
        } catch (e) {
            throw new Error(e);
        }

    }

    sslpDB.prototype.doesCollectionExist = async function(collection) {

        try {
            var items = await this.db.listCollections().toArray();

            if (items.length == 0) {
                return false;
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i].name == collection) {
                    return true;
                }
            }

            return false;
        } catch (e) {
            throw new Error(e);
        }

    }

    return sslpDB;

}());

exports.default = sslpDB;