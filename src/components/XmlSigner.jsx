import React, { useState } from 'react';
import { signXml } from '../utils/xmlSigner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const XmlSigner = () => {
  const [xml, setXml] = useState('');
  const [signedXml, setSignedXml] = useState('');

  const handleSign = async () => {
    try {
      // In a real application, you would securely manage the private key
      // This is just a placeholder for demonstration purposes
      const privateKey = await window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign"]
      );

      const signed = await signXml(xml, privateKey);
      setSignedXml(signed);
    } catch (error) {
      console.error('Error signing XML:', error);
      alert('Failed to sign XML. Check console for details.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">XML Signer</h2>
      <Textarea
        className="w-full mb-4"
        rows={10}
        value={xml}
        onChange={(e) => setXml(e.target.value)}
        placeholder="Enter XML to sign"
      />
      <Button onClick={handleSign} className="mb-4">Sign XML</Button>
      {signedXml && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Signed XML:</h3>
          <Textarea
            className="w-full"
            rows={10}
            value={signedXml}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default XmlSigner;