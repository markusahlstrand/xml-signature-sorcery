import { SignedXml } from 'xmldsigjs';

export const generateCertificate = async () => {
  // This is a simplified example. In a real-world scenario, you'd use a proper certificate authority.
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
    const signedXml = new SignedXml();
    await signedXml.Sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      xmlString,
      {
        references: [
          { hash: "SHA-256", transforms: ["enveloped"] }
        ],
        keyValue: certificate
      }
    );
    return signedXml.toString();
  } catch (error) {
    console.error('Error signing XML:', error);
    throw error;
  }
};
