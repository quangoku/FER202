import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function AddMedicalRecordForm({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "Male",
    address: "",
    diagnosis: "",
    treatment: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({
      patientName: "",
      age: "",
      gender: "Male",
      address: "",
      diagnosis: "",
      treatment: "",
      date: "",
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm Hồ Sơ Bệnh Án Mới</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col xs={4}>
              <Form.Label>Tuổi</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày khám</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chẩn đoán</Form.Label>
            <Form.Control
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Điều trị</Form.Label>
            <Form.Control
              as="textarea"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Hủy
            </Button>
            <Button type="submit" variant="success">
              Lưu Hồ Sơ
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
