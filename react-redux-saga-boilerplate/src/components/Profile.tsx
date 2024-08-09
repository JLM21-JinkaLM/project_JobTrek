import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  city: string;
  country: string;
  education: string;
  skills: string[];
  description: string;
}

interface ProfileProps {
  role: {
    email: string;
    id: string;
    user_role: string; // User ID
  };
}

const Profile: React.FC<ProfileProps> = ({ role }) => {
  const [profile, setProfile] = useState<UserProfile>({
    userId: role.id,
    name: '',
    email: role.email,
    phone: '',
    gender: '',
    city: '',
    country: '',
    education: '',
    skills: [],
    description: '',
  });

  console.log(role, '[[[[[[[[[[[[[[[[[[');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profiles/${role.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...data,
          skills: Array.isArray(data.skills)
            ? data.skills
            : typeof data.skills === 'string'
              ? data.skills.split(',').map((skill: string) => skill.trim())
              : [],
        });
        setProfileExists(true);
      } else {
        setProfileExists(false);
        setIsEditing(true); // Enable editing if profile does not exist
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    }
  };

  useEffect(() => {
    fetchProfile(); // Fetch profile when component mounts or role.id changes
  }, [role.id]);

  useEffect(() => {
    // Automatically hide alerts after 1 second
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 1000);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [error, success]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      skills: value.split(',').map((skill: string) => skill.trim()), // Convert comma-separated string to array
    }));
  };

  const handleCancel = () => {
    if (profileExists) {
      fetchProfile(); // Re-fetch profile to reset fields
    } else {
      setProfile(prevProfile => ({
        ...prevProfile,
        name: '',
        phone: '',
        gender: '',
        city: '',
        country: '',
        education: '',
        skills: [],
        description: '',
      }));
    }
    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profile.name || !profile.phone) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const endpoint = profileExists
        ? `http://localhost:5000/api/users/profiles/${role.id}`
        : `http://localhost:5000/api/users/profiles`;
      const method = profileExists ? 'PUT' : 'POST'; // Use PUT for updates, POST for new profiles

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      console.log('Profile saved:', result);
      setError(null);
      setSuccess('Profile saved successfully!');
      setIsEditing(false); // Exit edit mode after saving
      if (!profileExists) {
        setProfileExists(true); // Set profileExists to true if a new profile was created
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error saving profile: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      setSuccess(null); // Clear success message on error
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

  if (role.user_role !== 'admin') {
    return (
      <div className="container mt-4">
        <h1 className="mb-4">User Profile</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group as={Row} controlId="formName">
            <Form.Label column sm={3}>
              Name
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formEmail">
            <Form.Label column sm={3}>
              Email
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="email" name="email" value={profile.email} readOnly />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPhone">
            <Form.Label column sm={3}>
              Phone Number
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formGender">
            <Form.Label column sm={3}>
              Gender
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="select"
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                required
                disabled={!isEditing}
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCity">
            <Form.Label column sm={3}>
              City
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="city"
                value={profile.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                required
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCountry">
            <Form.Label column sm={3}>
              Country
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="country"
                value={profile.country}
                onChange={handleInputChange}
                placeholder="Enter your country"
                required
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formEducation">
            <Form.Label column sm={3}>
              Education
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="education"
                value={profile.education}
                onChange={handleInputChange}
                placeholder="Enter your education"
                required
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formSkills">
            <Form.Label column sm={3}>
              Skills
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="skills"
                value={profile.skills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="Enter your skills (comma separated)"
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formDescription">
            <Form.Label column sm={3}>
              Description
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                name="description"
                value={profile.description}
                onChange={handleInputChange}
                placeholder="Enter a brief description"
                readOnly={!isEditing}
              />
            </Col>
          </Form.Group>

          <Row>
            <Col>
              {isEditing ? (
                <>
                  <Button variant="primary" className="me-2" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    );
  } else {
    return <Navigate to="/dashboard" />;
  }
};

export default Profile;
