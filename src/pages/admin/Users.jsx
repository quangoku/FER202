import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Card,
  Badge,
  Alert,
  Spinner,
  Table,
} from "react-bootstrap";

const USER_ROUTE = "http://localhost:8000/users";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "doctor",
  });

  // Load users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(USER_ROUTE);
      if (!response.ok) throw new Error("Không thể tải danh sách users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.username?.toLowerCase().includes(lowerTerm) ||
          user.fullName?.toLowerCase().includes(lowerTerm) ||
          user.id?.toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedRole !== "all") {
      result = result.filter((user) => user.role === selectedRole);
    }

    return result;
  }, [users, searchTerm, selectedRole]);

  // Handle Add User
  const handleShowAddModal = () => {
    setFormData({
      username: "",
      password: "",
      fullName: "",
      role: "doctor",
    });
    setShowAddModal(true);
    setError(null);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      // Check username exists
      const existing = users.find((u) => u.username === formData.username);
      if (existing) {
        setError("Username đã tồn tại!");
        return;
      }

      const response = await fetch(USER_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể thêm user");

      const newUser = await response.json();
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setSuccess("✅ Thêm user thành công!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Edit User
  const handleShowEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      fullName: user.fullName || "",
      role: user.role,
    });
    setShowEditModal(true);
    setError(null);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${USER_ROUTE}/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể cập nhật user");

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      setShowEditModal(false);
      setSuccess("✅ Cập nhật user thành công!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete User
  const handleShowDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${USER_ROUTE}/${currentUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Không thể xóa user");

      setUsers(users.filter((u) => u.id !== currentUser.id));
      setShowDeleteModal(false);
      setSuccess("✅ Xóa user thành công!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: "danger", icon: "⚙️", text: "Admin" },
      doctor: { bg: "primary", icon: "🩺", text: "Bác sĩ" },
      nurse: { bg: "success", icon: "💉", text: "Y tá" },
      user: { bg: "secondary", icon: "👤", text: "User" },
    };

    const config = roleConfig[role?.toLowerCase()] || roleConfig.user;
    return (
      <Badge bg={config.bg} className="px-2 py-1">
        {config.icon} {config.text}
      </Badge>
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải dữ liệu...</p>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingTop: "20px",
      }}
    >
      {/* Alerts */}
      {success && (
        <Container className="mb-3">
          <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Container>
      )}

      {error && (
        <Container className="mb-3">
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Search & Filter Section */}
      <Container className="my-4 p-4 rounded-3 shadow-sm bg-light border border-primary border-opacity-25 position-relative">
        <div className="position-absolute top-0 end-0 p-3 pt-md-4 pe-md-4">
          <Button
            variant="primary"
            className="shadow-sm fw-bold"
            onClick={handleShowAddModal}
          >
            + Thêm User Mới
          </Button>
        </div>

        <h4 className="text-primary fw-bold mb-4 pt-4 pt-md-0">
          🔍 Quản Lý Users
        </h4>

        <Form>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={8}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Tìm kiếm
              </Form.Label>
              <Form.Control
                type="search"
                placeholder="Nhập username, tên đầy đủ, hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="text-secondary small mb-1 fw-semibold">
                Vai trò
              </Form.Label>
              <Form.Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="admin">Admin</option>
                <option value="doctor">Bác sĩ</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>

        <div className="mt-3">
          <small className="text-muted">
            Tìm thấy <strong>{filteredUsers.length}</strong> user(s)
          </small>
        </div>
      </Container>

      {/* Users Table */}
      <Container className="mb-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3">Username</th>
                    <th className="py-3">Tên đầy đủ</th>
                    <th className="py-3">Vai trò</th>
                    <th className="py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-3">
                          <code className="text-muted">{user.id}</code>
                        </td>
                        <td className="py-3">
                          <strong>{user.username}</strong>
                        </td>
                        <td className="py-3">
                          {user.fullName || (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="py-3">{getRoleBadge(user.role)}</td>
                        <td className="py-3 text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowEditModal(user)}
                          >
                            ✏️ Sửa
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleShowDeleteModal(user)}
                            disabled={user.role === "admin"}
                          >
                            🗑️ Xóa
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        Không tìm thấy user nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bold">
            ➕ Thêm User Mới
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddUser}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
                placeholder="Nhập username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                placeholder="Nhập password"
                minLength={3}
              />
              <Form.Text className="text-muted">Tối thiểu 3 ký tự</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên đầy đủ</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="Nhập tên đầy đủ (tùy chọn)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Vai trò <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
              >
                <option value="doctor">Bác sĩ</option>
                <option value="nurse">Y tá</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              💾 Lưu
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-warning fw-bold">
            ✏️ Chỉnh sửa User
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditUser}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Username không thể thay đổi
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                minLength={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên đầy đủ</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="Nhập tên đầy đủ"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Vai trò <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
              >
                <option value="doctor">Bác sĩ</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="warning" type="submit">
              💾 Cập nhật
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger fw-bold">
            ⚠️ Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn xóa user{" "}
            <strong className="text-danger">{currentUser?.username}</strong>?
          </p>
          <Alert variant="warning" className="mb-0">
            <small>⚠️ Hành động này không thể hoàn tác!</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            🗑️ Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <Container className="p-4">
        <p className="text-center text-muted">
          © 2025 EMR System - Admin Panel
        </p>
      </Container>
    </div>
  );
}
