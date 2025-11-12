import { BrowserRouter, Route, Routes } from "react-router-dom";
import MedicalRecords from "./pages/MedicalRecords";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Medicines from "./pages/Medicines";
import Profile from "./pages/Profile";
import Prescription from "./pages/Prescription";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/AppNavBar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/admin/AdminRoute";
import Users from "./pages/admin/Users";
import Dashboard from "./pages/admin/DashBoard";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MedicalRecords />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/prescriptions" element={<Prescription />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<Users></Users>}></Route>
            <Route
              path="/admin/dashboard"
              element={<Dashboard></Dashboard>}
            ></Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
