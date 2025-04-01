import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/employees', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError('Failed to load employees. Please try again.');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Remove from state
                setEmployees(employees.filter(employee => employee._id !== id));
            } catch (err) {
                console.error('Error deleting employee:', err);
                alert('Failed to delete employee. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" /> Loading employees...
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
                <h2>Employees</h2>
                <Button 
                    as={Link} 
                    to="/add-employee" 
                    variant="primary"
                >
                    <FaUserPlus className="me-2" /> Add Employee
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {employees.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="mb-3">No employees found</p>
                            <Button 
                                as={Link} 
                                to="/add-employee" 
                                variant="outline-primary"
                            >
                                Add Employee
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Joining Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(employee => (
                                        <tr key={employee._id}>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.position}</td>
                                            <td>
                                                <Badge bg="info" pill>{employee.department}</Badge>
                                            </td>
                                            <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => navigate(`/employees/${employee._id}`)}
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="me-1"
                                                    onClick={() => navigate(`/edit-employee/${employee._id}`)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(employee._id)}
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

export default Employees; 