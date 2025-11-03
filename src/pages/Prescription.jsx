import React, { useEffect, useState, useMemo } from "react";
import { PRESCRIPTION_ROUTE } from "../ApiRoute";
import PrescriptionsList from "../components/PrescriptionsList";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AddPrescriptionForm from "../components/AddPrescriptionForm";

export default function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  
  useEffect(() => {
    async function getPrescriptionsList() {
      try {
        const data = await fetch(PRESCRIPTION_ROUTE);
        const res = await data.json();
        setPrescriptions(res);
      } catch (error) {
        console.error("Lỗi hiển thị dữ liệu Đơn thuốc", error);
      }
    }
    getPrescriptionsList();
  }, []);

  
  const filteredPrescriptions = useMemo(() => {
    let list = [...prescriptions];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      list = list.filter((p) =>
        String(p.id).toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedDate) {
      list = list.filter((p) => p.issuedDate.startsWith(selectedDate));
    }

    return list;
  }, [prescriptions, searchTerm, selectedDate]);

 
  const handleAddNewPrescription = async (formData) => {
    try {
      const response = await fetch(PRESCRIPTION_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Lỗi từ server: ${text}`);
      }

      const newPrescription = await response.json();
      setPrescriptions((prev) => [...prev, newPrescription]);
      alert("Thêm đơn thuốc thành công!");
    } catch (error) {
      console.error("Không thể thêm đơn thuốc:", error);
      alert("Lỗi khi thêm đơn thuốc!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingTop: "20px",
      }}
      className="text-black"
    >
      <Container className="my-4 p-4 rounded-3 shadow-sm bg-light border border-success border-opacity-25 position-relative">
      
        <div className="position-absolute top-0 end-0 p-3 pt-md-4 pe-md-4">
          <Button
            variant="success"
            className="shadow-sm fw-bold"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm Đơn Thuốc
          </Button>
        </div>

        <h4 className="text-success fw-bold mb-4 pt-4 pt-md-0">
          Tìm Kiếm Đơn Thuốc
        </h4>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Row className="g-3 align-items-end">
            <Col xs={12} md={6}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Mã Đơn
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã đơn thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            <Col xs={12} md={6}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Ngày kê
              </Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>
          </Row>
        </Form>
      </Container>

      
      <PrescriptionsList prescriptions={filteredPrescriptions} />

      
      <Container className="p-4">
        <p className="text-center text-muted">© 2025 EMR System</p>
      </Container>

     
      <AddPrescriptionForm
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddNewPrescription}
      />
    </div>
  );
}
