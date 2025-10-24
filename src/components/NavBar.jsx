import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const storedUsername = localStorage.getItem("username");
    const storedFullName = localStorage.getItem("fullName");

    if (userRole) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "");
      setFullName(storedFullName || storedUsername || "");
    } else {
      setIsLoggedIn(false);
      setUsername("");
      setFullName("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          ClinicSys
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Medical Records
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/medicines" ? "active" : ""
                }`}
                to="/medicines"
              >
                Medicines
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/prescriptions" ? "active" : ""
                }`}
                to="/prescriptions"
              >
                Prescriptions
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Avatar fullName={fullName} />
                  <span className="ms-2 text-light">{username}</span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-light" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
