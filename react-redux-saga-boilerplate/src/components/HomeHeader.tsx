import { useState } from 'react';
import styled from '@emotion/styled';
import { Container, responsive } from '@gilbarbara/components';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { appColor, headerHeight } from '~/modules/theme';

import Logo from '~/components/Logo';

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

const NavbarList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  height: 100%;
  padding: 0;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  text-align: center;

  li {
    margin: 0 15px;
  }

  a {
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    padding: 10px;

    ${responsive({ lg: { fontSize: '16px' } })};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const MobileNav = styled(Navbar)`
  .navbar-toggler {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 0.5%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  }

  .navbar-collapse {
    background-color: #113740;
  }
`;

export default function HomeHeader() {
  const [expanded, setExpanded] = useState(false);

  return (
    <HeaderWrapper data-component-name="Header">
      <Container direction="row" justify="space-between" padding="md">
        <Logo />
        <MobileNav expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavbarList>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/Page">Page</a>
                </li>
                <li>
                  <a href="/register">Register</a>
                </li>
                <li>
                  <a href="/login">Log In</a>
                </li>
              </NavbarList>
            </Nav>
          </Navbar.Collapse>
        </MobileNav>
      </Container>
    </HeaderWrapper>
  );
}
