import React, { useEffect, useState } from "react";
import { PRESCRIPTION_ROUTE } from "../ApiRoute";
import PrescriptionsList from "../components/PrescriptionsList";

export default function Prescription() {
  const [prescriptions, setPrescriptions] = useState([])
  useEffect(() => {
    async function getPrescriptionsList() {
      try {
        const data = await fetch(PRESCRIPTION_ROUTE);
        const res = await data.json();
        setPrescriptions(res);

      } catch (error) {
        console.error("Lỗi hiển thị dữ liệu đơn thuốc", error);
      }
    }
    getPrescriptionsList();

  }, []);
  return(
  <div style={{
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa",
        paddingTop: "20px",
      }} className="text-black">
   <PrescriptionsList prescriptions={prescriptions}/>
  </div>
  );
}
