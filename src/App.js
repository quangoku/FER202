import { BrowserRouter, Route, Routes } from "react-router-dom";
import MedicalRecords from "./pages/MedicalRecords";
import Login from "./pages/Login";
import Medicines from "./pages/Medicines";
import Profile from "./pages/Profile";
import Prescription from "./pages/Prescription";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/NavBar";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<MedicalRecords />} />
          <Route path="/login" element={<Login />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/prescriptions" element={<Prescription />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
