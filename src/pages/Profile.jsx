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
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Avatar from '../components/Avatar';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = () => {
      try {
        const userRole = localStorage.getItem('userRole');
        const username = localStorage.getItem('username');
        const fullName = localStorage.getItem('fullName');
        const userId = localStorage.getItem('userId');

        if (!userRole || !username) {
          setError('Bạn chưa đăng nhập. Vui lòng đăng nhập.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const user = {
          id: userId,
          username: username,
          fullName: fullName || username,
          role: userRole
        };

        setUserProfile(user);
        setEditForm({
          fullName: fullName || username
        });

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
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        fullName: userProfile.fullName
      });
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      if (!editForm.fullName.trim()) {
        setError('Tên đầy đủ không được để trống');
        return;
      }

      // Cập nhật lên server
      const response = await fetch(`http://localhost:3000/users/${userProfile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: editForm.fullName
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin');
      }

      // Cập nhật localStorage
      localStorage.setItem('fullName', editForm.fullName);

      // Cập nhật state
      setUserProfile(prev => ({
        ...prev,
        fullName: editForm.fullName
      }));

      setIsEditing(false);
      setSuccess('✅ Cập nhật thông tin thành công!');
      setError(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Lỗi khi lưu thông tin:', err);
      setError('Không thể lưu thông tin. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword.length < 3) {
      setError('Mật khẩu mới phải có ít nhất 3 ký tự');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      // Lấy thông tin user hiện tại để check mật khẩu cũ
      const response = await fetch(`http://localhost:3000/users/${userProfile.id}`);
      const userData = await response.json();

      if (userData.password !== passwordForm.currentPassword) {
        setError('Mật khẩu hiện tại không đúng');
        return;
      }

      // Cập nhật mật khẩu mới
      const updateResponse = await fetch(`http://localhost:3000/users/${userProfile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordForm.newPassword
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Không thể đổi mật khẩu');
      }

      setSuccess('✅ Đổi mật khẩu thành công!');
      setError(null);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      setError('Không thể đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Doctor': { bg: 'primary', icon: '🩺', text: 'Bác sĩ' },
      'Nurse': { bg: 'success', icon: '💉', text: 'Y tá' },
      'Admin': { bg: 'danger', icon: '⚙️', text: 'Quản trị viên' },
      'Patient': { bg: 'info', icon: '👤', text: 'Bệnh nhân' },
      'user': { bg: 'secondary', icon: '👤', text: 'Người dùng' }
    };
    const config = roleConfig[role] || { bg: 'secondary', icon: '👤', text: role };
    return <Badge bg={config.bg} className="fs-6 px-3 py-2">{config.icon} {config.text}</Badge>;
  };

  if (error && !userProfile) {
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
          {/* Alert Messages */}
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}
          {error && userProfile && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

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
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Thông tin cá nhân</h5>
              <Button 
                variant={isEditing ? "secondary" : "outline-primary"}
                size="sm"
                onClick={handleEditToggle}
              >
                {isEditing ? '❌ Hủy' : '✏️ Chỉnh sửa'}
              </Button>
            </Card.Header>
            <Card.Body className="px-4 py-4">
              {!isEditing ? (
                <>
                  <Row className="mb-3">
                    <Col xs={5} className="text-muted">
                      <strong>ID</strong>
                    </Col>
                    <Col xs={7}>
                      <code>{userProfile.id}</code>
                    </Col>
                  </Row>
                  <hr className="my-3" />
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
                </>
              ) : (
                <Form onSubmit={handleSaveProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>ID</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={userProfile.id}
                      disabled
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">ID không thể thay đổi</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><strong>Tên đầy đủ</strong> <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tên đầy đủ"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><strong>Tên đăng nhập</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={userProfile.username}
                      disabled
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">Tên đăng nhập không thể thay đổi</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><strong>Vai trò</strong></Form.Label>
                    <div className="mt-2">
                      {getRoleBadge(userProfile.role)}
                    </div>
                    <Form.Text className="text-muted">Vai trò được cấp bởi quản trị viên</Form.Text>
                  </Form.Group>

                  <div className="d-flex gap-2 mt-4">
                    <Button variant="primary" type="submit" className="flex-grow-1">
                      💾 Lưu thay đổi
                    </Button>
                    <Button variant="secondary" onClick={handleEditToggle}>
                      Hủy
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>

          {/* Security Card */}
          <Card className="shadow border-0 mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-0">🔒 Bảo mật</h5>
            </Card.Header>
            <Card.Body className="px-4 py-4">
              <Row className="mb-3">
                <Col xs={5} className="text-muted">
                  <strong>Mật khẩu</strong>
                </Col>
                <Col xs={7}>
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    🔑 Đổi mật khẩu
                  </Button>
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

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔑 Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={3}
              />
              <Form.Text className="text-muted">Tối thiểu 3 ký tự</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" className="flex-grow-1">
                Đổi mật khẩu
              </Button>
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;