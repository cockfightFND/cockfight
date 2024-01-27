import React from 'react';

const MarketModal = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      zIndex: 1000,
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center'
    }}>
      <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px' }}>Would you buy this one?</p>
      <div>
        <button onClick={() => onClose(true)} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Yes</button>
        <button onClick={() => onClose(false)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>No</button>
      </div>
    </div>
  );
};

export default MarketModal;
