import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth'; // DEFAULT import
import ToastAlert from '../components/ToastAlert';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile();
      setUserData(data);
      setToastMessage('Profile loaded successfully!');
      setShowToast(true);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <ToastAlert 
        show={showToast} 
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
      />
      
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Dashboard</h1>
        <p className="lead">Welcome to your secure dashboard</p>
      </div>

      <Card className="shadow-lg mb-4">
        <Card.Body>
          <Card.Title className="mb-4">User Information</Card.Title>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <Alert variant="danger">
              {error}
            </Alert>
          ) : (
            <>
              <div className="mb-3">
                <strong>Email:</strong> {userData?.email || 'N/A'}
              </div>
              <div className="mb-3">
                <strong>User ID:</strong> {userData?.id || 'N/A'}
              </div>
              <div className="mb-3">
                <strong>Account Created:</strong> {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-lg">
        <Card.Body>
          <Card.Title className="mb-4">Quick Actions</Card.Title>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button 
              variant="outline-primary" 
              className="me-md-2"
              onClick={fetchProfile}
              disabled={loading}
            >
              Refresh Profile
            </Button>
            <Button 
              variant="outline-danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
