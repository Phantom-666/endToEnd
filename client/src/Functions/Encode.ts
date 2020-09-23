// How does it work
// const importedPublicKey = await importKey(publicKey, 'encrypt')
// const cypherText = await getEncodeText(data, importedPublicKey)
// jwkDecrypt(privateKey, cypherText)

const jwkDecrypt = async (key: JsonWebKey, data: Int8Array | ArrayBuffer) => {
    const importedPrivateKey = await importKey(key, 'decrypt')

    const decryptedText = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      importedPrivateKey,
      data
    )

    const dec = new TextDecoder()
    return dec.decode(decryptedText)
  
}

const importKey = async (key: JsonWebKey, method: KeyUsage) => {
  return await window.crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: 'RSA-OAEP',
      hash: {name: 'SHA-256'},
    },
    true,
    [method]
  )
}

const getMessageEncoding = (word: string) => {
  const enc = new TextEncoder()
  return enc.encode(word)
}

const encrypt = async (
  importedPublicKey: CryptoKey,
  encodedData: Uint8Array
) => {
  return await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    importedPublicKey,
    encodedData
  )
}

const getEncodeText = async (data: string, importedPublicKey: CryptoKey) => {
  const encoded = getMessageEncoding(data)
  return await encrypt(importedPublicKey, encoded)
}

const pairKeyOptions = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
}

const generatePairKeys = async () => {
  return await window.crypto.subtle.generateKey(pairKeyOptions, true, [
    'encrypt',
    'decrypt',
  ])
}

const exportKeys = async (pubKey: CryptoKey, privKey: CryptoKey) => {
  const publicKey = await window.crypto.subtle.exportKey('jwk', pubKey)
  const privateKey = await window.crypto.subtle.exportKey('jwk', privKey)
  return {publicKey, privateKey}
}

const generateExportedKeys = async () => {
  const keyPair = await generatePairKeys()
  const {publicKey, privateKey} = await exportKeys(
    // @ts-ignore: Unreachable code error
    keyPair.publicKey,
    // @ts-ignore: Unreachable code error
    keyPair.privateKey
  )
  return {publicKey, privateKey}
}

export {generateExportedKeys, importKey, getEncodeText, jwkDecrypt}
