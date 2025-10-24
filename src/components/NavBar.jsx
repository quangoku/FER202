import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  // Ẩn Navbar ở trang login
  if (location.pathname === "/login") return null;
  console.log(location.pathname);
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
            <li className="nav-item">
              <Link className="nav-link text-light" to="/login">
                Đăng xuất
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
