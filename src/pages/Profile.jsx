import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Avatar from '../components/Avatar';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = () => {
      try {
        const userRole = localStorage.getItem('userRole');
        const username = localStorage.getItem('username');
        const fullName = localStorage.getItem('fullName');

        if (!userRole || !username) {
          setError('Bạn chưa đăng nhập. Vui lòng đăng nhập.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const user = {
          username: username,
          fullName: fullName || username,
          role: userRole
        };

        setUserProfile(user);

      } catch (err) {
        console.error('Lỗi khi tải thông tin profile:', err);
        setError('Không thể tải thông tin profile. Vui lòng thử đăng nhập lại.');
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Doctor': { bg: 'primary', icon: '🩺', text: 'Bác sĩ' },
      'Nurse': { bg: 'success', icon: '💉', text: 'Y tá' },
      'Admin': { bg: 'danger', icon: '⚙️', text: 'Quản trị viên' },
      'Patient': { bg: 'info', icon: '👤', text: 'Bệnh nhân' }
    };
    const config = roleConfig[role] || { bg: 'secondary', icon: '👤', text: role };
    return <Badge bg={config.bg} className="fs-6 px-3 py-2">{config.icon} {config.text}</Badge>;
  };

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>⚠️ Lỗi</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Đang tải thông tin...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Profile Header Card */}
          <Card className="shadow-lg border-0 mb-4">
            <Card.Body className="text-center py-5" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <div className="mb-3">
                <Avatar fullName={userProfile.fullName} size="xl" />
              </div>
              <h2 className="text-white mb-2">{userProfile.fullName}</h2>
              <p className="text-white-50 mb-3">@{userProfile.username}</p>
              {getRoleBadge(userProfile.role)}
            </Card.Body>
          </Card>

          {/* Profile Information Card */}
          <Card className="shadow border-0 mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0">📋 Thông tin cá nhân</h5>
            </Card.Header>
            <Card.Body className="px-4 py-4">
              <Row className="mb-3">
                <Col xs={5} className="text-muted">
                  <strong>Tên đầy đủ</strong>
                </Col>
                <Col xs={7}>
                  {userProfile.fullName}
                </Col>
              </Row>
              <hr className="my-3" />
              <Row className="mb-3">
                <Col xs={5} className="text-muted">
                  <strong>Tên đăng nhập</strong>
                </Col>
                <Col xs={7}>
                  {userProfile.username}
                </Col>
              </Row>
              <hr className="my-3" />
              <Row>
                <Col xs={5} className="text-muted">
                  <strong>Vai trò</strong>
                </Col>
                <Col xs={7}>
                  {getRoleBadge(userProfile.role)}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow border-0">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body className="px-4 py-4">
              <Row className="g-3">
                <Col xs={12} sm={6}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => navigate('/')}
                  >
                    📂 Hồ sơ bệnh án
                  </Button>
                </Col>
                <Col xs={12} sm={6}>
                  <Button 
                    variant="outline-success" 
                    className="w-100"
                    onClick={() => navigate('/medicines')}
                  >
                    💊 Quản lý thuốc
                  </Button>
                </Col>
                <Col xs={12} sm={6}>
                  <Button 
                    variant="outline-info" 
                    className="w-100"
                    onClick={() => navigate('/prescriptions')}
                  >
                    📝 Đơn thuốc
                  </Button>
                </Col>
                <Col xs={12} sm={6}>
                  <Button 
                    variant="outline-danger" 
                    className="w-100"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;