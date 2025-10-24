import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { USER_ROUTE } from "../ApiRoute";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing user session when the login page loads
    localStorage.removeItem("userRole");
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(USER_ROUTE);
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("userRole", user.role);
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Failed to login. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mt-5">Login</h2>
          <LoginForm onLogin={handleLogin} error={error} />
          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
