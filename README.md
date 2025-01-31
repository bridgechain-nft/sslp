# SSLP -- Version 2.0.0

Solar Side Ledger Protocol - An easy to use token system for both fungible SSLP-1 and SSLP-2 non-fungible tokens.

This is a sidechain for the Solar network to integrate Simple Token issuance and management

This must be running on a Solar Relay or Solar Full node.

---

Enable Webhooks in your Solar Node:

```
nano .config/solar-core/mainnet/.env
```

Make sure the env file has these items:

```
CORE_WEBHOOKS_ENABLED=true
CORE_WEBHOOKS_HOST=0.0.0.0
CORE_WEBHOOKS_PORT=6004
```

Go back to user root directory and restart solar nodes to enable your new .env settings

```
cd && pm2 restart all
```

Clone this repo and enter sslp directory

```
git clone https://github.com/bridgechain-nft/sslp && cd sslp
```

Give permissions to execute the Sidechain Menu

```
chmod +x sslp.sh
```

Start sslp menu

```
./sslp.sh
```

---

The server runs on the port set in the ini file. If you want to run on a port < 1000, you'll need to run sslpApi.js with sudo or use Nginx proxy

Currently the system supports the SSLP contract schema (v15). SSLP contract schemas are backwards compatible.

Example JSON Object for Genesis:

```
{
	sslp1: {
		tp: 'GENESIS',
		de: 8,
		sy: 'TEST',
		na: 'Test Token',
		du: 'https://test.com',
		qt: 100000,
		no: 'notes',
		pa: false,
		mi: false
	}
}
```

Stringified, this object will look like this for submitting to the network:

```
{sslp1: {tp: 'GENESIS',de: 8,sy: 'TEST',na: 'Test Token',du: 'https://test.com',qt: 100000,no: 'notes',pa: false,mi: false}}
```

SSLP (Schema v15) Contract Methods:

```
GENESIS - Create a new token
BURN - Destroy/Burn tokens from a contract
MINT - Create/Mint tokens into a contract
SEND - Send tokens from sender address to recipient address
PAUSE - Pause the contract.  Prevents any calls other than RESUME
RESUME - Resume the contract.
NEWOWNER - Change the owner of the contract.
FREEZE - Freeze balance for Token @ Address.
UNFREEZE - UnFreeze balance for Token @ Address.
```

JSON Variables:

GENESIS: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
de = Decimal Places  (Integer: 0-8)
sy = Symbol / Ticker  (String: 3-8 characters)
na = Token Name  (String: 3-24 characters)
du = Document URI  (String:  Max 32 characters)  (Optional)
qt = Quantity (Integer)
no = Notes  (String: Max 32 Characters)  (Optional)
pa = Pausable (Boolean:  Default false)  (Optional)
mi = Mintable (Boolean:  Default false)  (Optional)
```

BURN: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
qt = Quantity (Integer)
no = Notes  (String: Max 32 Characters)  (Optional)
```

MINT: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
qt = Quantity (Integer)
no = Notes  (String: Max 32 Characters)  (Optional)
```

SEND: (Recipent Address is whom you are sending Tokens to)

```
id = tokenIdHex (Hexidecimal)
qt = Quantity (Integer)
no = Notes  (String: Max 32 Characters)  (Optional)
```

PAUSE: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

RESUME: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

NEWOWNER: (Recipent Address is whom you are reassigning contract to)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

FREEZE: (Recipent Address is whom you want to freeze)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

UNFREEZE: (Recipent Address is whom you want to unfreeze)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

SSLP-2 (Schema v15) Contract Methods:

```
GENESIS - Create a new token
PAUSE - Pause the contract.  Prevents any calls other than RESUME
RESUME - Resume the contract.
NEWOWNER - Change the owner of the contract.
AUTHMETA - Authorize an address to add meta data
REVOKEMETA - Revoke authorization to add meta data
CLONE - Create new token by cloning this contract information
ADDMETA - Add meta data to a contract
VOIDMETA - Mark a previously added meta data as void
```

JSON Variables:

GENESIS: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
sy = Symbol / Ticker  (String: 3-8 characters)
na = Token Name  (String: 3-24 characters)
du = Document URI  (String:  Max 32 characters)  (Optional)
no = Notes  (String: Max 32 Characters)  (Optional)
pa = Pausable (Boolean:  Default false)  (Optional)
```

PAUSE: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

RESUME: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

NEWOWNER: (Recipent Address is whom you are reassigning contract to)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

AUTHMETA: (Recipent Address is whom you are authorizing to add metadata)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

REVOKEMETA: (Recipent Address is whom you are revoking access to add metadata)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional)
```

CLONE: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
no = Notes  (String: Max 32 Characters)  (Optional - Leaveing blank will copy notes from original, providing will create new notes)
```

ADDMETA: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
ch = Chunk number (Integer - Optional / 0 is Default -- If your metadata cannot fit into a single transaction, then chunk it into multiple, ie, 1 of 2, 2 of 2)
na = Name  (String: Max 32 Characters --  name of meta info)
dt = Data  (String -- stringified data for your meta)
```

VOIDMETA: (Recipient Address is SSLP Master - SSLPqqWjRoQkqgncCDLaoX5bCjbsW4rUmx)

```
id = tokenIdHex (Hexidecimal)
tx = transaction id of metadata to void

* Notes:  Only owner can void all meta.  Meta auth users can only void their own meta posts
```
