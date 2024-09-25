import React from 'react';

// AreaButton component for rendering a button with a label and click functionality
const AreaButton = ({ label, onClick }) => {
  return (
    <button className="area-button" onClick={onClick}> {/* Button with click handler */}
      {label} {/* Display the label text passed as a prop */}
    </button>
  );
};

export default AreaButton; // Export the AreaButton component for use in other parts of the application
