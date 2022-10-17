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
