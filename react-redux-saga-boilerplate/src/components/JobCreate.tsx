import React, { useState } from 'react';
import JobForm, { JobDetails } from './JobForm';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CreateJobProps {
  onClose: () => void;
}

const CreateJob: React.FC<CreateJobProps> = ({ onClose }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger' | ''>('');

  const handleCreateJob = async (jobDetails: JobDetails, resetForm: () => void) => {
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/jobcreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobDetails),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      setAlertMessage('Job created successfully!');
      setAlertVariant('success');

      resetForm();
      setTimeout(() => {
        setAlertMessage('');
        onClose(); // Close modal after successful creation
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Failed to create job. Please try again.');
      setAlertVariant('danger');
    }
  };

  return (
    <div>
      <JobForm onSubmit={handleCreateJob} />
      <div className="w-100 d-flex justify-content-center">
        {alertMessage && (
          <Alert variant={alertVariant} className="mx-1 mt-5 w-50">
            {alertMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
