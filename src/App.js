import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Form,
  FormControl,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import MedicalRecordList from "./components/MedicalRecordList";
import AddMedicalRecordForm from "./components/AddMedicalRecordForm";
import { MEDICAL_LIST } from "./ApiRoute";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    async function getMedicalList() {
      try {
        const data = await fetch(MEDICAL_LIST);
        const res = await data.json();
        setMedicalRecords(res);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bệnh án:", error);
      }
    }
    getMedicalList();
  }, []);

  const filteredRecords = useMemo(() => {
    let records = [...medicalRecords];

    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      records = records.filter(
        (record) =>
          record.patientName?.toLowerCase().includes(lowerCaseTerm) ||
          (record.id && String(record.id).includes(lowerCaseTerm))
      );
    }

    if (selectedGender !== "all") {
      records = records.filter((record) => record.gender === selectedGender);
    }

    if (selectedDate) {
      records = records.filter((record) => {
        if (!record.date || typeof record.date !== "string") {
          return false;
        }
        return record.date.startsWith(selectedDate);
      });
    }

    return records;
  }, [medicalRecords, searchTerm, selectedGender, selectedDate]);

  const handleAddNewRecord = () => {
    setShowAddModal(true);
  };

  const handleSaveRecord = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/medicalRecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi từ server (${response.status}): ${errorText}`);
      }

      const savedRecord = await response.json();

      setMedicalRecords((prevRecords) => [...prevRecords, savedRecord]);

      console.log("✅ Thêm hồ sơ thành công:", savedRecord);
      alert("Thêm hồ sơ thành công!");
    } catch (error) {
      console.error("❌ Không thể thêm hồ sơ:", error);
      alert("Không thể thêm hồ sơ. Vui lòng thử lại!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingTop: "1px",
      }}
      className="text-dark"
    >
      <Container className="my-4 p-4 rounded-3 shadow-sm bg-light border border-success border-opacity-25 position-relative">
        <div className="position-absolute top-0 end-0 p-3 pt-md-4 pe-md-4">
          <Button
            variant="primary"
            className="shadow-sm fw-bold"
            onClick={handleAddNewRecord}
          >
            + Thêm Hồ Sơ Mới
          </Button>
        </div>

        <h4 className="text-success fw-bold mb-4 pt-4 pt-md-0">
          Tìm Kiếm Hồ Sơ Bệnh Án
        </h4>

        <Form>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={5}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Tên/Mã Hồ sơ
              </Form.Label>
              <FormControl
                type="search"
                placeholder="Nhập Mã HS, Tên Bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            <Col xs={12} md={3}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Ngày Khám Gần nhất
              </Form.Label>
              <FormControl
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Giới tính
              </Form.Label>
              <Form.Select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </Container>

      <MedicalRecordList records={filteredRecords} />

      <Container className="p-4">
        <p className="text-center text-muted">© 2025 EMR System</p>
      </Container>

      <AddMedicalRecordForm
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveRecord}
      />
    </div>
  );
}
