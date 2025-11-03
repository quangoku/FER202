import { Container, Row, Col } from "react-bootstrap";
import Medicine from "./Medicine";

// Chú ý: Thêm onEdit và onDelete vào props
const MedicineList = ({ medicines, onEdit, onDelete }) => {
  return (
    <Container className="py-3">
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {medicines.map((med) => (
          <Col key={med.id}>
            {/* Truyền 2 hàm mới nhận được xuống component Medicine */}
            <Medicine medicine={med} onEdit={onEdit} onDelete={onDelete} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MedicineList;