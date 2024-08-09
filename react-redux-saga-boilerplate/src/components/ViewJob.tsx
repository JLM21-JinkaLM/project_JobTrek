import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { JobDetails as OriginalJobDetails } from './JobForm';
import CreateJob from './JobCreate';

// Extend JobDetails interface to include skill_names
interface JobDetails extends OriginalJobDetails {
  skill_names?: string[];
}

const ViewJob: React.FC = () => {
  const [rowData, setRowData] = useState<JobDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger' | ''>('');
  const navigate = useNavigate();

  const jobListingHandler = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/jobdetails');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      const formattedData = data.jobs.map((job: JobDetails) => ({
        ...job,
        skill_names: job.skill_names ? job.skill_names.join(', ') : '', // Join array elements with a comma
      }));

      setRowData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    jobListingHandler();
  }, []);

  const handleEdit = (id: string) => {
    setSelectedJobId(id);
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (selectedJobId) {
      navigate(`/dashboard/editjob/${selectedJobId}`);
      setShowEditModal(false);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedJobId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedJobId) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/jobdelete/${selectedJobId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setRowData(prevData => prevData.filter(job => job.id !== selectedJobId));
        setAlertMessage('Job deleted successfully!');
        setAlertVariant('success');
      } catch (error) {
        console.error('Error deleting job:', error);
        setAlertMessage('Failed to delete job. Please try again.');
        setAlertVariant('danger');
      } finally {
        setShowDeleteModal(false);
        setTimeout(() => {
          setAlertMessage('');
          setAlertVariant('');
        }, 3000);
      }
    }
  };

  const handleViewUsers = (jobId: string) => {
    navigate(`/dashboard/userlist/jobid/${jobId}`, { state: { jobId } });
  };

  const ActionCellRenderer: React.FC<ICellRendererParams> = params => {
    return (
      <div>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleEdit(params.data.id)}
          style={{ marginRight: '0.5rem' }}
        >
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(params.data.id)}>
          Delete
        </button>
      </div>
    );
  };

  const ViewUsersCellRenderer: React.FC<ICellRendererParams> = params => {
    return (
      <button className="btn btn-sm btn-info" onClick={() => handleViewUsers(params.data.id)}>
        View Users
      </button>
    );
  };

  const frameworkComponents = {
    actionCellRenderer: ActionCellRenderer,
    viewUsersCellRenderer: ViewUsersCellRenderer,
  };

  const columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Job Title', sortable: true, filter: true },
    { field: 'description', headerName: 'Description', sortable: true, filter: true },
    { field: 'location_name', headerName: 'Location', sortable: true, filter: true },
    { field: 'salary', headerName: 'Salary', sortable: true, filter: true },
    { field: 'skill_names', headerName: 'Skills', sortable: true, filter: true }, // Updated to skill_names
    { field: 'category_name', headerName: 'Category', sortable: true, filter: true },
    { field: 'experience', headerName: 'Experience', sortable: true, filter: true },
    { field: 'jobtype', headerName: 'Job Type', sortable: true, filter: true },
    { field: 'education', headerName: 'Education', sortable: true, filter: true },
    { field: 'dateOfPost', headerName: 'Date of Post', sortable: true, filter: true },
    { field: 'lastDate', headerName: 'Last Date', sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: 'actionCellRenderer',
    },
    {
      headerName: 'Applied Users',
      cellRenderer: 'viewUsersCellRenderer',
      width: 150,
    },
  ];

  const handleModalClose = () => {
    setShowModal(false);
    jobListingHandler();
  };

  return (
    <div className="App" style={{ margin: '2rem 1rem' }}>
      <div className="d-flex justify-content-between align-items-center">
        <h2 style={{ margin: '1rem' }}>Job Listing</h2>
        <button
          className="btn btn-light border-dark bg-dark text-white"
          style={{ margin: '1rem', padding: '1rem' }}
          onClick={() => setShowModal(true)}
        >
          Create Job
        </button>
      </div>
      {alertMessage && (
        <Alert variant={alertVariant} className="w-50 mx-auto">
          {alertMessage}
        </Alert>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="ag-theme-alpine ag-style" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            defaultColDef={{ flex: 1 }}
            rowHeight={60}
            rowData={rowData}
            columnDefs={columnDefs}
            components={frameworkComponents}
          />
        </div>
      )}

      {/* Modal for creating job */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateJob onClose={handleModalClose} />
        </Modal.Body>
      </Modal>

      {/* Modal for edit confirmation */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to edit this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmDelete}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewJob;
