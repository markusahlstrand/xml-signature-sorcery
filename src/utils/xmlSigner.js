import { SignedXml, Parse } from 'xmldsigjs';

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
    const xmlDoc = Parse(xmlString);
    const assertion = xmlDoc.getElementsByTagNameNS("urn:oasis:names:tc:SAML:2.0:assertion", "Assertion")[0];
    const issuer = assertion.getElementsByTagNameNS("urn:oasis:names:tc:SAML:2.0:assertion", "Issuer")[0];

    const signedXml = new SignedXml();
    signedXml.SignedInfo.CanonicalizationMethod.Algorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";
    signedXml.SignedInfo.SignatureMethod.Algorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    signedXml.SignedInfo.References[0] = signedXml.AddReference(
      assertion,
      ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"],
      "http://www.w3.org/2001/04/xmlenc#sha256"
    );

    await signedXml.Sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      assertion,
      {
        keyValue: certificate
      }
    );

    const signatureElement = signedXml.GetXml();
    assertion.insertBefore(signatureElement, issuer.nextSibling);

    return new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.error('Error signing XML:', error);
    throw error;
  }
};
