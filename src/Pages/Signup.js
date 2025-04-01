import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [userData, setUserData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: '',
    organization: {
      name: '',
      description: '',
      contactPhone: '',
      address: ''
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password match
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Send signup request with organization data
      const response = await axios.post('/api/auth/signup', userData);
      
      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Store user info if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSignup}>
                <h4 className="mb-3">Your Information</h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        required
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        required
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        placeholder="Enter password"
                        minLength="7"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        required
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                <h4 className="mb-3">Organization Details</h4>
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={userData.organization.name}
                    onChange={(e) => setUserData({
                      ...userData,
                      organization: {
                        ...userData.organization,
                        name: e.target.value
                      }
                    })}
                    placeholder="Enter your company or organization name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={userData.organization.description}
                    onChange={(e) => setUserData({
                      ...userData,
                      organization: {
                        ...userData.organization,
                        description: e.target.value
                      }
                    })}
                    placeholder="Briefly describe your organization"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        value={userData.organization.contactPhone}
                        onChange={(e) => setUserData({
                          ...userData,
                          organization: {
                            ...userData.organization,
                            contactPhone: e.target.value
                          }
                        })}
                        placeholder="Enter organization phone number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={userData.organization.address}
                        onChange={(e) => setUserData({
                          ...userData,
                          organization: {
                            ...userData.organization,
                            address: e.target.value
                          }
                        })}
                        placeholder="Enter organization address"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;