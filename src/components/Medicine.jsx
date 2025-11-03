import React, { useState } from "react";
import { Card, Modal, Button, Stack } from "react-bootstrap";

// Chú ý: Thêm onEdit và onDelete vào props
const Medicine = ({ medicine, onEdit, onDelete }) => {
  const { id, name, unit, description } = medicine;
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Hàm này để ngăn việc bấm nút Sửa/Xóa làm mở modal chi tiết
  const handleButtonClick = (e, callback) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ Card
    callback(medicine);
  };

  return (
    <>
      <Card
        className="text-dark h-100 shadow-sm border-primary border-opacity-50 d-flex flex-column"
        style={{ cursor: "pointer" }}
        onClick={handleShow}
      >
        <Card.Body className="flex-grow-1">
          {/* ...Phần hiển thị thông tin thuốc giữ nguyên... */}
          <div className="mb-2">
            <Card.Title className="fs-5 fw-bold text-truncate m-0 text-primary">
              {name || "Chưa có tên"}
            </Card.Title>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <small className="text-muted">
              Mã thuốc: <span className="badge bg-primary ms-1">{id}</span>
            </small>
            <small className="text-muted">Đơn vị: {unit || "—"}</small>
          </div>
          <Card.Text className="mb-3">
            <p className="fw-semibold text-info mb-1">Mô tả:</p>
            <p className="text-dark-emphasis fst-italic text-truncate mb-0">
              {description || "Chưa có dữ liệu"}
            </p>
          </Card.Text>
        </Card.Body>

        {/* === PHẦN THÊM MỚI === */}
        <Card.Footer className="bg-light border-0 pt-0">
          <Stack direction="horizontal" gap={2}>
            <Button
              variant="outline-warning"
              size="sm"
              className="w-100"
              onClick={(e) => handleButtonClick(e, onEdit)}
            >
              Sửa
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="w-100"
              onClick={(e) => handleButtonClick(e, onDelete)}
            >
              Xóa
            </Button>
          </Stack>
        </Card.Footer>
        {/* === KẾT THÚC PHẦN THÊM MỚI === */}
      </Card>

      {/* Modal chi tiết vẫn giữ nguyên */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bold">
            Chi Tiết Thuốc: {name || "Chưa có tên"} (Mã: {id})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Tên thuốc:</strong> {name || "—"}</p>
          <p><strong>Đơn vị tính:</strong> {unit || "—"}</p>
          <hr />
          <p className="fw-semibold text-info mb-1">Mô tả chi tiết:</p>
          <p>{description || "Chưa có dữ liệu"}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Medicine;