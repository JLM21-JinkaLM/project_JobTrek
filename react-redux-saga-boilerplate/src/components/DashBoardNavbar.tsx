import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface NavbarProps {
  handleLogOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogOut }) => {
  const handleUserRole = (): void => {
    window.localStorage.removeItem('user_role');
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between">
        <Link to="/" className="navbar-brand ms-2">
          <span style={{ fontSize: '2rem' }}>Job_Trek</span>
        </Link>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-admin">
            Admin
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                handleLogOut();
                handleUserRole();
              }}
            >
              Logout
            </Dropdown.Item>
            {/* <Dropdown.Item as={Link} to="/profile">
              Profile
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
