import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ColDef } from 'ag-grid-community';
import axios from 'axios';

interface LocationData {
  id: number; // Internal ID for managing row order
  locationId: number; // External ID from the backend
  location_name: string;
  country: string;
}

const Location: React.FC = () => {
  const [rowData, setRowData] = useState<LocationData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ location_name: '', country: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const gridRef = useRef<AgGridReact>(null); // Reference to AG Grid

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/location/locations');
        if (response.data.success) {
          // Set row data with external ID from backend
          setRowData(
            response.data.locations.map((location: any, index: number) => ({
              id: index + 1, // Internal ID for managing row order
              locationId: location.id,
              location_name: location.location_name,
              country: location.country,
            })),
          );
        } else {
          showAlert('danger', response.data.msg || 'Error fetching locations');
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
        showAlert('danger', 'Error fetching locations');
      }
    };
    fetchLocations();
  }, []);

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000); // Clear alert after 3 seconds
  };

  const handleCreateOrEditLocation = async () => {
    setAlert(null);
    try {
      if (editMode && editId !== null) {
        await axios.put(
          `http://localhost:5000/api/location/locations/${rowData.find(loc => loc.id === editId)?.locationId}`,
          newLocation,
        );
        // Update row data in AG Grid
        setRowData(
          rowData.map(location =>
            location.id === editId
              ? {
                  ...location,
                  location_name: newLocation.location_name,
                  country: newLocation.country,
                }
              : location,
          ),
        );
        showAlert('success', 'Location updated successfully');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/location/locations',
          newLocation,
        );
        if (response.data.success) {
          // Add new location to row data in AG Grid
          setRowData([
            ...rowData,
            {
              id: rowData.length + 1, // Increment the internal ID
              locationId: response.data.location.id,
              location_name: newLocation.location_name,
              country: newLocation.country,
            },
          ]);
          showAlert('success', 'Location added successfully');
        } else {
          showAlert('danger', response.data.msg || 'Error creating location');
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        const errorMsg = err.response.data.msg || 'Error processing request';
        showAlert('danger', errorMsg);
      } else {
        showAlert('danger', 'An unexpected error occurred');
      }
    } finally {
      setShowModal(false);
      setShowForm(false);
      setNewLocation({ location_name: '', country: '' });
      setEditMode(false);
      setEditId(null);

      // Refresh the AG Grid
      gridRef.current?.api.setRowData(rowData);
    }
  };

  const handleDelete = async () => {
    if (editId !== null) {
      try {
        await axios.delete(
          `http://localhost:5000/api/location/locations/${rowData.find(loc => loc.id === editId)?.locationId}`,
        );
        // Remove category from row data in AG Grid and reorder
        const updatedRowData = rowData
          .filter(location => location.id !== editId)
          .map((location, index) => ({
            ...location,
            id: index + 1, // Reorder IDs
          }));
        setRowData(updatedRowData);
        showAlert('success', 'Location deleted successfully');
      } catch (err) {
        console.error('Error deleting location:', err);
        showAlert('danger', 'Error deleting location');
      }
    }
    setShowModal(false);
    setDeleteMode(false);
    setEditId(null);
  };

  const handleEdit = (id: number) => {
    const locationToEdit = rowData.find(location => location.id === id);
    if (locationToEdit) {
      setNewLocation({
        location_name: locationToEdit.location_name,
        country: locationToEdit.country,
      });
      setEditId(id);
      setEditMode(true);
      setShowForm(true);
      setShowModal(true);
    }
  };

  const openModal = (id: number, type: 'edit' | 'delete') => {
    if (type === 'edit') {
      handleEdit(id);
    } else {
      setEditId(id);
      setDeleteMode(true);
      setShowModal(true);
    }
  };

  const ActionCellRenderer: React.FC<{ data: LocationData }> = ({ data }) => (
    <div>
      <Button
        variant="warning"
        size="sm"
        className="mr-2"
        onClick={() => openModal(data.id, 'edit')}
      >
        Edit
      </Button>
      <Button variant="danger" size="sm" onClick={() => openModal(data.id, 'delete')}>
        Delete
      </Button>
    </div>
  );

  const columnDefs: ColDef<LocationData>[] = [
    { headerName: 'Internal ID', field: 'id', sortable: true, filter: true, width: 150 },
    { headerName: 'Location ID', field: 'locationId', sortable: true, filter: true, width: 150 },
    {
      headerName: 'Location Name',
      field: 'location_name',
      sortable: true,
      filter: true,
      width: 225,
    },
    { headerName: 'Country', field: 'country', sortable: true, filter: true, width: 250 },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRenderer,
      width: 200,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Location</h2>
        <Button
          variant="primary"
          onClick={() => {
            setShowModal(true);
            setShowForm(true);
            setEditMode(false);
          }}
        >
          Create Location
        </Button>
      </div>
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}
      <div
        className="ag-theme-alpine"
        style={{
          height: '400px',
          width: '100%',
          overflow: 'auto', // Enable overflow scrolling
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
        />
      </div>

      {/* Modal for both Confirmation and Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? 'Edit Location' : deleteMode ? 'Delete Location' : 'Create Location'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showForm && (
            <Form>
              <Form.Group controlId="formlocation_name">
                <Form.Label>Location Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location name"
                  value={newLocation.location_name}
                  onChange={e => setNewLocation({ ...newLocation, location_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country name"
                  value={newLocation.country}
                  onChange={e => setNewLocation({ ...newLocation, country: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
          {deleteMode && <p>Are you sure you want to delete this location?</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {editMode && (
            <Button variant="primary" onClick={handleCreateOrEditLocation}>
              Save Changes
            </Button>
          )}
          {deleteMode && (
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          )}
          {!editMode && !deleteMode && (
            <Button variant="primary" onClick={handleCreateOrEditLocation}>
              Create Location
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Location;
