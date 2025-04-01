import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'active',
        assignedEmployees: [],
        totalTasks: 0,
        completedTasks: 0
    });
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    'http://localhost:11000/api/employees',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setEmployees(response.data);
            } catch (err) {
                console.error('Error fetching employees:', err);
            } finally {
                setFetchingEmployees(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:11000/api/projects', 
                projectData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess('Project added successfully!');
            setProjectData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'active',
                assignedEmployees: [],
                totalTasks: 0,
                completedTasks: 0
            });
            
            setTimeout(() => {
                navigate('/projects');
            }, 2000);
        } catch (err) {
            console.error('Error adding project:', err);
            setError(err.response?.data?.message || 'Failed to add project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmployeeSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setProjectData(prev => ({
            ...prev,
            assignedEmployees: selectedOptions
        }));
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-success text-white">
                            <h3 className="mb-0">Add New Project</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Name*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={projectData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter project name"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description*</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={projectData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter project description"
                                        rows={3}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Start Date*</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="startDate"
                                                value={projectData.startDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>End Date*</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={projectData.endDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Status*</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={projectData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="on-hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Assign Team Members</Form.Label>
                                    {fetchingEmployees ? (
                                        <div className="text-center">
                                            <Spinner animation="border" size="sm" /> Loading employees...
                                        </div>
                                    ) : (
                                        <Form.Select
                                            multiple
                                            name="assignedEmployees"
                                            value={projectData.assignedEmployees}
                                            onChange={handleEmployeeSelection}
                                            style={{ height: '150px' }}
                                        >
                                            {employees.map(employee => (
                                                <option key={employee._id} value={employee._id}>
                                                    {employee.name} - {employee.position}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                    <Form.Text className="text-muted">
                                        Hold Ctrl/Cmd to select multiple employees
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex justify-content-end">
                                    <Button variant="secondary" className="me-2" onClick={() => navigate('/projects')}>
                                        Cancel
                                    </Button>
                                    <Button variant="success" type="submit" disabled={loading}>
                                        {loading ? <><Spinner animation="border" size="sm" /> Adding...</> : 'Add Project'}
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

export default AddProject; 