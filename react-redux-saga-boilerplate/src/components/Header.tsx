import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { Container } from '@gilbarbara/components';

import { appColor, headerHeight } from '~/modules/theme';

import { loginSuccess, logOut } from '~/actions';

import Logo from '~/components/Logo';
import { useNavigate } from 'react-router-dom';

import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const HeaderWrapper = styled.header`
  background-color: #113740;
  height: ${headerHeight}px;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 200;

  &:before {
    background-color: ${appColor};
    bottom: 0;
    content: '';
    height: 2px;
    left: 0;
    position: absolute;
    right: 0;
  }
`;

interface Props {
  role: string;
  name: string;
}

const Header: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClickLogout = () => {
    dispatch(logOut());
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <HeaderWrapper data-component-name="Header">
      {dispatch(loginSuccess()) && (
        <Container direction="row" justify="space-between" padding="md">
          <Logo />
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-admin">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.3rem' }} />
              <span className="p-3" style={{ fontSize: '1.3rem' }}>
                {' '}
                {props.name}
              </span>{' '}
              {/* User profile icon */}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  handleClickLogout();
                }}
              >
                Logout
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/user/profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/appliedjobs">
                Appiled Jobs
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      )}
    </HeaderWrapper>
  );
};

export default Header;
