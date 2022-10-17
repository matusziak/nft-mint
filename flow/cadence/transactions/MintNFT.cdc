import NFTContract from 0x12f818519cdea9dd

transaction {
  let receiverRef: &{NFTContract.NFTReceiver}
  let minterRef: &NFTContract.NFTMinter

  prepare(acct: AuthAccount) {
    self.receiverRef = acct.getCapability<&{NFTContract.NFTReceiver}>(/public/NFTReceiver)
    .borrow()
    ?? panic("Could not borrow receiver reference")

    self.minterRef = acct.borrow<&NFTContract.NFTMinter>(from: /storage/NFTMinter)
    ?? panic("could not borrow minter reference")
  }

  execute {
    let metadata : {String : String} = {
      "name": "NuFi Axe 1/1",
      "rarity": "One of a kind.",
      "uri": "ipfs://bafkreiem3vqddfybcwh4y7hzlkqiq4gg7d7fd57srox7kafegxkljxgx5i"
    }
    let newNFT <- self.minterRef.mintNFT()

    self.receiverRef.deposit(token: <-newNFT, metadata: metadata)

    log("NFT Minted and deposited to Account 2’s Collection")
  }
}
