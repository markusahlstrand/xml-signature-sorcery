import { SignedXml } from 'xmldsigjs';

export const signXml = async (xmlString, privateKey) => {
  try {
    const signedXml = new SignedXml();
    await signedXml.Sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      xmlString,
      {
        references: [
          { hash: "SHA-256", transforms: ["enveloped"] }
        ]
      }
    );
    return signedXml.toString();
  } catch (error) {
    console.error('Error signing XML:', error);
    throw error;
  }
};