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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> // Add register route
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MedicalRecords />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/prescriptions" element={<Prescription />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
