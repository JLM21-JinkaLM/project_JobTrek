import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Box, Button, Container, Icon, responsive, Text } from '@gilbarbara/components';

import { name } from '~/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import theme from '~/modules/theme';

import { logOutSuccess, login, loginSuccess } from '~/actions';
import { STATUS } from '~/literals';

import Background from '~/components/Background';
import Logo from '~/components/Logo';

import { RootState } from '~/types';
import HomeHeader from '~/components/HomeHeader';
import HomeContainer from '~/components/HomeContainer';
import Header from '~/components/Header';

// const Header = styled.div`
//   margin-bottom: ${theme.spacing.lg};
//   text-align: center;

//   svg {
//     height: 100px;
//     width: auto;

//     ${responsive({
//       lg: {
//         height: '180px',
//       },
//     })};
//   }
// `;

const Heading = styled.h1`
  color: #fff;
  font-size: 35px;
  line-height: 1.4;
  margin-bottom: ${theme.spacing.lg};
  margin-top: 0;
  text-align: center;

  ${responsive({
    lg: {
      fontSize: '40px',
    },
  })};
`;

function Home() {
  // const dispatch = useDispatch();
  const status = useSelector<RootState>(({ user }) => user.status);

  return (
    <div className="container-fluid">
      <HomeContainer login={false} />
    </div>
  );
}

export default Home;
