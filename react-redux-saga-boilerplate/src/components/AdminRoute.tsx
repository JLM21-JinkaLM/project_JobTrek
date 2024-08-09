// import React, { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';

// const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const role = window.localStorage.getItem('user_role');

//   console.log(role, 'lllll');
//   if (role === 'admin' && role !== null && role !== undefined) {
//     return <>{children}</>;
//   } else {
//     // window.localStorage.clear();
//     return (
//       <>
//         <Navigate to="/login" />
//       </>
//     );
//   }
// };

// export default AdminRoute;
