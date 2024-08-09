import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
}

const DashBoardSideBar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const [manageJobOpen, setManageJobOpen] = useState(false);

  const toggleManageJob = () => {
    setManageJobOpen(!manageJobOpen);
  };

  return (
    <nav
      className={`bg-light sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{
        width: sidebarOpen ? '250px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        height: '100vh',
      }}
    >
      <div className="sidebar-sticky m-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" to="#">
              <span style={{ fontSize: '2rem' }}>
                {' '}
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </span>
              <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Accordion>
              <Card
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                }}
              >
                <Accordion.Header
                  onClick={toggleManageJob}
                  className="nav-link bg-light"
                  style={{
                    cursor: 'pointer',
                    color: 'black',
                    border: 'none',
                  }}
                >
                  <i className="fas fa-briefcase"></i>{' '}
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '1.5rem',
                      color: '#2a52be',
                    }}
                    className="bg-light"
                  >
                    Manage Job{' '}
                  </span>
                  <i
                    className={`fas ${manageJobOpen ? 'fa-caret-up' : 'fa-caret-down'} float-end`}
                  ></i>
                </Accordion.Header>
                <Accordion.Body
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                >
                  <ul className="nav flex-column pl-4">
                    {/* <li className="nav-item">
                      <Link className="nav-link" to="/dashboard/jobcreate">
                        Create Job
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard/viewjobs">
                        View Job
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard/location">
                        Location
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard/skills">
                        skills
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard/category">
                        Category
                      </Link>
                    </li>
                  </ul>
                </Accordion.Body>
              </Card>
            </Accordion>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard/applications">
              <i className="fas fa-users"></i> Applications
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashBoardSideBar;
