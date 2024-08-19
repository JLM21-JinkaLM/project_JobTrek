import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import axios from 'axios';

interface SkillData {
  id: number;
  skillId: number;
  skillName: string;
  categoryName: string;
  categoryId: number;
}

const ActionCellRenderer: React.FC<ICellRendererParams> = props => {
  const handleEdit = () => props.context.onConfirm('edit', props.data);
  const handleDelete = () => props.context.onConfirm('delete', props.data);

  return (
    <>
      <Button variant="warning" size="sm" onClick={handleEdit} className="mr-2">
        Edit
      </Button>
      <Button variant="danger" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
};

const Skills: React.FC = () => {
  const [rowData, setRowData] = useState<SkillData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: '', categoryId: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [confirmMode, setConfirmMode] = useState<'edit' | 'delete' | null>(null);
  const [confirmSkill, setConfirmSkill] = useState<SkillData | null>(null);

  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/skills/skills');
        if (response.data.success) {
          setRowData(
            response.data.skills.map((skill: any, index: number) => ({
              id: index + 1,
              skillId: skill.id,
              skillName: skill.skillName,
              categoryName: skill.category.categoryName,
              categoryId: skill.category.id,
            })),
          );
        } else {
          showAlert('danger', response.data.msg);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        showAlert('danger', 'Error fetching skills');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/category/categories');
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          showAlert('danger', response.data.msg);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        showAlert('danger', 'Error fetching categories');
      }
    };

    fetchSkills();
    fetchCategories();
  }, []);

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCreateOrEditSkill = async () => {
    setAlert(null);
    try {
      if (editMode && editId !== null) {
        const response = await axios.put(
          `http://localhost:5000/api/skills/skills/${rowData.find(skill => skill.id === editId)?.skillId}`,
          newSkill,
        );
        if (response.data.success) {
          setRowData(
            rowData.map(skill =>
              skill.id === editId
                ? {
                    ...skill,
                    skillName: newSkill.skillName,
                    categoryId: parseInt(newSkill.categoryId, 10),
                    categoryName:
                      categories.find(
                        (category: any) => category.id === parseInt(newSkill.categoryId, 10),
                      )?.categoryName || '',
                  }
                : skill,
            ),
          );
          showAlert('success', 'Skill updated successfully');
        } else {
          showAlert('danger', response.data.msg || 'Error updating skill');
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/skills/skills', newSkill);
        if (response.data.success) {
          setRowData([
            ...rowData,
            {
              id: rowData.length + 1,
              skillId: response.data.skill.id,
              skillName: newSkill.skillName,
              categoryId: parseInt(newSkill.categoryId, 10),
              categoryName:
                categories.find(
                  (category: any) => category.id === parseInt(newSkill.categoryId, 10),
                )?.categoryName || '',
            },
          ]);
          showAlert('success', 'Skill added successfully');
        } else {
          showAlert('danger', response.data.msg || 'Error creating skill');
        }
      }
    } catch (err) {
      console.error('Error handling skill:', err);
      showAlert('danger', 'Error handling skill');
    } finally {
      setShowModal(false);
      setEditMode(false);
      setDeleteMode(false);
      setEditId(null);
      setConfirmMode(null);
      setConfirmSkill(null);
    }
  };

  const handleDelete = async () => {
    if (confirmSkill?.skillId === undefined) return; // Check if confirmSkill and skillId exist
    setAlert(null);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/skills/skills/${confirmSkill.skillId}`,
      );
      if (response.data.success) {
        setRowData(rowData.filter(skill => skill.skillId !== confirmSkill.skillId));
        showAlert('success', 'Skill deleted successfully');
      } else {
        showAlert('danger', response.data.msg || 'Error deleting skill');
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
      showAlert('danger', 'Error deleting skill');
    } finally {
      setShowModal(false);
      setEditMode(false);
      setDeleteMode(false);
      setEditId(null);
      setConfirmMode(null);
      setConfirmSkill(null);
    }
  };

  const handleOpenModal = (skill?: SkillData, deleteMode: boolean = false) => {
    setShowModal(true);
    setDeleteMode(deleteMode);
    if (skill) {
      setEditMode(true);
      setEditId(skill.id);
      setNewSkill({ skillName: skill.skillName, categoryId: skill.categoryId.toString() });
    } else {
      setEditMode(false);
      setNewSkill({ skillName: '', categoryId: '' });
    }
  };

  const handleConfirm = async () => {
    if (confirmMode === 'edit') {
      setEditId(confirmSkill?.id || null);
      setShowModal(true);
      setEditMode(true);
      setNewSkill({
        skillName: confirmSkill?.skillName || '',
        categoryId: confirmSkill?.categoryId.toString() || '',
      });
    } else if (confirmMode === 'delete') {
      await handleDelete();
    }
    setConfirmMode(null);
    setConfirmSkill(null);
  };

  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true },
    { headerName: 'Skill Name', field: 'skillName', sortable: true },
    { headerName: 'Category', field: 'categoryName', sortable: true },
    {
      headerName: 'Actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Skills Management</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Create Skill
        </Button>
      </div>

      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%', overflow: 'auto' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          components={{ actionCellRenderer: ActionCellRenderer }}
          domLayout="autoHeight"
          suppressPaginationPanel={true}
          context={{
            onConfirm: (mode: 'edit' | 'delete', skill: SkillData) => {
              setConfirmMode(mode);
              setConfirmSkill(skill);
            },
          }}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Skill' : 'Create Skill'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="skillName">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter skill name"
                value={newSkill.skillName}
                onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="categoryId">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={newSkill.categoryId}
                onChange={e => setNewSkill({ ...newSkill, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateOrEditSkill} disabled={deleteMode}>
            {editMode ? 'Save Changes' : 'Create Skill'}
          </Button>
          {deleteMode && (
            <Button variant="danger" onClick={handleConfirm}>
              Confirm Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Skills;

// import React, { useState, useEffect, useRef } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { Modal, Button, Form, Alert } from 'react-bootstrap';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ColDef, ICellRendererParams } from 'ag-grid-community';
// import axios from 'axios';

// interface SkillData {
//   id: number;
//   skillId: number;
//   skillName: string;
//   categoryName: string;
//   categoryId: number;
// }

// const ActionCellRenderer: React.FC<ICellRendererParams> = props => {
//   const handleEdit = () => props.context.onConfirm('edit', props.data);
//   const handleDelete = () => props.context.onConfirm('delete', props.data);

//   return (
//     <>
//       <Button variant="warning" size="sm" onClick={handleEdit} className="mr-2">
//         Edit
//       </Button>
//       <Button variant="danger" size="sm" onClick={handleDelete}>
//         Delete
//       </Button>
//     </>
//   );
// };

// const Skills: React.FC = () => {
//   const [rowData, setRowData] = useState<SkillData[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newSkill, setNewSkill] = useState({ skillName: '', categoryId: '' });
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [deleteMode, setDeleteMode] = useState(false);
//   const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [confirmMode, setConfirmMode] = useState<'edit' | 'delete' | null>(null);
//   const [confirmSkill, setConfirmSkill] = useState<SkillData | null>(null);

//   const gridRef = useRef<AgGridReact>(null);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/skills/skills');
//         if (response.data.success) {
//           setRowData(
//             response.data.skills.map((skill: any, index: number) => ({
//               id: index + 1,
//               skillId: skill.id,
//               skillName: skill.skillName,
//               categoryName: skill.category.categoryName,
//               categoryId: skill.category.id,
//             })),
//           );
//         } else {
//           showAlert('danger', response.data.msg);
//         }
//       } catch (err) {
//         console.error('Error fetching skills:', err);
//         showAlert('danger', 'Error fetching skills');
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/category/categories');
//         if (response.data.success) {
//           setCategories(response.data.categories);
//         } else {
//           showAlert('danger', response.data.msg);
//         }
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//         showAlert('danger', 'Error fetching categories');
//       }
//     };

//     fetchSkills();
//     fetchCategories();
//   }, []);

//   const showAlert = (type: 'success' | 'danger', message: string) => {
//     setAlert({ type, message });
//     setTimeout(() => setAlert(null), 3000);
//   };

//   const handleCreateOrEditSkill = async () => {
//     setAlert(null);
//     try {
//       if (editMode && editId !== null) {
//         const response = await axios.put(
//           `http://localhost:5000/api/skills/skills/${rowData.find(skill => skill.id === editId)?.skillId}`,
//           newSkill,
//         );
//         if (response.data.success) {
//           setRowData(
//             rowData.map(skill =>
//               skill.id === editId
//                 ? {
//                     ...skill,
//                     skillName: newSkill.skillName,
//                     categoryId: parseInt(newSkill.categoryId, 10),
//                     categoryName:
//                       categories.find(
//                         (category: any) => category.id === parseInt(newSkill.categoryId, 10),
//                       )?.categoryName || '',
//                   }
//                 : skill,
//             ),
//           );
//           showAlert('success', 'Skill updated successfully');
//         } else {
//           showAlert('danger', response.data.msg || 'Error updating skill');
//         }
//       } else {
//         const response = await axios.post('http://localhost:5000/api/skills/skills', newSkill);
//         if (response.data.success) {
//           setRowData([
//             ...rowData,
//             {
//               id: rowData.length + 1,
//               skillId: response.data.skill.id,
//               skillName: newSkill.skillName,
//               categoryId: parseInt(newSkill.categoryId, 10),
//               categoryName:
//                 categories.find(
//                   (category: any) => category.id === parseInt(newSkill.categoryId, 10),
//                 )?.categoryName || '',
//             },
//           ]);
//           showAlert('success', 'Skill added successfully');
//         } else {
//           showAlert('danger', response.data.msg || 'Error creating skill');
//         }
//       }
//     } catch (err) {
//       console.error('Error handling skill:', err);
//       showAlert('danger', 'Error handling skill');
//     } finally {
//       setShowModal(false);
//       setEditMode(false);
//       setDeleteMode(false);
//       setEditId(null);
//       setConfirmMode(null);
//       setConfirmSkill(null);
//     }
//   };

//   const handleDelete = async () => {
//     if (confirmSkill?.skillId === undefined) return; // Check if confirmSkill and skillId exist
//     setAlert(null);
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/skills/skills/${confirmSkill.skillId}`,
//       );
//       if (response.data.success) {
//         setRowData(rowData.filter(skill => skill.skillId !== confirmSkill.skillId));
//         showAlert('success', 'Skill deleted successfully');
//       } else {
//         showAlert('danger', response.data.msg || 'Error deleting skill');
//       }
//     } catch (err) {
//       console.error('Error deleting skill:', err);
//       showAlert('danger', 'Error deleting skill');
//     } finally {
//       setShowModal(false);
//       setEditMode(false);
//       setDeleteMode(false);
//       setEditId(null);
//       setConfirmMode(null);
//       setConfirmSkill(null);
//     }
//   };

//   const handleOpenModal = (skill?: SkillData, deleteMode: boolean = false) => {
//     setShowModal(true);
//     setDeleteMode(deleteMode);
//     if (skill) {
//       setEditMode(true);
//       setEditId(skill.id);
//       setNewSkill({ skillName: skill.skillName, categoryId: skill.categoryId.toString() });
//     } else {
//       setEditMode(false);
//       setNewSkill({ skillName: '', categoryId: '' });
//     }
//   };

//   const handleConfirm = async () => {
//     if (confirmMode === 'edit') {
//       setEditId(confirmSkill?.id || null);
//       setShowModal(true);
//       setEditMode(true);
//       setNewSkill({
//         skillName: confirmSkill?.skillName || '',
//         categoryId: confirmSkill?.categoryId.toString() || '',
//       });
//     } else if (confirmMode === 'delete') {
//       await handleDelete();
//     }
//     setConfirmMode(null);
//     setConfirmSkill(null);
//   };

//   const columnDefs: ColDef[] = [
//     { headerName: 'ID', field: 'id', sortable: true },
//     { headerName: 'Skill Name', field: 'skillName', sortable: true },
//     { headerName: 'Category', field: 'categoryName', sortable: true },
//     {
//       headerName: 'Actions',
//       cellRenderer: 'actionCellRenderer',
//     },
//   ];

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center">
//         <h2>Skills Management</h2>
//         <Button variant="primary" onClick={() => handleOpenModal()}>
//           Create Skill
//         </Button>
//       </div>

//       {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

//       <div className="ag-theme-alpine mt-3" style={{ height: 400, width: '100%' }}>
//         <AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={columnDefs}
//           components={{ actionCellRenderer: ActionCellRenderer }}
//           domLayout="autoHeight"
//           suppressPaginationPanel={true}
//           context={{
//             onConfirm: (mode: 'edit' | 'delete', skill: SkillData) => {
//               setConfirmMode(mode);
//               setConfirmSkill(skill);
//             },
//           }}
//         />
//       </div>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{editMode ? 'Edit Skill' : 'Create Skill'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="skillName">
//               <Form.Label>Skill Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newSkill.skillName}
//                 onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
//               />
//             </Form.Group>

//             <Form.Group controlId="categoryId">
//               <Form.Label>Category</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={newSkill.categoryId}
//                 onChange={e => setNewSkill({ ...newSkill, categoryId: e.target.value })}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category: any) => (
//                   <option key={category.id} value={category.id}>
//                     {category.categoryName}
//                   </option>
//                 ))}
//               </Form.Control>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleCreateOrEditSkill}>
//             {editMode ? 'Save Changes' : 'Create Skill'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={!!confirmMode} onHide={() => setConfirmMode(null)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm {confirmMode === 'delete' ? 'Delete' : 'Edit'} Skill</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to {confirmMode === 'delete' ? 'delete' : 'edit'} this skill?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setConfirmMode(null)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleConfirm}>
//             Yes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Skills;
