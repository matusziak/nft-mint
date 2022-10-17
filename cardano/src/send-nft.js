const cardano = require("./cardano");

// 1. get the wallet
// 2. define the transaction
// 3. build the transaction
// 4. calculate the fee
// 5. pay the fee by subtracting it from the sender utxo
// 6. build the final transaction
// 7. sign the transaction
// 8. submit the transaction

const sender = cardano.wallet("ADAPI");

console.log(
  "Balance of Sender wallet: " +
  cardano.toAda(sender.balance().value.lovelace) +
  " ADA"
);

const receiver =
  "addr_test1qqz4lhqm5evmp785nhkdprfv8tx3s9d5s86ezm6s2jvhvnfca4tse2c5e6vsexk3w859xda5rrx0mmg9zzu5uutuhrdq85cxwn";

const txInfo = {
  txIn: cardano.queryUtxo(sender.paymentAddr),
  txOut: [
    {
      address: sender.paymentAddr,
      value: {
        lovelace: sender.balance().value.lovelace - cardano.toLovelace(1.5),
      },
    },
    {
      address: receiver,
      value: {
        lovelace: cardano.toLovelace(1.5),
        "295500830279700163c4786b8a24ee6091b47acf6661838ddc85e2df.4e754669417865": 1,
      },
    },
  ],
};

const raw = cardano.transactionBuildRaw(txInfo);

const fee = cardano.transactionCalculateMinFee({
  ...txInfo,
  txBody: raw,
  witnessCount: 1,
});

//pay the fee by subtracting it from the sender utxo
txInfo.txOut[0].value.lovelace -= fee;

//create final transaction
const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

//sign the transaction
const txSigned = cardano.transactionSign({
  txBody: tx,
  signingKeys: [sender.payment.skey],
});

//subm transaction
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);