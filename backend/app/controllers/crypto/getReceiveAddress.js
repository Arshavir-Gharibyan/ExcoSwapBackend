const { CoinType } = require('@trustwallet/wallet-core');
const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const ethUtil = require('ethereumjs-util');

const network = bitcoin.networks.bitcoin;

const calcBip32ExtendedKey = (rootKey, path) => {
  // Check there's a root key to derive from
  if (!rootKey) {
    return rootKey;
  }
  var extendedKey = rootKey;
  // Derive the key from the path
  var pathBits = path.split('/');
  for (var i = 0; i < pathBits.length - 1; i++) {
    var bit = pathBits[i];
    var index = parseInt(bit);
    if (isNaN(index)) {
      continue;
    }
    var hardened = bit[bit.length - 1] == "'";
    var isPriv = !extendedKey.isNeutered();
    var invalidDerivationPath = hardened && !isPriv;
    if (invalidDerivationPath) {
      extendedKey = null;
    } else if (hardened) {
      extendedKey = extendedKey.deriveHardened(index);
    } else {
      extendedKey = extendedKey.derive(index);
    }
  }
  return extendedKey;
};

const getReceiveAddress = async (req, res) => {
  const { mnemonics, coin } = req.fields;
  const seed = bip39.mnemonicToSeedSync(mnemonics).toString('hex');
  const bip32RootKey = bitcoin.HDNode.fromSeedHex(seed, network);
  const bip32ExtendedKey = calcBip32ExtendedKey(
    bip32RootKey,
    CoinType.derivationPath(CoinType[coin])
  );
  const key = bip32ExtendedKey.derive(0);
  const keyPair = key.keyPair;
  let address = keyPair.getAddress().toString();

  switch (coin) {
    case 'bitcoin':
      const keyHash = bitcoin.crypto.hash160(key.getPublicKeyBuffer());
      const scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(keyHash);
      address = bitcoin.address.fromOutputScript(scriptPubKey, network);
      break;

    case 'ethereum':
    case 'smartchain':
      const pubkeyBuffer = keyPair.getPublicKeyBuffer();
      const ethPubkey = ethUtil.importPublic(pubkeyBuffer);
      const addressBuffer = ethUtil.publicToAddress(ethPubkey);
      const hexAddress = addressBuffer.toString('hex');
      const checksumAddress = ethUtil.toChecksumAddress(hexAddress);
      address = ethUtil.addHexPrefix(checksumAddress);

    default:
      break;
  }

  res.status(200).send({
    status: true,
    address,
  });
};

export { getReceiveAddress };
