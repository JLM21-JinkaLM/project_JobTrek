import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Badge } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

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
}

interface AppliedJob {
  id: number;
  jobid: string;
  userid: string;
  status: string;
  dateofapplied: string;
  jobDetails: JobDetails;
}

interface AppliedJobsProps {
  userId: string;
  user_role: string;
}

const AppliedJobs: React.FC<AppliedJobsProps> = ({ userId, user_role }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [appliedCount, setAppliedCount] = useState<number>(0);
  const [visibleStatus, setVisibleStatus] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchAppliedJobCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/appliedjobs/appliedcount/${userId}`,
        );
        const data = await response.json();
        if (response.ok) {
          setAppliedCount(data.count);
        } else {
          console.error('Failed to fetch applied job count:', data.error);
          setError(data.error || 'Failed to fetch applied job count');
        }
      } catch (error) {
        console.error('Error fetching applied job count:', error);
        setError('Error fetching applied job count');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobCount();

    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appliedjobs/${userId}/appliedjobs`);
        const data = await response.json();
        if (response.ok) {
          setJobs(data.jobs);
        } else {
          console.error('Failed to fetch applied jobs:', data.error);
          setError(data.error || 'Failed to fetch applied jobs');
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        setError('Error fetching applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  const toggleStatusVisibility = (jobId: number) => {
    setVisibleStatus(prevVisibleStatus => ({
      ...prevVisibleStatus,
      [jobId]: !prevVisibleStatus[jobId],
    }));
  };

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

  if (user_role !== 'admin') {
    return (
      <div>
        <div className="container mt-5">
          <h1 className="my-5 text-center" style={{ color: '#FF3371' }}>
            Applied Jobs
          </h1>
          <div className="container mt-5">
            <h3 className="text-right">Total Jobs Applied: {appliedCount}</h3>
          </div>
          <div className="row">
            {jobs.map(job => (
              <div key={job.id} className="col-md-4 mb-4">
                <Card className="p-2">
                  <Card.Body>
                    <Card.Title style={{ color: '#6E33FF' }}>
                      <h2>
                        <strong>{job.jobDetails.title}</strong>
                      </h2>
                    </Card.Title>
                    <Card.Text>{job.jobDetails.description}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => toggleStatusVisibility(job.id)}
                      className="mb-2"
                    >
                      Check Status
                    </Button>
                    {visibleStatus[job.id] && (
                      <div className="mt-3">
                        <p>
                          <Badge bg={getBadgeVariant(job.status)} className="mr-2">
                            Status:
                          </Badge>
                          <span className={`text-${getBadgeVariant(job.status)}`}>
                            {job.status}
                          </span>
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/dashboard" />;
  }
};

export default AppliedJobs;
