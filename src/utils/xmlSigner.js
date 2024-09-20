import { SignedXml, Parse, Application } from 'xmldsigjs';

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
    // Parse the XML
    const xmlDoc = Parse(xmlString);

    // Find the Assertion element
    const assertion = xmlDoc.getElementsByTagNameNS("urn:oasis:names:tc:SAML:2.0:assertion", "Assertion")[0];
    if (!assertion) {
      throw new Error("Assertion element not found in the XML");
    }

    // Find the Issuer element
    const issuer = assertion.getElementsByTagNameNS("urn:oasis:names:tc:SAML:2.0:assertion", "Issuer")[0];
    if (!issuer) {
      throw new Error("Issuer element not found in the Assertion");
    }

    // Create a new SignedXml object
    const signedXml = new SignedXml();

    // Set the signature algorithm
    signedXml.SignatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";

    // Set the canonicalization method
    signedXml.CanonicalizationMethod.Algorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

    // Create a reference to the Assertion element
    const reference = signedXml.AddReference(
      "http://www.w3.org/2001/04/xmlenc#sha256",
      assertion,
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
    );

    // Add the exc-c14n transform
    reference.AddTransform("http://www.w3.org/2001/10/xml-exc-c14n#");

    // Set the key info
    signedXml.KeyInfo = certificate;

    // Sign the XML
    await signedXml.Sign(privateKey);

    // Get the signature XML
    const signatureElement = signedXml.GetXml();

    // Insert the signature after the Issuer element
    assertion.insertBefore(signatureElement, issuer.nextSibling);

    // Serialize the signed XML
    return new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.error('Error signing XML:', error);
    throw error;
  }
};
