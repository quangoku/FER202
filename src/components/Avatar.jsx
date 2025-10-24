import React from "react";

const Avatar = ({ fullName }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else {
      return nameParts[0][0].toUpperCase();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
      }}
    >
      {getInitials(fullName)}
    </div>
  );
};

export default Avatar;
