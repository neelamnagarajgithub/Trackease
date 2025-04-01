import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        joiningDate: '',
        phone: '',
        address: '',
        contact: '',
        salary: '',
        hireDate: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = {
            ...employeeData,
            hireDate: employeeData.hireDate || employeeData.joiningDate,
            contact: employeeData.contact.toString()
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/employees', 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess('Employee added successfully!');
            setEmployeeData({
                name: '',
                email: '',
                position: '',
                department: '',
                joiningDate: '',
                phone: '',
                address: '',
                contact: '',
                salary: '',
                hireDate: ''
            });
            
            setTimeout(() => {
                navigate('/employees');
            }, 2000);
        } catch (err) {
            console.error('Error adding employee:', err);
            setError(err.response?.data?.message || 'Failed to add employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="mb-0">Add New Employee</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={employeeData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter full name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address*</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={employeeData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter email address"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Position*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="position"
                                                value={employeeData.position}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter job position"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Department*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="department"
                                                value={employeeData.department}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter department"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Joining Date*</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="joiningDate"
                                                value={employeeData.joiningDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hire Date*</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="hireDate"
                                                value={employeeData.hireDate}
                                                onChange={handleChange}
                                                required
                                                placeholder="Select hire date"
                                            />
                                            <Form.Text className="text-muted">
                                                Can be the same as joining date
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={employeeData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter phone number"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact Number*</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="contact"
                                                value={employeeData.contact}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter emergency contact"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Salary (annual)*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="salary"
                                        value={employeeData.salary}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter annual salary"
                                        min="0"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        value={employeeData.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                        rows={3}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end">
                                    <Button variant="secondary" className="me-2" onClick={() => navigate('/employees')}>
                                        Cancel
                                    </Button>
                                    <Button variant="success" type="submit" disabled={loading}>
                                        {loading ? <><Spinner animation="border" size="sm" /> Adding...</> : 'Add Employee'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEmployee; 