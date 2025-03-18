import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { Element, animateScroll as scroll } from "react-scroll";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
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

  return (
    <Router>
      <>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-5 py-3 shadow-sm">
          <Link className="navbar-brand fw-bold" to="/">TrackEase</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">About Us</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/services">Services</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">Contact</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary ms-3" to="/login">Login</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
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
            </>
          } />
        </Routes>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3">
          <p>© 2025 TrackEase All rights reserved.</p>
        </footer>
      </>
    </Router>
  );
};

export default App;