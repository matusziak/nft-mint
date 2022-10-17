import NFTContract from 0x12f818519cdea9dd

pub fun main() : {String : String} {
  let nftOwner = getAccount(0x12f818519cdea9dd)
  log("NFT Owner")
  log(nftOwner)
  let capability = nftOwner.getCapability<&{NFTContract.NFTReceiver}>(/public/NFTReceiver)
  log("Capability")
  log(capability)
  let receiverRef = capability.borrow()

  ?? panic("Could not borrow the receiver reference")

  return receiverRef.getMetadata(id: 1)
}