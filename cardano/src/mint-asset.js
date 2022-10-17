const cardano = require("./cardano")

// 1. Get the wallet

const wallet = cardano.wallet("ADAPI")

// 2. Define mint script

const mintScript = {
  keyHash: cardano.addressKeyHash(wallet.name),
  type: "sig"
}

// 3. Create POLICY_ID

const POLICY_ID = cardano.transactionPolicyid(mintScript)

// 4. Define ASSET_NAME

const ASSET_NAME = "NuFiAxe"

// Convert Asset ASCII name to HEX

const ASSET_NAME_HEX = ASSET_NAME.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");


// 5. Create ASSET_ID

const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX

// 6. Define metadata

const metadata = {
  721: {
    [POLICY_ID]: {
      [ASSET_NAME]: {
        name: ASSET_NAME,
        // CIDv1 is not supported, but if you split the url in an array it works
        image: ["ipfs://bafkreiem3vqddfybcwh4y7", "hzlkqiq4gg7d7fd57srox7kafegxkljxgx5i"],
        description: "Unique NuFi Axe",
        type: "image/png",
        src: ["ipfs://bafkreiem3vqddfybcwh4y7", "hzlkqiq4gg7d7fd57srox7kafegxkljxgx5i"],
        authors: ["PIADA", "SBLYR"],
      }
    }
  }
}

// 7. Define transaction

const tx = {
  txIn: wallet.balance().utxo,
  txOut: [
    {
      address: wallet.paymentAddr,
      value: { ...wallet.balance().value, [ASSET_ID]: 1 }
    }
  ],
  mint: [
    { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript },
  ],
  metadata,
  witnessCount: 2
}



if (Object.keys(tx.txOut[0].value).includes("undefined") || Object.keys(tx.txIn[0].value.includes("undefinded"))) {
  delete tx.txOut[0].value.undefined
  delete tx.txIn[0].value.undefined
}

// 8. Build transaction

const buildTransaction = (tx) => {

  const raw = cardano.transactionBuildRaw(tx)
  const fee = cardano.transactionCalculateMinFee({
    ...tx,
    txBody: raw
  })

  tx.txOut[0].value.lovelace -= fee

  return cardano.transactionBuildRaw({ ...tx, fee })
}

console.log(tx)
const raw = buildTransaction(tx)

// 9. Sign transaction

const signTransaction = (wallet, tx) => {

  return cardano.transactionSign({
    signingKeys: [wallet.payment.skey, wallet.payment.skey],
    txBody: tx
  })
}

const signed = signTransaction(wallet, raw)

// 10. Submit transaction

const txHash = cardano.transactionSubmit(signed)

console.log(txHash)