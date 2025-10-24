import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (location.pathname === "/login") {
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
                Hồ sơ bệnh án
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/medicines" ? "active" : ""
                }`}
                to="/medicines"
              >
                Thuốc
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/prescriptions" ? "active" : ""
                }`}
                to="/prescriptions"
              >
                Đơn thuốc
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
                to="/profile"
              >
                Hồ sơ cá nhân
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <li className="nav-item">
                <button className="nav-link text-light" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-light" to="/login">
                  Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
