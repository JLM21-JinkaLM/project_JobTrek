import React from 'react';
import { Navigate } from 'react-router-dom';
import HomeContainer from '~/components/HomeContainer';

interface PrivateProps {
  user: object;
  login: boolean;
  user_role: string;
}

const Private: React.FC<PrivateProps> = ({ user, login, user_role }) => {
  console.log(user_role, 'jinkalmmaneesha');

  if (user_role !== 'admin') {
    return (
      <div>
        <HomeContainer userDetails={user} login={login} />
      </div>
    );
  } else {
    return <Navigate to="/dashboard" />;
  }
};

export default Private;
