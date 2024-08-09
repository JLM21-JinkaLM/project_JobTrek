import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Alert from 'react-bootstrap/Alert'; // Import Alert from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling
import { useDispatch } from 'react-redux';
import { login } from '../store/actions';
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const FormWrapper = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #113740;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false); // State to control visibility of Alert
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger' | 'info' | 'warning'>(
    'success',
  ); // Alert variant (success, danger, info, warning)
  const [alertMessage, setAlertMessage] = useState<string>(''); // Alert message content
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // console.log(response);

      const data = await response.json();
      console.log(data);

      if (response.ok && data.success) {
        setAlertVariant('success');
        setAlertMessage(data.message || 'Login successful!');
        setShowAlert(true);

        // localStorage.setItem('token', data.token);
        // localStorage.setItem('user_role', data.user.user_role);
        // console.log(data.user.user_role);

        // if (data.user.user_role === 'admin') {
        //   setTimeout(() => {
        //     navigate('/dashboard');
        //   }, 1000);
        // } else {
        //   setTimeout(() => {
        //     navigate('/private');
        //   }, 1000);
        // }

        setEmail('');
        setPassword('');
        // navigate('/dashboard'); // Navigate to dashboard
        dispatch(login(data.user));
        console.log(data.user, 'ppppp');
        // setTimeout(() => {
        //   navigate('/dashboard');
        // }, 1000);
      } else {
        setAlertVariant('danger');
        setAlertMessage(data.message || 'Login failed!');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAlertVariant('danger');
      setAlertMessage('An error occurred during login.');
      setShowAlert(true);
    }
  };

  return (
    <LoginContainer>
      <FormWrapper>
        <Title>Login</Title>
        {/* Display Alert if showAlert state is true */}
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <span>
          <a href="/register"> Go to register page</a>
        </span>
      </FormWrapper>
    </LoginContainer>
  );
};

export default LoginPage;
