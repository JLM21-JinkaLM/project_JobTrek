import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ColDef } from 'ag-grid-community';
import axios from 'axios';

interface CategoryData {
  id: number; // Internal ID for managing row order
  categoryId: number; // External ID from the backend
  categoryName: string;
}

const Category: React.FC = () => {
  const [rowData, setRowData] = useState<CategoryData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const gridRef = useRef<AgGridReact>(null); // Reference to AG Grid

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/category/categories');
        if (response.data.success) {
          // Set row data with the external ID from backend
          setRowData(
            response.data.categories.map((category: any, index: number) => ({
              id: index + 1, // Internal ID for managing row order
              categoryId: category.id,
              categoryName: category.categoryName,
            })),
          );
        } else {
          showAlert('danger', response.data.msg);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        showAlert('danger', 'Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000); // Clear alert after 3 seconds
  };

  const handleCreateOrEditCategory = async () => {
    setAlert(null);
    try {
      if (editMode && editId !== null) {
        const response = await axios.put(
          `http://localhost:5000/api/category/categories/${rowData.find(cat => cat.id === editId)?.categoryId}`,
          newCategory,
        );
        if (response.data.success) {
          // Update row data in AG Grid
          setRowData(
            rowData.map(category =>
              category.id === editId
                ? { ...category, categoryName: newCategory.categoryName }
                : category,
            ),
          );
          showAlert('success', 'Category updated successfully');
        } else {
          showAlert('danger', response.data.msg || 'Error updating category');
        }
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/category/categories',
          newCategory,
        );
        if (response.data.success) {
          // Add new category to row data in AG Grid
          setRowData([
            ...rowData,
            {
              id: rowData.length + 1, // Increment the internal ID
              categoryId: response.data.category.id,
              categoryName: newCategory.categoryName,
            },
          ]);
          showAlert('success', 'Category added successfully');
        } else {
          showAlert('danger', response.data.msg || 'Error creating category');
        }
      }
    } catch (err) {
      console.error('Error handling category:', err);
      showAlert('danger', 'Error handling category');
    }

    // Reset form and state
    setShowModal(false);
    setNewCategory({ categoryName: '' });
    setEditMode(false);
    setEditId(null);
  };

  const handleDelete = async () => {
    if (editId !== null) {
      try {
        const categoryIdToDelete = rowData.find(category => category.id === editId)?.categoryId;
        if (categoryIdToDelete !== undefined) {
          const response = await axios.delete(
            `http://localhost:5000/api/category/categories/${categoryIdToDelete}`,
          );
          if (response.data.success) {
            // Remove category from row data in AG Grid and reorder
            const updatedRowData = rowData
              .filter(category => category.id !== editId)
              .map((category, index) => ({
                ...category,
                id: index + 1, // Reorder IDs
              }));
            setRowData(updatedRowData);
            showAlert('success', 'Category deleted successfully');
          } else {
            showAlert('danger', response.data.msg);
          }
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        showAlert('danger', 'Error deleting category');
      }
    }
    setShowModal(false);
    setDeleteMode(false);
    setEditId(null);
  };

  const handleEdit = (id: number) => {
    const categoryToEdit = rowData.find(category => category.id === id);
    if (categoryToEdit) {
      setNewCategory({ categoryName: categoryToEdit.categoryName });
      setEditId(id);
      setEditMode(true);
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

  const ActionCellRenderer: React.FC<{ data: CategoryData }> = ({ data }) => (
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

  const columnDefs: ColDef<CategoryData>[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    { headerName: 'Category ID', field: 'categoryId', sortable: true, filter: true, width: 150 },
    {
      headerName: 'Category Name',
      field: 'categoryName',
      sortable: true,
      filter: true,
      width: 350,
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRenderer,
      width: 200,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Category</h2>
        <Button
          variant="primary"
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
          }}
        >
          Create Category
        </Button>
      </div>
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}
      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
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
            {editMode ? 'Edit Category' : deleteMode ? 'Delete Category' : 'Create Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!deleteMode && (
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory.categoryName}
                  onChange={e => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
          {deleteMode && <p>Are you sure you want to delete this category?</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {!deleteMode && (
            <Button variant="primary" onClick={handleCreateOrEditCategory}>
              {editMode ? 'Save Changes' : 'Create Category'}
            </Button>
          )}
          {deleteMode && (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;
