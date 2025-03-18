import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar, Button } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeProjects: 0,
    pendingTasks: 0,
    attendanceRate: 0,
    recentActivities: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);

      const fetchDashboardData = async () => {
        try {
          const response = await axios.get('https://trackease-backend.vercel.app/api/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDashboardData(response.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchDashboardData();
    }
  }, []);

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <img
                src="https://via.placeholder.com/50"
                alt="User Icon"
                className="rounded-circle me-3"
              />
              <div>
                <h5 className="mb-0">Welcome, {user ? user.name : 'User'}</h5>
                <small className="text-muted">{user ? user.email : ''}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Total Employees</Card.Title>
              <Card.Text className="display-4">{dashboardData.totalEmployees}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <Card.Text className="display-4">{dashboardData.activeProjects}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Pending Tasks</Card.Title>
              <Card.Text className="display-4">{dashboardData.pendingTasks}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Attendance Rate</Card.Title>
              <ProgressBar now={dashboardData.attendanceRate} label={`${dashboardData.attendanceRate}%`} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>Recent Activities</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Activity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentActivities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.id}</td>
                      <td>{activity.employee}</td>
                      <td>{activity.activity}</td>
                      <td>{activity.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <Button variant="primary" className="w-100 mb-2">Add New Employee</Button>
              <Button variant="secondary" className="w-100 mb-2">Create New Project</Button>
              <Button variant="success" className="w-100 mb-2">Generate Report</Button>
              <Button variant="danger" className="w-100">Manage Tasks</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;