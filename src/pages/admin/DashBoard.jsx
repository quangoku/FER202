import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";

// Đăng ký các components của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecords: 0,
    totalPrescriptions: 0,
    totalMedicines: 0,
    recentRecords: [],
    usersByRole: { labels: [], data: [] },
    recordsByMonth: { labels: [], data: [] },
    genderDistribution: { labels: [], data: [] },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const USER_ROUTE = "http://localhost:8000/users";
      const MEDICAL_LIST_ROUTE = "http://localhost:8000/medicalRecords";
      const PRESCRIPTION_ROUTE = "http://localhost:8000/prescriptions";
      const MEDICINES_ROUTE = "http://localhost:8000/medicines";

      const [usersRes, recordsRes, prescriptionsRes, medicinesRes] =
        await Promise.all([
          fetch(USER_ROUTE),
          fetch(MEDICAL_LIST_ROUTE),
          fetch(PRESCRIPTION_ROUTE),
          fetch(MEDICINES_ROUTE),
        ]);

      const users = await usersRes.json();
      const records = await recordsRes.json();
      const prescriptions = await prescriptionsRes.json();
      const medicines = await medicinesRes.json();

      // Thống kê người dùng theo vai trò
      const roleCount = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const usersByRole = {
        labels: Object.keys(roleCount),
        data: Object.values(roleCount),
      };

      // Thống kê hồ sơ theo tháng (6 tháng gần nhất)
      const monthlyRecords = {};
      records.forEach((record) => {
        if (record.date) {
          const month = record.date.substring(0, 7);
          monthlyRecords[month] = (monthlyRecords[month] || 0) + 1;
        }
      });

      const sortedMonths = Object.keys(monthlyRecords).sort().slice(-6);
      const recordsByMonth = {
        labels: sortedMonths,
        data: sortedMonths.map((month) => monthlyRecords[month]),
      };

      // Thống kê giới tính
      const genderCount = records.reduce((acc, record) => {
        const gender = record.gender || "Unknown";
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});

      const genderLabels = Object.keys(genderCount).map((g) =>
        g === "Male" ? "Nam" : g === "Female" ? "Nữ" : "Chưa xác định"
      );

      const genderDistribution = {
        labels: genderLabels,
        data: Object.values(genderCount),
      };

      // Lấy 5 hồ sơ gần nhất
      const sortedRecords = records
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalRecords: records.length,
        totalPrescriptions: prescriptions.length,
        totalMedicines: medicines.length,
        recentRecords: sortedRecords,
        usersByRole,
        recordsByMonth,
        genderDistribution,
      });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình biểu đồ Line
  const lineChartData = {
    labels: stats.recordsByMonth.labels,
    datasets: [
      {
        label: "Số lượng hồ sơ",
        data: stats.recordsByMonth.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Cấu hình biểu đồ Pie (Vai trò)
  const rolePieData = {
    labels: stats.usersByRole.labels,
    datasets: [
      {
        data: stats.usersByRole.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ Pie (Giới tính)
  const genderPieData = {
    labels: stats.genderDistribution.labels,
    datasets: [
      {
        data: stats.genderDistribution.data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(201, 203, 207, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 fw-bold text-primary">📊 Dashboard Quản Trị</h2>

      {/* Thống kê tổng quan */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Người dùng</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalUsers}</h2>
                </div>
                <div style={{ fontSize: "3rem", opacity: 0.3 }}>👥</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Hồ sơ bệnh án</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalRecords}</h2>
                </div>
                <div style={{ fontSize: "3rem", opacity: 0.3 }}>📋</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Đơn thuốc</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalPrescriptions}</h2>
                </div>
                <div style={{ fontSize: "3rem", opacity: 0.3 }}>📝</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            }}
          >
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 opacity-75">Thuốc</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalMedicines}</h2>
                </div>
                <div style={{ fontSize: "3rem", opacity: 0.3 }}>💊</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row className="mb-4">
        {/* Biểu đồ Line - Hồ sơ theo tháng */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">📈 Hồ sơ theo tháng</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "300px" }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Biểu đồ Pie - Người dùng theo vai trò */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">👥 Vai trò</h5>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ height: "300px", width: "100%" }}>
                <Pie data={rolePieData} options={pieChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Biểu đồ Pie - Giới tính */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">⚧ Giới tính</h5>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ height: "300px", width: "100%" }}>
                <Pie data={genderPieData} options={pieChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Hồ sơ gần đây */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">📋 Hồ sơ bệnh án gần đây</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Mã HS</th>
                    <th>Tên bệnh nhân</th>
                    <th>Tuổi</th>
                    <th>Giới tính</th>
                    <th>Ngày khám</th>
                    <th>Chẩn đoán</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRecords.length > 0 ? (
                    stats.recentRecords.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <Badge bg="primary">{record.id}</Badge>
                        </td>
                        <td className="fw-semibold">{record.patientName}</td>
                        <td>{record.age}</td>
                        <td>
                          {record.gender === "Male" ? (
                            <Badge bg="info">Nam</Badge>
                          ) : record.gender === "Female" ? (
                            <Badge bg="danger">Nữ</Badge>
                          ) : (
                            <Badge bg="secondary">-</Badge>
                          )}
                        </td>
                        <td>{record.date || "-"}</td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "250px" }}
                        >
                          {record.diagnosis || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        Chưa có hồ sơ nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
