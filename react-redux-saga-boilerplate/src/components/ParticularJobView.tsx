import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';
interface Job {
  id: number;
  userId: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  dateOfPost: string;
  category: string;
  skills: string;
  lastDate: string;
}

interface ParticularJobViewProps {
  userId: number;
  user_role: string;
}

const ParticularJobView: React.FC<ParticularJobViewProps> = ({ userId, user_role }) => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applied, setApplied] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/joblisting/${id}`);
        const data = await response.json();
        setJob(data.job);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
      }
    };

    const checkIfApplied = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appliedjobs/check-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid: userId, jobid: id }),
        });

        const result = await response.json();
        setApplied(result.applied);
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    fetchJobDetails();
    checkIfApplied();
  }, [id, userId]);

  const applyJobHandler = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appliedjobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userId, jobid: job?.id }),
      });

      const result = await response.json();
      if (response.ok) {
        setApplied(true);
        setShowAlert({ success: true, message: 'Successfully applied for the job!' });
      } else {
        setShowAlert({ success: false, message: result.error || 'Failed to apply for the job' });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      setShowAlert({ success: false, message: 'Failed to apply for the job' });
    }

    setTimeout(() => setShowAlert(null), 3000); // Hide alert after 3 seconds
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center mt-5">Job not found.</div>;
  }

  if (user_role !== 'admin') {
    return (
      <div className="container mt-5">
        {showAlert && (
          <div
            className={`alert ${showAlert.success ? 'alert-success' : 'alert-danger'}`}
            role="alert"
          >
            {showAlert.message}
          </div>
        )}
        <div className="card">
          <div className="card-header">
            <h2>{job.title}</h2>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>Description:</strong> {job.description}
            </p>
            <p className="card-text">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="card-text">
              <strong>Salary:</strong> {job.salary}
            </p>
            <p className="card-text">
              <strong>Date Posted:</strong> {new Date(job.dateOfPost).toLocaleDateString()}
            </p>
            <p className="card-text">
              <strong>Last Date:</strong> {new Date(job.lastDate).toLocaleDateString()}
            </p>
            <p className="card-text">
              <strong>Category:</strong> {job.category}
            </p>
            <p className="card-text">
              <strong>Skills:</strong> {job.skills}
            </p>
            <button
              className={`btn ${applied ? 'btn-success' : 'btn-primary'}`}
              onClick={applyJobHandler}
              disabled={applied}
            >
              {applied ? (
                <>
                  <FontAwesomeIcon icon={faCheck} /> Applied
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/dashboard" />;
  }
};

export default ParticularJobView;
