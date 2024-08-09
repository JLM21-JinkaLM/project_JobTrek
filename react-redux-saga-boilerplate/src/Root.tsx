import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { px } from '@gilbarbara/components';
import useTreeChanges from 'tree-changes-hook';

import { name } from '~/config';

import { useAppSelector } from '~/modules/hooks';
import theme, { headerHeight } from '~/modules/theme';

import { alertShow } from '~/actions';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import PrivateRoute from '~/components/PrivateRoute';
import PublicRoute from '~/components/PublicRoute';
import SystemAlerts from '~/containers/SystemAlerts';

import Home from '~/routes/Home';
import NotFound from '~/routes/NotFound';
import Private from '~/routes/Private';

import { selectUser } from '~/selectors';
import { UserState } from '~/types';
import Register from '~/components/Register';
import LoginPage from '~/components/LoginPage';
import DashBoard from './components/DashBoard';
import { ToastContainer } from 'react-toastify';
import ViewJob from './components/ViewJob';
import EditJob from './components/EditJob';
import HomeHeader from './components/HomeHeader';
import ParticularJobView from './components/ParticularJobView';
import AppliedJobs from './components/AppliedJobs';
import Applications from './components/Applications';
import AppliedJobUserList from './components/AppliedJobUserList';
import Profile from './components/Profile';
import ParticularUserJobList from './components/ParticularUserJobList';
import Location from './components/Location';
import Skills from './components/Skills';
import Category from './components/Category';
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  opacity: 1 !important;
  position: relative;
  transition: opacity 0.5s;
`;

const Main = styled.main<Pick<UserState, 'isAuthenticated'>>`
  min-height: 100vh;
  padding: ${({ isAuthenticated }) => (isAuthenticated ? `${px(headerHeight)} 0 0` : 0)};
`;

// Utility function to check if the current path matches any of the specified paths
const isExcludedRoute = (path: string): boolean => {
  const excludedPaths = ['/login', '/register'];
  return excludedPaths.some(excludedPath => path.startsWith(excludedPath));
};

function AppContent() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { changed } = useTreeChanges(user);
  const { isAuthenticated } = user;
  const location = useLocation();

  console.log(user.role, 'rolllllllllll');

  useEffect(() => {
    if (changed('isAuthenticated', true)) {
      dispatch(alertShow('Hello! And welcome!', { type: 'success', icon: 'bell', timeout: 10 }));
    }
  }, [dispatch, changed]);

  const excludeHeaderFooter = isExcludedRoute(location.pathname);

  return (
    <AppWrapper data-component-name="app">
      <Helmet
        defaultTitle={name}
        defer={false}
        encodeSpecialCharacters
        htmlAttributes={{ lang: 'pt-br' }}
        titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
        titleTemplate={`%s | ${name}`}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      {!excludeHeaderFooter && isAuthenticated && !location.pathname.startsWith('/dashboard') && (
        <Header name={user.role.username} />
      )}
      {!excludeHeaderFooter && !isAuthenticated && !location.pathname.startsWith('/dashboard') && (
        <HomeHeader />
      )}
      <Main isAuthenticated={isAuthenticated}>
        <Routes>
          <Route
            element={
              <PublicRoute isAuthenticated={isAuthenticated} to="/private">
                <Home />
              </PublicRoute>
            }
            path="/"
          />

          <Route
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} to="/">
                <Private user={user.role} login={true} user_role={user.role.user_role} />
              </PrivateRoute>
            }
            path="/private"
          />

          <Route
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} to="/">
                <Profile role={user.role} />
              </PrivateRoute>
            }
            path="user/profile"
          />

          <Route
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} to="/">
                <AppliedJobs userId={user.role.id} user_role={user.role.user_role} />
              </PrivateRoute>
            }
            path="/appliedjobs"
          />

          <Route
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} to="/">
                <ParticularJobView userId={user.role.id} user_role={user.role.user_role} />
              </PrivateRoute>
            }
            path="/viewdetails/:id"
          />

          <Route element={<Register />} path="/register" />

          <Route
            element={
              <PublicRoute isAuthenticated={isAuthenticated} to="/dashboard">
                <LoginPage />
              </PublicRoute>
            }
            path="/login"
          />

          <Route
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} to="/login">
                <DashBoard role={user.role.user_role} />
              </PrivateRoute>
            }
            path="/dashboard"
          >
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ViewJob />
                </PrivateRoute>
              }
              path="/dashboard/viewjobs"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Location />
                </PrivateRoute>
              }
              path="/dashboard/location"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Skills />
                </PrivateRoute>
              }
              path="/dashboard/skills"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Category />
                </PrivateRoute>
              }
              path="/dashboard/category"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <EditJob />
                </PrivateRoute>
              }
              path="/dashboard/editjob/:id"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Applications />
                </PrivateRoute>
              }
              path="/dashboard/applications"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <AppliedJobUserList />
                </PrivateRoute>
              }
              path="/dashboard/userlist/jobid/:id"
            />
            <Route
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ParticularUserJobList />
                </PrivateRoute>
              }
              path="/dashboard/user/joblist/:id"
            />
          </Route>

          <Route element={<NotFound />} path="*" />
        </Routes>
      </Main>
      {!excludeHeaderFooter && <Footer />}
      <SystemAlerts />
    </AppWrapper>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default Root;
