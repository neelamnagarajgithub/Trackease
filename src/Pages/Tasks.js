import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Spinner, Alert, Badge, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching tasks with token:', token ? 'Token exists' : 'No token');
                
                const response = await axios.get('/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log('Tasks response:', response.data);
                setTasks(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tasks:', err.response || err);
                setError(`Failed to load tasks: ${err.response?.data?.message || err.message}`);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Remove from state
                setTasks(tasks.filter(task => task._id !== id));
            } catch (err) {
                console.error('Error deleting task:', err);
                alert('Failed to delete task. Please try again.');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/tasks/${id}`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update state
            setTasks(tasks.map(task => 
                task._id === id ? { ...task, status: newStatus } : task
            ));
        } catch (err) {
            console.error('Error updating task status:', err);
            alert('Failed to update task status. Please try again.');
        }
    };

    const filteredTasks = () => {
        if (filter === 'all') return tasks;
        return tasks.filter(task => task.status === filter);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <Badge bg="warning">Pending</Badge>;
            case 'in-progress':
                return <Badge bg="primary">In Progress</Badge>;
            case 'completed':
                return <Badge bg="success">Completed</Badge>;
            case 'on-hold':
                return <Badge bg="secondary">On Hold</Badge>;
            default:
                return <Badge bg="light" text="dark">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch(priority) {
            case 'low':
                return <Badge bg="info">Low</Badge>;
            case 'medium':
                return <Badge bg="primary">Medium</Badge>;
            case 'high':
                return <Badge bg="warning">High</Badge>;
            case 'urgent':
                return <Badge bg="danger">Urgent</Badge>;
            default:
                return <Badge bg="light" text="dark">{priority}</Badge>;
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" /> Loading tasks...
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Tasks</h2>
                <Button 
                    as={Link} 
                    to="/add-task" 
                    variant="warning"
                >
                    <FaPlus className="me-2" /> Add Task
                </Button>
            </div>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on-hold">On Hold</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {filteredTasks().length === 0 ? (
                        <div className="text-center py-5">
                            <p className="mb-3">No tasks found</p>
                            <Button 
                                as={Link} 
                                to="/add-task" 
                                variant="outline-warning"
                            >
                                Add Task
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Project</th>
                                        <th>Assigned To</th>
                                        <th>Due Date</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTasks().map(task => (
                                        <tr key={task._id}>
                                            <td>{task.title}</td>
                                            <td>{task.project?.name || 'Not assigned'}</td>
                                            <td>{task.assignedTo?.name || 'Unassigned'}</td>
                                            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                            <td>{getPriorityBadge(task.priority)}</td>
                                            <td>{getStatusBadge(task.status)}</td>
                                            <td>
                                                {task.status !== 'completed' && (
                                                    <Button 
                                                        variant="outline-success" 
                                                        size="sm" 
                                                        className="me-1"
                                                        onClick={() => handleStatusChange(task._id, 'completed')}
                                                        title="Mark as Completed"
                                                    >
                                                        <FaCheck />
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => navigate(`/tasks/${task._id}`)}
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => navigate(`/edit-task/${task._id}`)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(task._id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Tasks; 