import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ToastAlert from '../components/ToastAlert';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [resetToken, setResetToken] = useState(''); // For demo/testing
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/users/forgot-password', { email });
      
      // Check if response contains a token (for demo/testing)
      if (response.data?.token) {
        setResetToken(response.data.token);
      }
      
      setSuccess('Password reset email sent! Check your inbox (and spam folder).');
      setShowToast(true);
      
    } catch (err) {
      console.error('Forgot password error:', err);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (err.response?.status === 404) {
        errorMessage = 'Email not found. Please check your email address.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoToken = () => {
    // For testing - simulate getting a token
    const demoToken = `demo-token-${Date.now()}`;
    setResetToken(demoToken);
    setSuccess(`Demo token generated: ${demoToken}. Copy this to reset password page.`);
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
          <h2 className="text-center mb-4">Forgot Password</h2>
          <p className="text-center text-muted mb-4">
            Enter your email address and we'll send you a reset link
          </p>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <strong>Error:</strong> {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            {/* Demo/testing section - can be removed in production */}
            <div className="border-top pt-3 mt-3">
              <h6 className="text-center mb-3">Testing Note</h6>
              <Alert variant="info">
                <strong>Note:</strong> Since this is a demo/test environment, emails might not actually be sent.
                <ListGroup variant="flush" className="mt-2">
                  <ListGroup.Item className="bg-transparent border-0 p-1">
                    • Check your email's spam folder
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent border-0 p-1">
                    • The backend might return a token in the response
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent border-0 p-1">
                    • Use the button below for a demo token
                  </ListGroup.Item>
                </ListGroup>
              </Alert>
              
              <Button 
                variant="outline-info" 
                className="w-100 mb-3"
                onClick={handleUseDemoToken}
              >
                Generate Demo Token for Testing
              </Button>
            </div>

            {resetToken && (
              <Alert variant="warning" className="mt-3">
                <strong>Reset Token:</strong> 
                <div className="mt-2 mb-2 p-2 bg-dark text-light rounded">
                  <code>{resetToken}</code>
                </div>
                <p className="mb-0">
                  Copy this token and use it on the reset password page.
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => navigate('/reset-password')}
                  >
                    Go to Reset Page
                  </Button>
                </p>
              </Alert>
            )}

            <div className="text-center mt-3">
              <p className="mb-0">
                Remember your password?{' '}
                <Link to="/login" className="text-decoration-none">
                  Back to Login
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
