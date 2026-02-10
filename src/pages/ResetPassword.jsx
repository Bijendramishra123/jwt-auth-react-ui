import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ToastAlert from '../components/ToastAlert';
import api from '../services/api';

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get('token') || '';
  
  const [formData, setFormData] = useState({
    token: tokenFromUrl,
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.token || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/users/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword
      });
      
      console.log('Reset password response:', response.data);
      
      setSuccess('Password reset successful! You can now login with your new password.');
      setShowToast(true);
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.response?.status === 400) {
        errorMessage = 'Invalid or expired reset token. Please request a new reset link.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // For testing - use a demo token
  const useDemoToken = () => {
    const demoToken = `demo-token-${Date.now()}-test`;
    setFormData({...formData, token: demoToken});
    setSuccess(`Demo token applied: ${demoToken}. You can now test the reset.`);
    setShowToast(true);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <ToastAlert 
        show={showToast} 
        message={success}
        type="success"
        onClose={() => setShowToast(false)}
      />
      
      <Card className="shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          <p className="text-center text-muted mb-4">
            Enter the reset token and your new password
          </p>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <strong>Error:</strong> {error}
            </Alert>
          )}

          {/* Help section */}
          <Alert variant="info" className="mb-4">
            <strong>Where to find your token:</strong>
            <ul className="mb-0 mt-2">
              <li>Check your email inbox (and spam folder)</li>
              <li>Look for an email from the system</li>
              <li>The token should be in the email or link</li>
              <li>For testing, use the demo token button below</li>
            </ul>
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Reset Token</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showToken ? "text" : "password"}
                  name="token"
                  placeholder="Enter reset token from email"
                  value={formData.token}
                  onChange={handleChange}
                  required
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? 'Hide' : 'Show'}
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Check your email for the reset token. If no email arrived, check spam or request again.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="New password (min 6 characters)"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button 
              variant="success" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>

            {/* Testing section */}
            <div className="border-top pt-3">
              <h6 className="text-center mb-3">Testing / Debugging</h6>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-warning" 
                  onClick={useDemoToken}
                >
                  Use Demo Token for Testing
                </Button>
                
                <Button 
                  variant="outline-info"
                  onClick={() => {
                    // Test with a simple password
                    setFormData({
                      token: 'test-token-123',
                      newPassword: 'password123',
                      confirmPassword: 'password123'
                    });
                    setSuccess('Test data filled. Click Reset Password to test.');
                    setShowToast(true);
                  }}
                >
                  Fill Test Data
                </Button>
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    console.log('Current form data:', formData);
                    console.log('Testing API connection...');
                    
                    // Test API connection
                    api.get('/')
                      .then(res => console.log('API is reachable:', res.status))
                      .catch(err => console.error('API error:', err));
                    
                    setSuccess('Check browser console for debugging info.');
                    setShowToast(true);
                  }}
                >
                  Debug API Connection
                </Button>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="mb-0">
                Need a new reset link?{' '}
                <Link to="/forgot-password" className="text-decoration-none">
                  Request again
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword;
