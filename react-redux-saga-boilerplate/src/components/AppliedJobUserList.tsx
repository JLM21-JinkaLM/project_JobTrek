import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  user_id: string;
  user_name: string;
  user_email: string;
}

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  city: string;
  country: string;
  education: string;
  skills: string | string[];
  description: string;
}

interface AppliedJobUserListState {
  jobId?: string;
}

const AppliedJobUserList: React.FC = () => {
  const location = useLocation();
  const state = location.state as AppliedJobUserListState;
  const jobId = state?.jobId || '';

  const [users, setUsers] = useState<User[]>([]);
  const [userStatuses, setUserStatuses] = useState<
    Record<string, 'Pending' | 'Accepted' | 'Rejected'>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users and their statuses
  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided. Please navigate properly.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        // Fetch users
        const response = await fetch(
          `http://localhost:5000/api/appliedjobs/unique-applied-users-job/${jobId}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        const data = await response.json();
        if (data.length === 0) {
          setError('No users have applied for this job.');
        } else {
          setUsers(data);

          // Fetch status for each user
          const statusPromises = data.map(async (user: User) => {
            const statusResponse = await fetch(
              `http://localhost:5000/api/appliedjobs/status/${jobId}/${user.user_id}`,
            );
            if (!statusResponse.ok) {
              throw new Error('Failed to fetch application status');
            }
            const statusData = await statusResponse.json();
            return { userId: user.user_id, status: statusData.status };
          });

          const statusResults = await Promise.all(statusPromises);
          const statusMap: Record<string, 'Pending' | 'Accepted' | 'Rejected'> = {};
          statusResults.forEach(({ userId, status }) => {
            statusMap[userId] = status;
          });
          setUserStatuses(statusMap);
        }
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, [jobId]);

  const handleShowModal = async (userId: string) => {
    try {
      // Fetch user profile
      const profileResponse = await fetch(
        `http://localhost:5000/api/appliedjobs/profiles/${userId}`,
      );
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const profileData = await profileResponse.json();
      setSelectedUser(profileData);
      setShowModal(true);
    } catch (err) {
      setError('Error fetching user profile');
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAccept = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`http://localhost:5000/api/appliedjobs/accept/${jobId}/${selectedUser.userId}`, {
        method: 'POST',
      });
      setUserStatuses(prevStatus => ({ ...prevStatus, [selectedUser.userId]: 'Accepted' }));
      setShowModal(false); // Close modal after action
    } catch (err) {
      setError('Error accepting user');
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`http://localhost:5000/api/appliedjobs/reject/${jobId}/${selectedUser.userId}`, {
        method: 'POST',
      });
      setUserStatuses(prevStatus => ({ ...prevStatus, [selectedUser.userId]: 'Rejected' }));
      setShowModal(false); // Close modal after action
    } catch (err) {
      setError('Error rejecting user');
    }
  };

  // Function to handle skills as either array or comma-separated string
  const formatSkills = (skills: string | string[]) => {
    if (Array.isArray(skills)) {
      return skills.join(', ');
    } else {
      return skills;
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Users for Job ID: {jobId}</h3>
      {users.length === 0 ? (
        <Alert variant="info">No users have applied for this job.</Alert>
      ) : (
        <div className="d-flex flex-wrap">
          {users.map(user => (
            <Card key={user.user_id} style={{ width: '30rem', margin: '1rem', height: '15rem' }}>
              <Card.Body>
                <Card.Title className="py-3">
                  <h3>
                    <strong>Username: {user.user_name}</strong>
                  </h3>
                </Card.Title>
                <Card.Text className="py-3">Email: {user.user_email}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="primary" onClick={() => handleShowModal(user.user_id)}>
                    View Details
                  </Button>
                  <span
                    className={`badge ${userStatuses[user.user_id] === 'Accepted' ? 'bg-success' : userStatuses[user.user_id] === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}
                  >
                    {userStatuses[user.user_id] || 'Pending'}
                  </span>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Gender:</strong> {selectedUser.gender}
              </p>
              <p>
                <strong>City:</strong> {selectedUser.city}
              </p>
              <p>
                <strong>Country:</strong> {selectedUser.country}
              </p>
              <p>
                <strong>Education:</strong> {selectedUser.education}
              </p>
              <p>
                <strong>Skills:</strong> {formatSkills(selectedUser.skills)}
              </p>
              <p>
                <strong>Description:</strong> {selectedUser.description}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {userStatuses[selectedUser?.userId || ''] === 'Pending' && (
            <>
              <Button variant="success" onClick={handleAccept}>
                Accept
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Reject
              </Button>
            </>
          )}
          {userStatuses[selectedUser?.userId || ''] === 'Accepted' && (
            <Button variant="success" disabled>
              Accepted
            </Button>
          )}
          {userStatuses[selectedUser?.userId || ''] === 'Rejected' && (
            <Button variant="danger" disabled>
              Rejected
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppliedJobUserList;
