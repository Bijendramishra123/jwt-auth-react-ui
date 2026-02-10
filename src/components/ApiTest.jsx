import React, { useState } from 'react';
import { Button, Card, Alert, Form } from 'react-bootstrap';
import api from '../services/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('test@example.com');

  const testForgotPassword = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await api.post('/api/users/forgot-password', { email });
      setTestResult({
        success: true,
        status: response.status,
        data: response.data,
        message: 'API call successful! Check response data below.'
      });
    } catch (error) {
      setTestResult({
        success: false,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>API Test Panel</Card.Title>
        
        <Form.Group className="mb-3">
          <Form.Label>Test Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter test email"
          />
        </Form.Group>
        
        <Button 
          variant="outline-primary" 
          onClick={testForgotPassword}
          disabled={loading}
          className="mb-3"
        >
          {loading ? 'Testing...' : 'Test Forgot Password API'}
        </Button>
        
        {testResult && (
          <Alert variant={testResult.success ? 'success' : 'danger'}>
            <strong>Result:</strong> {testResult.message}
            <div className="mt-2">
              <strong>Status Code:</strong> {testResult.status}
            </div>
            {testResult.data && (
              <div className="mt-2">
                <strong>Response Data:</strong>
                <pre className="bg-dark text-light p-2 rounded mt-2">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </Alert>
        )}
        
        <div className="mt-3">
          <h6>Common Issues:</h6>
          <ul>
            <li>Check if backend has email service configured</li>
            <li>Verify CORS is enabled on backend</li>
            <li>Check network tab in browser DevTools</li>
            <li>API might return token directly in response</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ApiTest;
