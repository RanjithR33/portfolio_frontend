import React, { useState } from "react";

// Props type
type Props = {
  watchlists: { [name: string]: { id: number; name: string; items: any[] } };
  currentListName: string;
  setCurrentListName: React.Dispatch<React.SetStateAction<string>>;
  onRemove: (name: string) => void;
};

const CustomDropdown: React.FC<Props> = ({
  watchlists,
  currentListName,
  setCurrentListName,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle watchlist selection
  const handleSelect = (name: string) => {
    setCurrentListName(name);
    setIsOpen(false); // Close dropdown after selection
  };

  // Handle watchlist removal
  const handleRemove = (name: string) => {
    onRemove(name);
    setIsOpen(false); // Close dropdown after removal
  };

  return (
    <div style={{ position: "relative" }}>
      <label>Current Watchlist:</label>
      <div
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
        style={{
          padding: "6px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "5px",
        }}
      >
        {currentListName}
        <span style={{ marginLeft: "10px" }}>&#9662;</span> {/* Down arrow */}
      </div>

      {/* Show dropdown if isOpen is true */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            width: "100%",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            backgroundColor: "white",
            color: "black",
            borderRadius: "4px",
            zIndex: 10,
            maxHeight: "200px", // Set max height to avoid large dropdown
            overflowY: "auto", // Add scroll if items are too many
          }}
        >
          {Object.keys(watchlists).map((name) => (
            <div
              key={name}
              style={{
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => handleSelect(name)}
            >
              <span>{name}</span>
              <span
                style={{
                  color: "red",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from triggering handleSelect
                  handleRemove(name); // Remove the selected watchlist
                }}
              >
                X
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
