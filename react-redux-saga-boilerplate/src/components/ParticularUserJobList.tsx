import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Badge, Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

interface JobDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  skills: string;
  category: string;
  dateOfPost: string;
  lastDate: string;
  status: string; // Status added to JobDetails
}

const ParticularUserJobList: React.FC = () => {
  const location = useLocation();
  const { userId } = location.state as { userId: string };
  const [jobs, setJobs] = useState<JobDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //   alert(userId);
  useEffect(() => {
    if (!userId) {
      setError('User ID is not provided');
      setLoading(false);
      return;
    }

    const fetchUserJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appliedjobs/userjobs/${userId}`);
        const data = await response.json();
        if (response.ok) {
          if (data.jobs.length === 0) {
            setError('No jobs found for this user');
          } else {
            setJobs(data.jobs);
          }
        } else {
          console.error('Failed to fetch jobs:', data.error);
          setError(data.error || 'Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, [userId]);

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="mt-5">
      <h2 className="m-5">Job List for User: {userId}</h2>
      <Row>
        {jobs.map(job => (
          <Col key={job.id} md={4} className="mb-4 w-50">
            <Card className="m-3">
              <Card.Body>
                <Card.Title className="my-3">
                  <h3>
                    <strong>{job.title}</strong>
                  </h3>
                </Card.Title>
                <Card.Text>{job.description}</Card.Text>
                <Card.Text>
                  <strong>Location:</strong> {job.location}
                </Card.Text>
                <Card.Text>
                  <strong>Salary:</strong> {job.salary}
                </Card.Text>
                <Card.Text>
                  <strong>Skills:</strong> {job.skills}
                </Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {job.category}
                </Card.Text>
                <Badge bg={getBadgeVariant(job.status)} className="mr-2">
                  Status
                </Badge>
                <span className={`text-${getBadgeVariant(job.status)}`}>{job.status}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ParticularUserJobList;
