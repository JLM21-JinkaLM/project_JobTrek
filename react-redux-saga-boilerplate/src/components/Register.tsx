// import React, { useState, FormEvent } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';

// const RegistrationForm: React.FC = () => {
//   const [email, setEmail] = useState<string>('');
//   const [username, setUsername] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const navigate = useNavigate();

//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();

//     try {
//       const response = await fetch('http://localhost:5000/api/users/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, email, password }),
//       });
//       toast.success('registered successfully');
//       setEmail('');
//       setPassword('');
//       setUsername('');
//       // navigate('/login');

//       // if (response.ok) {
//       //   const data = await response.json();
//       //   if (data.success) {
//       //     toast.success(data.message); // Show success message
//       //     // navigate('/login'); // Redirect to login page
//       //   } else {
//       //     toast.error(data.message); // Show error message
//       //   }
//       // } else {
//       //   const data = await response.json();
//       //   toast.error(data.message); // Show error message for non-200 status
//       // }
//     } catch (error) {
//       console.error('Error registering user:', error);
//       toast.error('Error registering user'); // Show generic error message
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {/* <ToastContainer /> */}
//       <h2>Registration</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>UserName</label>
//           <input
//             type="text"
//             className="form-control"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             className="form-control"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegistrationForm;

import React, { useState, FormEvent } from 'react';
import styled from '@emotion/styled';
import Alert from 'react-bootstrap/Alert'; // Import Alert from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
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

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user_role, setUser_role] = useState<string>('user');
  const [showAlert, setShowAlert] = useState(false); // State to control visibility of Alert
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger' | 'info' | 'warning'>(
    'success',
  ); // Alert variant (success, danger, info, warning)
  const [alertMessage, setAlertMessage] = useState<string>(''); // Alert message content
  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, user_role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlertVariant('success');
        setAlertMessage(data.msg || 'Registration successful!');
        setShowAlert(true);
        // Reset form fields
        setEmail('');
        setPassword('');
        setUsername('');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setAlertVariant('danger');
        setAlertMessage('Registration failed! ' + data.msg);
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setAlertVariant('danger');
      setAlertMessage('An error occurred during registration.');
      setShowAlert(true);
    }
  };

  return (
    <FormContainer>
      <FormWrapper>
        <Title>Registration</Title>
        {/* Display Alert if showAlert state is true */}
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              UserName
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
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
          {/* <div className="mb-3">
            <label htmlFor="select">Select Role</label>
            <select
              name="user_role"
              id="user_role"
              className="form-control"
              value={user_role}
              onChange={e => setUser_role(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          
          </div> */}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          <span>
            <a href="/login"> Return to Login Page</a>
          </span>
        </form>
      </FormWrapper>
    </FormContainer>
  );
};

export default RegistrationForm;
