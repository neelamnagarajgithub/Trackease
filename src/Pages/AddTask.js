import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        estimatedHours: ''
    });
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                
                // Fetch employees and projects in parallel
                const [employeesResponse, projectsResponse] = await Promise.all([
                    axios.get('/api/employees', { headers }),
                    axios.get('/api/projects', { headers })
                ]);
                
                setEmployees(employeesResponse.data);
                setProjects(projectsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load required data. Please try again.');
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/tasks', 
                taskData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess('Task added successfully!');
            setTaskData({
                title: '',
                description: '',
                project: '',
                assignedTo: '',
                dueDate: '',
                priority: 'medium',
                status: 'pending',
                estimatedHours: ''
            });
            
            setTimeout(() => {
                navigate('/tasks');
            }, 2000);
        } catch (err) {
            console.error('Error adding task:', err);
            setError(err.response?.data?.message || 'Failed to add task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (fetchingData) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" /> Loading...
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-warning text-dark">
                            <h3 className="mb-0">Add New Task</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Task Title*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={taskData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter task title"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={taskData.description}
                                        onChange={handleChange}
                                        placeholder="Enter task description"
                                        rows={3}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Project*</Form.Label>
                                            <Form.Select
                                                name="project"
                                                value={taskData.project}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Project</option>
                                                {projects.map(project => (
                                                    <option key={project._id} value={project._id}>
                                                        {project.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Assign To*</Form.Label>
                                            <Form.Select
                                                name="assignedTo"
                                                value={taskData.assignedTo}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Employee</option>
                                                {employees.map(employee => (
                                                    <option key={employee._id} value={employee._id}>
                                                        {employee.name} - {employee.position}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Due Date*</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="dueDate"
                                                value={taskData.dueDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Estimated Hours</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="estimatedHours"
                                                value={taskData.estimatedHours}
                                                onChange={handleChange}
                                                placeholder="Enter estimated hours"
                                                min="0"
                                                step="0.5"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Priority*</Form.Label>
                                            <Form.Select
                                                name="priority"
                                                value={taskData.priority}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status*</Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={taskData.status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="on-hold">On Hold</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end">
                                    <Button variant="secondary" className="me-2" onClick={() => navigate('/tasks')}>
                                        Cancel
                                    </Button>
                                    <Button variant="warning" type="submit" disabled={loading}>
                                        {loading ? <><Spinner animation="border" size="sm" /> Adding...</> : 'Add Task'}
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

export default AddTask; 