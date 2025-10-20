import React, { useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";

const MedicalRecord = ({ record }) => {
  const { id, patientName, date, diagnosis, treatment, age, gender, address } =
    record;

  const [show, setShow] = useState(false);

  const handleShow = (e) => {
    e.stopPropagation();
    setShow(true);
  };
  const handleClose = (e) => {
    setShow(false);
  };

  return (
    <>
      <Card
        className="text-dark h-100 shadow-sm border-success border-opacity-50 medical-record-card"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onClick={handleShow}
      >
        <Card.Body className="bg-white rounded p-3">
          <div className="mb-2">
            <Card.Title className="fs-5 fw-bold text-truncate m-0 text-success">
              {patientName || "Chưa có tên"}
            </Card.Title>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
            <small className="text-muted">
              Mã HS: <span className="badge bg-success ms-1">{id}</span>
            </small>
            <small className="text-muted">Ngày khám: {date || "—"}</small>
          </div>

          <Card.Text className="mb-3">
            <p className="fw-semibold text-info mb-1">Chẩn đoán:</p>
            <p className="text-dark-emphasis fst-italic text-truncate mb-0">
              {diagnosis || "Chưa có dữ liệu"}
            </p>
          </Card.Text>

          <Card.Text className="mb-3">
            <p className="fw-semibold text-info mb-1">Điều trị:</p>
            <p className="text-dark-emphasis fst-italic text-truncate mb-0">
              {treatment || "Chưa có dữ liệu"}
            </p>
          </Card.Text>

          <div className="text-end text-success fw-bold">Xem chi tiết</div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-success fw-bold">
            Chi Tiết Hồ Sơ: {patientName || "Chưa có tên"} (Mã: {id})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Ngày khám:</strong> {date || "—"}
          </p>
          <p>
            <strong>Tuổi:</strong> {age || "—"}
          </p>
          <p>
            <strong>Giới tính:</strong> {gender || "—"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {address || "—"}
          </p>
          <hr />
          <p className="fw-semibold text-info mb-1">Chẩn đoán:</p>
          <p>{diagnosis || "Chưa có dữ liệu"}</p>
          <hr />
          <p className="fw-semibold text-info mb-1">Điều trị:</p>
          <p>{treatment || "Chưa có dữ liệu"}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MedicalRecord;
