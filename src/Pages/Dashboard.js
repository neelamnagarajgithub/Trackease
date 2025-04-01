import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaProjectDiagram, FaTasks, FaCalendarCheck } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalEmployees: 0,
        activeProjects: 0,
        pendingTasks: 0,
        attendanceRate: 0,
        recentActivities: [],
        projectProgress: [],
        taskStatusDistribution: { pending: 0, inProgress: 0, completed: 0, overdue: 0 },
        taskCompletionRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:11000/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                setLoading(false);
                console.error(err);
            }
        };

        fetchDashboardData();
    }, []);

    const taskStatusData = {
        labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
        datasets: [
            {
                label: 'Task Status',
                data: [
                    dashboardData.taskStatusDistribution.pending,
                    dashboardData.taskStatusDistribution.inProgress,
                    dashboardData.taskStatusDistribution.completed,
                    dashboardData.taskStatusDistribution.overdue
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const projectProgressData = {
        labels: dashboardData.projectProgress?.map(project => project.name) || [],
        datasets: [
            {
                label: 'Progress (%)',
                data: dashboardData.projectProgress?.map(project => project.progress) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const projectProgressOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Project Progress',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center m-5" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="row mb-5">
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex flex-column align-items-center">
                            <FaUsers className="text-primary mb-3" size={40} />
                            <h5 className="card-title">Employees</h5>
                            <h2 className="text-center">{dashboardData.totalEmployees}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex flex-column align-items-center">
                            <FaProjectDiagram className="text-success mb-3" size={40} />
                            <h5 className="card-title">Active Projects</h5>
                            <h2 className="text-center">{dashboardData.activeProjects}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex flex-column align-items-center">
                            <FaTasks className="text-warning mb-3" size={40} />
                            <h5 className="card-title">Pending Tasks</h5>
                            <h2 className="text-center">{dashboardData.pendingTasks}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex flex-column align-items-center">
                            <FaCalendarCheck className="text-info mb-3" size={40} />
                            <h5 className="card-title">Attendance Rate</h5>
                            <h2 className="text-center">{dashboardData.attendanceRate}%</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="row mb-5">
                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0">
                            <h5 className="mb-0">Task Status Distribution</h5>
                        </div>
                        <div className="card-body">
                            <Pie data={taskStatusData} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0">
                            <h5 className="mb-0">Project Progress</h5>
                        </div>
                        <div className="card-body">
                            {dashboardData.projectProgress && dashboardData.projectProgress.length > 0 ? (
                                <Bar data={projectProgressData} options={projectProgressOptions} />
                            ) : (
                                <p className="text-center text-muted">No active projects</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Completion Progress */}
            <div className="card border-0 shadow-sm mb-5">
                <div className="card-header bg-white border-0">
                    <h5 className="mb-0">Overall Task Completion</h5>
                </div>
                <div className="card-body">
                    <h2 className="text-center mb-3">{dashboardData.taskCompletionRate}%</h2>
                    <div className="progress" style={{ height: '25px' }}>
                        <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${dashboardData.taskCompletionRate}%` }} 
                            aria-valuenow={dashboardData.taskCompletionRate} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        >
                            {dashboardData.taskCompletionRate}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Progress Table */}
            <div className="card border-0 shadow-sm mb-5">
                <div className="card-header bg-white border-0">
                    <h5 className="mb-0">Active Projects</h5>
                </div>
                <div className="card-body">
                    {dashboardData.projectProgress && dashboardData.projectProgress.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.projectProgress.map((project) => (
                                        <tr key={project.id}>
                                            <td>{project.name}</td>
                                            <td>{project.startDate}</td>
                                            <td>{project.endDate}</td>
                                            <td>
                                                <div className="progress" style={{ height: '10px' }}>
                                                    <div 
                                                        className={`progress-bar ${project.progress < 30 ? 'bg-danger' : project.progress < 70 ? 'bg-warning' : 'bg-success'}`} 
                                                        role="progressbar" 
                                                        style={{ width: `${project.progress}%` }} 
                                                        aria-valuenow={project.progress} 
                                                        aria-valuemin="0" 
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <small>{project.progress}%</small>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-muted">No active projects</p>
                    )}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                    <h5 className="mb-0">Recent Activities</h5>
                </div>
                <div className="card-body">
                    {dashboardData.recentActivities.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Activity</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.recentActivities.map((activity, index) => (
                                        <tr key={activity.id || index}>
                                            <td>{activity.employee}</td>
                                            <td>{activity.activity}</td>
                                            <td>{activity.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-muted">No recent activities</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
