import React, { useState } from 'react';
import { signXml, generateCertificate } from '../utils/xmlSigner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const XmlSigner = () => {
  const [xml, setXml] = useState('');
  const [signedXml, setSignedXml] = useState('');
  const [certificate, setCertificate] = useState(null);

  const handleGenerateCertificate = async () => {
    try {
      const newCertificate = await generateCertificate();
      setCertificate(newCertificate);
      alert('Certificate generated successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Check console for details.');
    }
  };

  const handleSign = async () => {
    if (!certificate) {
      alert('Please generate a certificate first.');
      return;
    }

    try {
      const signed = await signXml(xml, certificate.privateKey, certificate.certificate);
      setSignedXml(signed);
    } catch (error) {
      console.error('Error signing XML:', error);
      alert('Failed to sign XML. Check console for details.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">SAML XML Signer</h2>
      <Button onClick={handleGenerateCertificate} className="mb-4 mr-2">Generate Certificate</Button>
      <Textarea
        className="w-full mb-4"
        rows={15}
        value={xml}
        onChange={(e) => setXml(e.target.value)}
        placeholder="Enter SAML XML to sign"
      />
      <Button onClick={handleSign} className="mb-4" disabled={!certificate}>Sign XML</Button>
      {signedXml && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Signed XML:</h3>
          <Textarea
            className="w-full"
            rows={20}
            value={signedXml}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default XmlSigner;
