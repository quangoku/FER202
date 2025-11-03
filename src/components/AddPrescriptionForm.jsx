import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { MEDICINES_ROUTE } from "../ApiRoute.js";

export default function AddPrescriptionForm({ show, onClose, onSave }) {
  const [id, setId] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [medicines, setMedicines] = useState([
    { medicineID: "", name: "", dosage: "", quantity: 1, instructions: "" },
  ]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setError(null);
      fetchMedicines();
    }
  }, [show]);

  const fetchMedicines = async () => {
    try {
      setLoadingMedicines(true);
      const response = await axios.get(MEDICINES_ROUTE);
      setAvailableMedicines(response.data);
    } catch (err) {
      setError("Không thể tải danh sách thuốc");
      console.error(err);
    } finally {
      setLoadingMedicines(false);
    }
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicineID: "", name: "", dosage: "", quantity: 1, instructions: "" },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChangeMedicine = (index, field, value) => {
    setMedicines(
      medicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const newPrescription = {
      id,
      issuedDate,
      medicines: medicines.map((med, i) => ({
        ...med,
        medicineID: med.medicineID || `${id}-m${i + 1}`,
        quantity: Number(med.quantity),
      })),
    };

    onSave(newPrescription);
    onClose();

    // reset form
    setId("");
    setIssuedDate("");
    setMedicines([{ medicineID: "", name: "", dosage: "", quantity: 1, instructions: "" }]);
    setError(null);


  };

  return (<Modal show={show} onHide={onClose} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title className="text-success fw-bold">
        Thêm Đơn Thuốc Mới
      </Modal.Title>
    </Modal.Header>

    ```
    <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}

      {loadingMedicines ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mã Đơn</Form.Label>
                <Form.Control
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ngày kê</Form.Label>
                <Form.Control
                  type="date"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h6 className="text-success fw-bold mb-3">Danh sách thuốc trong đơn</h6>

          {medicines.map((med, index) => (
            <div
              key={med.medicineID || index}
              className="p-3 mb-3 border rounded bg-light position-relative"
            >
              <h6 className="fw-semibold text-primary mb-2">
                Thuốc #{index + 1}
              </h6>

              <Row className="g-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tên thuốc</Form.Label>
                    <Form.Select
                      value={med.medicineID}
                      onChange={(e) => {
                        const selected = availableMedicines.find(
                          (m) => String(m.id) === e.target.value
                        );
                        if (selected) {
                          setMedicines((prev) =>
                            prev.map((med, i) =>
                              i === index
                                ? {
                                  ...med,
                                  medicineID: String(selected.id),
                                  name: selected.name,
                                  dosage: "",
                                  quantity: 1,
                                  instructions: "",
                                }
                                : med
                            )
                          );
                        }
                      }}

                      required
                    >
                      <option value="">-- Chọn thuốc --</option>
                      {availableMedicines.map((m) => (
                        <option key={m.id} value={String(m.id)}>
                          {m.name}
                        </option>
                      ))}
                    </Form.Select>

                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Liều lượng</Form.Label>
                    <Form.Control
                      type="text"
                      value={med.dosage}
                      onChange={(e) =>
                        handleChangeMedicine(index, "dosage", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={med.quantity}
                      onChange={(e) =>
                        handleChangeMedicine(index, "quantity", Number(e.target.value))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mt-2">
                <Form.Label>Hướng dẫn sử dụng</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={med.instructions}
                  onChange={(e) =>
                    handleChangeMedicine(index, "instructions", e.target.value)
                  }
                  required
                />
              </Form.Group>

              {medicines.length > 1 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoveMedicine(index)}
                >
                  Xóa
                </Button>
              )}
            </div>
          ))}

          <div className="text-center">
            <Button variant="outline-success" onClick={handleAddMedicine}>
              + Thêm thuốc
            </Button>
          </div>

          <Modal.Footer className="mt-4">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="success">
              Lưu Đơn Thuốc
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal.Body>
  </Modal>


  );
}
