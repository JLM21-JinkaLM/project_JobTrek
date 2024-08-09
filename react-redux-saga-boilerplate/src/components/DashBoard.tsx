import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './DashBoardNavbar';
import DashBoardSideBar from './DashBoardSideBar';
import { useDispatch } from 'react-redux';
import { logOut } from '~/actions';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DashBoardCards from './DashBoardCards';

interface Props {
  role: string;
}

const DashBoard: React.FC<Props> = props => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log(props.role, 'dddddddddddddd');
  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return props.role === 'admin' ? (
    <div className="dashboard-container" style={{ marginTop: '-6%' }}>
      <Navbar handleLogOut={handleLogOut} />
      <div className="d-flex">
        <DashBoardSideBar sidebarOpen={sidebarOpen} />
        <div
          className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          style={{
            transition: 'width 0.3s ease',
            width: sidebarOpen ? 'calc(100% - 250px)' : '100%',
            marginTop: '10px',
          }}
        >
          <div
            className="content-wrapper"
            style={{
              padding: sidebarOpen ? '10px' : '20px',
              transition: 'padding 0.3s ease',
              paddingTop: 0,
            }}
          >
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <h1 className="h2 d-flex align-items-center">
                <Button
                  variant="dark"
                  onClick={toggleSidebar}
                  className="toggle-btn"
                  style={{ margin: '0 10px' }}
                >
                  <FontAwesomeIcon icon={sidebarOpen ? faArrowLeft : faArrowRight} />
                </Button>
                <span>Dashboard</span>
              </h1>
            </div>

            <DashBoardCards />

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/private" />
  );
};

export default DashBoard;
