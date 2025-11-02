import { Container,Row, Col } from "react-bootstrap";
import Prescriptions from "./Prescriptions";

const PrescriptionsList =({ prescriptions })=>{
    return (
        <Container className="py-3">
            <h3 className="text-black mb-3">Hoá đơn thuốc</h3>
            <Row  xs={1} md={2} lg={3} className="g-4"   >
              {prescriptions.map((prescription) =>(
                <Col key={prescription.id}>
                    <Prescriptions prescription={prescription}/>
                
            </Col>
            ))}
            </Row>
        </Container>
    )


}
export default PrescriptionsList
