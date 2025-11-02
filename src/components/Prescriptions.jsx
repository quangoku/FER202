import { useState } from "react";
import { Card, Modal, Button, ListGroup } from "react-bootstrap";

export default function Prescription({ prescription }) {
    const { id, issuedDate, medicines } = prescription;
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            <Card
                className="text-dark h-100 shadow-sm border-success border-opacity-50"
                style={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onClick={handleShow}
            >
                <Card.Body className="bg-white rounded p-3">
                    <Card.Title className="fs-5 fw-bold text-success mb-2">
                        Đơn thuốc {id}
                    </Card.Title>
                    <div className="d-flex justify-content-between align-items-center mb-2 border-bottom border-secondary pb-2">
                        <small className="text-muted">
                            Ngày kê: {issuedDate || "—"}
                        </small>
                        <small className="text-success fw-semibold">
                            {medicines.length} loại
                        </small>
                    </div>

                    <div>
                        {medicines.slice(0, 2).map((med, index) => (
                            <p key={index} className="mb-1 text-truncate text-dark-emphasis">
                                • {med.name} ({ med.dosage})
                            </p>
                        ))}

                    </div>

                    <div className="text-end text-success fw-bold mt-2">
                        Xem chi tiết
                    </div>
                </Card.Body>
            </Card>


            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-success fw-bold">
                        Đơn thuốc {id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Ngày kê:</strong> {issuedDate}
                    </p>
                    <hr />
                    <h6 className="text-success fw-semibold mb-3">Danh sách thuốc:</h6>
                    <ListGroup variant="flush">
                        {medicines.map((med) => (
                            <ListGroup.Item key={med.medicineID}>
                                <p className="fw-bold mb-1 text-dark">Tên thuốc : {med.name}</p>
                                <p className="mb-0 text-muted small">
                                    Liều lượng: {med.dosage}
                                </p>
                                <p className="mb-0 text-muted small">
                                    Số lượng: {med.quantity}
                                </p>
                                <p className="mb-0 text-muted small">
                                    Cách dùng: {med.instructions}
                                </p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
