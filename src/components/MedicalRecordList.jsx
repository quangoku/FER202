import { Container, Row, Col } from "react-bootstrap";
import MedicalRecord from "./MedicalRecord";
import { MEDICAL_LIST_ROUTE } from "../ApiRoute";
import { useEffect, useState } from "react";
const MedicalRecordList = ({ records }) => {
  const [recordsList, setRecordsList] = useState(records);

  useEffect(() => {
    setRecordsList(records);
  }, [records]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hồ sơ này?")) return;

    const res = await fetch(`${MEDICAL_LIST_ROUTE}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRecordsList(recordsList.filter((r) => r.id !== id));
    }
  };
  return (
    <Container className="py-3">
      <h3 className="text-success mb-4 fw-bold">Danh sách hồ sơ bệnh án</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {recordsList && recordsList.length > 0 ? (
          recordsList.map((record) => (
            <Col key={record.id}>
              <MedicalRecord record={record} handleDelete={handleDelete} />
            </Col>
          ))
        ) : (
          <p className="text-muted">Loading..</p>
        )}
      </Row>
    </Container>
  );
};

export default MedicalRecordList;
