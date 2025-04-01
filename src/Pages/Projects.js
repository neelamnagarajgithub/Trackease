import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Spinner, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { FaFolderPlus, FaEdit, FaTrash, FaEye, FaTasks } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching projects with token:', token ? 'Token exists' : 'No token');
                
                const response = await axios.get('/api/projects', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log('Projects response:', response.data);
                setProjects(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err.response || err);
                setError(`Failed to load projects: ${err.response?.data?.message || err.message}`);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/projects/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Remove from state
                setProjects(projects.filter(project => project._id !== id));
            } catch (err) {
                console.error('Error deleting project:', err);
                alert('Failed to delete project. Please try again.');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'active':
                return <Badge bg="success">Active</Badge>;
            case 'on-hold':
                return <Badge bg="warning">On Hold</Badge>;
            case 'completed':
                return <Badge bg="info">Completed</Badge>;
            case 'cancelled':
                return <Badge bg="danger">Cancelled</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const getProgressVariant = (progress) => {
        if (progress < 30) return 'danger';
        if (progress < 70) return 'warning';
        return 'success';
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" /> Loading projects...
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
                <h2>Projects</h2>
                <Button 
                    as={Link} 
                    to="/add-project" 
                    variant="success"
                >
                    <FaFolderPlus className="me-2" /> Add Project
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {projects.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="mb-3">No projects found</p>
                            <Button 
                                as={Link} 
                                to="/add-project" 
                                variant="outline-success"
                            >
                                Add Project
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Timeline</th>
                                        <th>Status</th>
                                        <th>Progress</th>
                                        <th>Tasks</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => {
                                        // Calculate progress percentage
                                        const progress = project.totalTasks > 0 
                                            ? Math.round((project.completedTasks / project.totalTasks) * 100) 
                                            : 0;
                                        
                                        return (
                                            <tr key={project._id}>
                                                <td>{project.name}</td>
                                                <td>
                                                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                                </td>
                                                <td>{getStatusBadge(project.status)}</td>
                                                <td>
                                                    <ProgressBar 
                                                        now={progress} 
                                                        label={`${progress}%`} 
                                                        variant={getProgressVariant(progress)} 
                                                    />
                                                </td>
                                                <td>
                                                    {project.completedTasks}/{project.totalTasks}
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="outline-info" 
                                                        size="sm" 
                                                        className="me-1"
                                                        onClick={() => navigate(`/projects/${project._id}`)}
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                    <Button 
                                                        variant="outline-warning" 
                                                        size="sm" 
                                                        className="me-1"
                                                        onClick={() => navigate(`/projects/${project._id}/tasks`)}
                                                    >
                                                        <FaTasks />
                                                    </Button>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        className="me-1"
                                                        onClick={() => navigate(`/edit-project/${project._id}`)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleDelete(project._id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Projects; 