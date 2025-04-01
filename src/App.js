import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import { Element } from "react-scroll";
import { FaUsers, FaProjectDiagram, FaTasks, FaUserPlus, FaFolderPlus, FaClipboardList, FaTachometerAlt, FaBuilding, FaBars } from "react-icons/fa";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";
import AddEmployee from "./Pages/AddEmployee";
import AddProject from "./Pages/AddProject";
import AddTask from "./Pages/AddTask";
import Employees from "./Pages/Employees";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('organizationName');
    setIsAuthenticated(false);
    window.location.href = '/login'; // Redirect to login page
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const AuthenticatedLayout = ({ children }) => {
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 992);
    const [organizationName, setOrganizationName] = useState('Your Organization');
    const [organizationInfo, setOrganizationInfo] = useState({
      name: 'Your Organization',
      email: '',
      phone: '',
      address: '',
      founded: '2025',
      employees: '0',
      industry: 'Technology',
      website: '',
      description: 'No description available'
    });
    const [showOrgModal, setShowOrgModal] = useState(false);
    
    useEffect(() => {
      // Get organization name from localStorage
      const storedOrgName = localStorage.getItem('organizationName');
      if (storedOrgName) {
        setOrganizationName(storedOrgName);
        setOrganizationInfo(prevInfo => ({
          ...prevInfo,
          name: storedOrgName
        }));
      }
      
      // Get user info from localStorage
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.email) {
            setOrganizationInfo(prevInfo => ({
              ...prevInfo,
              email: user.email
            }));
          }
          
          // If the user data has an organization object, use that information
          if (user.organization) {
            setOrganizationInfo(prevInfo => ({
              ...prevInfo,
              ...user.organization,
              employees: user.organization.employeeCount || prevInfo.employees
            }));
          }
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
      
      // Fetch organization data if we have an organization ID
      const organizationId = localStorage.getItem('organizationId');
      if (organizationId) {
        // You could add an API call here to fetch full organization details
        // For now, we'll use what we have in localStorage
      }
    }, []);
    
    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
    const openOrgModal = () => setShowOrgModal(true);
    const closeOrgModal = () => setShowOrgModal(false);
    
    return (
      <div className="d-flex">
        {/* Fixed Sidebar */}
        <div className={`bg-dark text-white ${sidebarCollapsed ? 'p-2' : 'p-3'}`} 
          style={{ 
            height: '100vh', 
            position: 'fixed',
            top: 0,
            left: 0,
            width: sidebarCollapsed ? '60px' : '250px',
            transition: 'width 0.3s ease',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            {!sidebarCollapsed && <h5 className="mb-0 fw-bold text-primary">TrackEase</h5>}
            <button 
              className="btn btn-dark btn-sm" 
              onClick={toggleSidebar}>
              {sidebarCollapsed ? '➡️' : '⬅️'}
            </button>
          </div>
          
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/dashboard"
                title="Dashboard"
              >
                <FaTachometerAlt className="me-2" />
                {!sidebarCollapsed && 'Dashboard'}
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/employees' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/employees"
                title="Employees"
              >
                <FaUsers className="me-2" />
                {!sidebarCollapsed && 'Employees'}
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/add-employee' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/add-employee"
                title="Add Employee"
              >
                <FaUserPlus className="me-2" />
                {!sidebarCollapsed && 'Add Employee'}
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/projects' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/projects"
                title="Projects"
              >
                <FaProjectDiagram className="me-2" />
                {!sidebarCollapsed && 'Projects'}
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/add-project' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/add-project"
                title="Add Project"
              >
                <FaFolderPlus className="me-2" />
                {!sidebarCollapsed && 'Add Project'}
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/tasks' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/tasks"
                title="Tasks"
              >
                <FaTasks className="me-2" />
                {!sidebarCollapsed && 'Tasks'}
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link 
                className={`nav-link ${location.pathname === '/add-task' ? 'active bg-primary rounded text-white' : 'text-white'}`} 
                to="/add-task"
                title="Add Task"
              >
                <FaClipboardList className="me-2" />
                {!sidebarCollapsed && 'Add Task'}
              </Link>
            </li>
            
            {/* Organization Info Button */}
            <li className="nav-item mb-3">
              <button 
                className="nav-link text-white border-0 bg-transparent w-100 text-start"
                style={{ cursor: 'pointer' }}
                title="Organization Info"
                onClick={openOrgModal}
              >
                <FaBuilding className="me-2" />
                {!sidebarCollapsed && 'Organization Info'}
              </button>
            </li>
            
            <li className="nav-item mt-5">
              <button 
                className="btn btn-danger w-100" 
                onClick={handleLogout}
                title="Logout"
              >
                {sidebarCollapsed ? '🚪' : 'Logout'}
              </button>
            </li>
          </ul>
        </div>

        {/* Main content with padding for sidebar */}
        <div style={{ 
          flex: 1, 
          marginLeft: sidebarCollapsed ? '60px' : '250px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh' 
        }}>
          {/* Top navbar for authenticated layout */}
          <nav className="navbar navbar-expand navbar-light bg-white shadow-sm">
            <div className="container-fluid">
              <span className="navbar-brand">
                <span className="text-primary fw-bold">TrackEase</span>
                <span className="text-muted mx-2">|</span>
                <span className="text-secondary">{organizationName}</span>
              </span>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </nav>
          
          {children}
        </div>
        
        {/* Organization Info Modal - Using React state instead of Bootstrap */}
        {showOrgModal && (
          <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Organization Information</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeOrgModal}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <h4 className="fw-bold text-primary">{organizationInfo.name}</h4>
                        <p className="text-muted">{organizationInfo.description}</p>
                      </div>
                      
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h5 className="border-bottom pb-2 mb-3">Contact Information</h5>
                          <div className="mb-2">
                            <strong>Email:</strong><br />
                            {organizationInfo.email || 'Not specified'}
                          </div>
                          <div className="mb-2">
                            <strong>Phone:</strong><br />
                            {organizationInfo.phone || 'Not specified'}
                          </div>
                          <div className="mb-2">
                            <strong>Address:</strong><br />
                            {organizationInfo.address || 'Not specified'}
                          </div>
                          {organizationInfo.website && (
                            <div className="mb-2">
                              <strong>Website:</strong><br />
                              <a href={organizationInfo.website.startsWith('http') ? organizationInfo.website : `https://${organizationInfo.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer">
                                {organizationInfo.website}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <h5 className="border-bottom pb-2 mb-3">Organization Details</h5>
                          <div className="mb-2">
                            <strong>Founded:</strong> {organizationInfo.founded}
                          </div>
                          <div className="mb-2">
                            <strong>Industry:</strong> {organizationInfo.industry}
                          </div>
                          <div className="mb-2">
                            <strong>Employees:</strong> {organizationInfo.employees}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <div className="bg-light rounded-circle p-4 mb-3 mx-auto" style={{ width: '120px', height: '120px' }}>
                          <FaBuilding size={64} className="text-primary" />
                        </div>
                        <div className="d-grid">
                          <button className="btn btn-outline-primary btn-sm" disabled>
                            Organization ID: {localStorage.getItem('organizationId') || 'Unknown'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="alert alert-info">
                    <strong>Data Privacy Note:</strong> All data stored in TrackEase is securely isolated by organization.
                    Your organization's data is not accessible to other organizations using the platform.
                    We implement strict access controls and encryption to ensure the confidentiality of your information.
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeOrgModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      <>
        {!isAuthenticated && (
          <nav className="navbar navbar-expand-lg navbar-light bg-white px-5 py-3 shadow-sm">
            <Link className="navbar-brand fw-bold" to="/">TrackEase</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={() => setNavExpanded(!navExpanded)}
              aria-controls="navbarNav" 
              aria-expanded={navExpanded ? "true" : "false"} 
              aria-label="Toggle navigation"
            >
              <FaBars />
            </button>
            <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => setNavExpanded(false)}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about" onClick={() => setNavExpanded(false)}>About Us</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/services" onClick={() => setNavExpanded(false)}>Services</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact" onClick={() => setNavExpanded(false)}>Contact</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-3" to="/login" onClick={() => setNavExpanded(false)}>Login</Link>
                </li>
              </ul>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes with authenticated layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Employees />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/add-employee" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AddEmployee />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Projects />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/add-project" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AddProject />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Tasks />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/add-task" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AddTask />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          {/* Landing page */}
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <Element name="home">
                <section className="text-center py-5">
                  <h1 className="fw-bold display-5">
                    Track your Employee Work Seamlessly with <br />
                    <span className="text-primary">Track Ease.</span>
                  </h1>
                  <img src={`${process.env.PUBLIC_URL}/hero-img.png`} alt="Hero" className="img-fluid my-4" width={700} />
                </section>
              </Element>

              {/* About Us */}
              <Element name="about">
                <section className="container py-5">
                  <h2 className="fw-bold">About Us</h2>
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <img src={`${process.env.PUBLIC_URL}/aboutus.png`} alt="About Us" className="img-fluid" />
                    </div>
                    <div className="col-md-5">
                      <h5><strong>Our Vision:</strong></h5>
                      <p>We are committed to simplifying employee management.</p>
                      <h5><strong>Our Mission:</strong></h5>
                      <p>Our mission is to provide businesses with an intuitive and powerful platform that enhances productivity and transparency. With a focus on innovation and ease of use, we help organizations of all sizes manage their workforce seamlessly.</p>
                    </div>
                  </div>
                </section>
              </Element>

              {/* Services */}
              <Element name="services">
                <section className="bg-light py-5 text-center">
                  <h2 className="fw-bold">TrackEase Services</h2>
                  <div className="container row mx-auto mt-4">
                    {[
                      { title: "Employee Management", img: `${process.env.PUBLIC_URL}/Employee_Management.png`, desc: "Easily track and manage employee details." },
                      { title: "Attendance Tracking", img: `${process.env.PUBLIC_URL}/attendence.png`, desc: "Monitor work hours and leaves in real-time." },
                      { title: "Performance Analytics", img: `${process.env.PUBLIC_URL}/analytics.png`, desc: "Get insightful reports on employee performance." },
                    ].map((service, idx) => (
                      <div key={idx} className="col-md-4">
                        <div className="card shadow-sm p-3">
                          <img src={service.img} alt={service.title} className="img-fluid mb-3" />
                          <h5>{service.title}</h5>
                          <p>{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary mt-4">Access Our Services</button>
                </section>
              </Element>

              {/* Contact Section */}
              <Element name="contact">
                <section className="container py-5">
                  <h2 className="fw-bold text-center">Contact Us</h2>
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <form>
                        <input type="text" className="form-control mb-3" placeholder="Name" />
                        <input type="email" className="form-control mb-3" placeholder="Email" />
                        <textarea className="form-control mb-3" placeholder="Message" rows="4"></textarea>
                        <button className="btn btn-primary w-100">Send</button>
                      </form>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Email:</strong> support@trackease.com</p>
                      <p><strong>Phone:</strong> +1 234 567 890</p>
                      <p><strong>Address:</strong> 123 Business Street, Tech City, USA</p>
                    </div>
                  </div>
                </section>
              </Element>
              
              {/* Footer only for landing page */}
              <footer className="bg-dark text-white text-center py-3">
                <p>© 2025 TrackEase All rights reserved.</p>
              </footer>
            </>
          } />
        </Routes>
      </>
    </Router>
  );
};

export default App;