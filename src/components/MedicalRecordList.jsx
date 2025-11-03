import { Container, Row, Col } from "react-bootstrap";
import MedicalRecord from "./MedicalRecord";

const MedicalRecordList = ({ records }) => {
  return (
    <Container className="py-3">
      <h3 className="text-success mb-4 fw-bold">Danh sách hồ sơ bệnh án</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {records.map((record) => (
          <Col key={record.id}>
            <MedicalRecord  record={record} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MedicalRecordList;
