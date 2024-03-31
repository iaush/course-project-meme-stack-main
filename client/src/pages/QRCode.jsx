import React from 'react';
import { Modal } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

function QRCode({ url, showQRCode, setShowQRCode }) {
  return (
    <Modal
      show={showQRCode}
      fullscreen={true}
      onHide={() => setShowQRCode(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{url}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex justify-content-center align-items-center my-4'>
        <QRCodeSVG value={url} size={250} />
      </Modal.Body>
    </Modal>
  );
}

export default QRCode;
