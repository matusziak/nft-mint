# Solana NFT Mint

This guide is mostly following the [metaplex candy-machine-v2 tutorial](https://docs.metaplex.com/candy-machine-v2/introduction).

## 1. [Install tools and create a wallet](https://docs.metaplex.com/candy-machine-v2/getting-started)

1. Prerequisites:

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [node](https://nodejs.org/en/download/)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [ts-node](https://www.npmjs.com/package/ts-node#installation) - this can be installed globally, but it is _NOT REQUIRED_, because there is a local installation in this repository

2. Install the [Metaplex tool](https://docs.metaplex.com/candy-machine-v2/getting-started#clone-and-install-metaplex)

3. Install the [Solana CLI](https://docs.metaplex.com/candy-machine-v2/getting-started#clone-and-install-metaplex) to create and manipulate a Solana Wallet

- The recommended option is to [create a paper wallet](https://docs.solana.com/wallet-guide/paper-wallet) so you can use the same wallet later with a mnemonic:

  ```bash
  solana-keygen new --outfile ~/my-solana-wallet/example.json
  ```

  The chosen path "`~/my-solana-wallet/example.json`" is optional and you can choose a different one if you want. The default is "`~/.config/solana/id.json`".

  You should see something similar to this:

  ```bash
  Wrote new keypair to /Users/{user}/my-solana-wallet/example.json
  ==========================================================================
  pubkey: GnekXa5fhnqMHQbDK6Brx5RvgAibpLMSukwctd9qqNrZ
  ==========================================================================
  Save this seed phrase and your BIP39 passphrase to recover your new keypair:
  palm galaxy enemy sad feature unknown sure knee model slight girl original
  ```

  Save the keypair (mnemonic): `palm galaxy enemy sad feature unknown sure knee model slight girl original` for later use of this wallet in other applications.

- Continue with the Solana CLI config settings:

  Set your default wallet for the CLI:

  `solana config set --keypair ~/.config/solana/devnet.json`

  Set the RPC node to devnet:

  `solana config set --url https://explorer-api.devnet.solana.com`

  Check your config changes:

  `solana config get`

  Fund your wallet:

  `solana airdrop 2`

## 2. [Configure the metaplex tool](https://docs.metaplex.com/candy-machine-v2/configuration)

1. Edit `config.json`:

```json
{
  "price": 1.0,
  "number": 200, // There is 200 NFT assets that will be minted by this tutorial
  "gatekeeper": null,
  "solTreasuryAccount": "<YOUR WALLET ADDRESS>", // Created Solana wallet address
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "25 Dec 2021 00:00:00 GMT",
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "storage": "nft-storage", // Preferred option - permanent and free storage
  "ipfsInfuraProjectId": null,
  "ipfsInfuraSecret": null,
  "nftStorageKey": null,
  "awsS3Bucket": null,
  "noRetainAuthority": false,
  "noMutable": false
}
```

## 3. [Prepare your Assets](https://docs.metaplex.com/candy-machine-v2/preparing-assets)

If yo want to use different assets, delete the contents of the `/assets` folder and replace it with your assets named `0.png, 1.png, 2.png, ...` and edit the `metadata_generator.py` mentioned later accordingly with the number of files and file format.

1. [Install python](https://www.python.org/)
2. Edit `metadata_generator.py`:

```python

from random import randint

file_format = 'png' # File format
num_of_files = 200 # There is 200 NFT assets that will be minted by this tutorial
creator_address = '<YOUR WALLET ADDRESS>' # Created Solana wallet address

for i in range(num_of_files):
  name = f"\"NuFi Sword #{i+1}\""
  symbol = f"\"NuFiS\""
  image = f"{i}.${file_format}"
  attack = f"{randint(1, 10)}"
  agility = f"{randint(1, 10)}"
  strength = f"{randint(1, 10)}"
  intellect = f"{randint(1, 10)}"
  stamina = f"{randint(1, 10)}"

  json_metadata = """{
    "name": %s,
    "symbol": %s,
    "description": "Collection of NuFi powerful swords.",
    "seller_fee_basis_points": 500,
    "image": "%s",
    "attributes": [
        {"trait_type": "attack", "value": "%s"},
        {"trait_type": "agility", "value": "%s"},
        {"trait_type": "strength", "value": "%s"},
        {"trait_type": "intellect", "value": "%s"},
        {"trait_type": "stamina", "value": "%s"}
    ],
    "properties": {
        "creators": [{"address": "%s", "share": 100}],
        "files": [{"uri": "%s", "type": "image/png"}]
    },
    "collection": {"name": "NuFi Swords", "family": "NuFi Swords"}
}""" % (name, symbol, image, attack, agility, strength, intellect, stamina, creator_address, image)

  f = open(f"./assets/{i}.json", "w")
  f.write(json_metadata)
  f.close()

```

3. Create json metadata files for assets:

```bash
python metadata_generator.py
```

4. Verify assets:

```bash
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts verify_assets ./assets
```

## 4. Mint NFTs

1. Create candy machine & upload the assets:

```bash
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet --rpc-url https://explorer-api.devnet.solana.com -k ~/my-solana-wallet/my-keypair.json -cp config.json -c example ./assets
```

2. Verify upload:

```bash
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet --rpc-url https://explorer-api.devnet.solana.com  -k  ~/my-solana-wallet/my-keypair.json -cp config.json -c example ./assets
```

3. Mint tokens (replace `--number 200` if number of NFTs was changed):

```bash
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts mint_multiple_tokens -e devnet --rpc-url https://explorer-api.devnet.solana.com  -k  ~/my-solana-wallet/my-keypair.json -cp config.json -c example --number 200
```

4. Sign minted NFTs:

```bash
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts sign_all -e devnet --rpc-url https://explorer-api.devnet.solana.com  -k  ~/my-solana-wallet/my-keypair.json -cp config.json -c example
```
