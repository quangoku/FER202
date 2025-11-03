import React, { useState, useEffect } from "react";
import axios from "axios";
import { MEDICINES_ROUTE } from "../ApiRoute.js"; // Sửa lại đường dẫn của bạn nếu cần
import {
  Button,
  Modal,
  Form,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import MedicineList from "../components/MedicineList";

function Medicines() {
  // Các state và hàm fetch giữ nguyên...
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({
    id: null,
    name: "",
    unit: "",
    description: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    /* ...code giữ nguyên... */
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(MEDICINES_ROUTE);
      setMedicines(response.data);
    } catch (err) {
      setError("Không thể tải danh sách thuốc.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleShowAddModal = () => {
    setCurrentMedicine({ id: null, name: "", unit: "", description: "" });
    setShowModal(true);
  };

  // Hàm này sẽ được gọi từ nút Sửa trên thẻ thuốc
  const handleShowEditModal = (medicine) => {
    setCurrentMedicine(medicine);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMedicine((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = currentMedicine.id
      ? axios.put(`${MEDICINES_ROUTE}/${currentMedicine.id}`, currentMedicine)
      : axios.post(MEDICINES_ROUTE, currentMedicine);
    try {
      await action;
      fetchMedicines();
      handleCloseModal();
    } catch (err) {
      setError(
        currentMedicine.id ? "Cập nhật thất bại!" : "Thêm mới thất bại!"
      );
    }
  };

  // Hàm này sẽ được gọi từ nút Xóa trên thẻ thuốc
  const handleShowDeleteConfirm = (medicine) => {
    setMedicineToDelete(medicine);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setMedicineToDelete(null);
  };
  const handleDelete = async () => {
    /* ...code giữ nguyên... */
    try {
      await axios.delete(`${MEDICINES_ROUTE}/${medicineToDelete.id}`);
      fetchMedicines();
      handleCloseDeleteConfirm();
    } catch (err) {
      setError("Xóa thuốc thất bại!");
      handleCloseDeleteConfirm();
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý Thuốc</h2>
        <Button variant="primary" onClick={handleShowAddModal}>
          Thêm thuốc mới
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <MedicineList
          medicines={medicines}
          onEdit={handleShowEditModal}
          onDelete={handleShowDeleteConfirm}
        />
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>
            {currentMedicine.id ? "Chỉnh sửa thuốc" : "Thêm thuốc mới"}
          </Modal.Title>{" "}
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              {" "}
              <Form.Label>Tên thuốc</Form.Label>{" "}
              <Form.Control
                type="text"
                placeholder="Nhập tên thuốc"
                name="name"
                value={currentMedicine.name}
                onChange={handleChange}
                required
              />{" "}
            </Form.Group>
            <Form.Group className="mb-3">
              {" "}
              <Form.Label>Đơn vị</Form.Label>{" "}
              <Form.Control
                type="text"
                placeholder="Ví dụ: Viên, Vỉ..."
                name="unit"
                value={currentMedicine.unit}
                onChange={handleChange}
                required
              />{" "}
            </Form.Group>
            <Form.Group className="mb-3">
              {" "}
              <Form.Label>Mô tả</Form.Label>{" "}
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={currentMedicine.description}
                onChange={handleChange}
              />{" "}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {" "}
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>{" "}
            <Button variant="primary" type="submit">
              Lưu
            </Button>{" "}
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>Xác nhận xóa</Modal.Title>{" "}
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa thuốc "
          <strong>{medicineToDelete?.name}</strong>"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Medicines;
