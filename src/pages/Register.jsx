import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { USER_ROUTE } from "../ApiRoute";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    const dataToSend = {
      username: formData.username,
      password: formData.password,
      role: formData.role || "user",
    };

    if (formData.fullName) {
      dataToSend.fullName = formData.fullName;
    }

    try {
      const response = await fetch(USER_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        setError("Failed to register. Please try again later.");
      }
    } catch (err) {
      setError("Failed to register. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mt-5">Register</h2>
          <RegisterForm onRegister={handleRegister} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Register;
