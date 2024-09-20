import { SignedXml, CryptoConfig } from 'xmldsigjs';

export const generateCertificate = async () => {
  const keys = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const cert = await window.crypto.subtle.exportKey("pkcs8", keys.privateKey);
  return {
    privateKey: keys.privateKey,
    certificate: new Uint8Array(cert)
  };
};

export const signXml = async (xmlString, privateKey, certificate) => {
  try {
    const xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
    const signedXml = new SignedXml();

    // Set the hash algorithm explicitly
    CryptoConfig.Default.SetHashAlgorithm("SHA-256", "http://www.w3.org/2001/04/xmlenc#sha256");

    // Set the signing key and options
    await signedXml.Sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      xmlDoc,
      {
        keyValue: certificate,
        references: [
          { 
            hash: "SHA-256",
            transforms: ["enveloped-signature"],
          }
        ]
      }
    );

    // Get the signature XML and append it to the document
    const signatureElement = signedXml.GetXml();
    xmlDoc.documentElement.appendChild(signatureElement);

    // Serialize the signed XML
    return new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.error('Error signing XML:', error);
    throw error;
  }
};
