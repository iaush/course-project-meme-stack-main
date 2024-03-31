import React, { useContext } from 'react';
import jwt_decode from 'jwt-decode';
import useUserStore from '../stores/userStore'

import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  let location = useLocation();
  const { token } = useUserStore(store => ({
    token: store.token,
  }));

  function hasJWT() {
    var decodedToken;

    if (token !== null) {
      decodedToken = jwt_decode(token);
    } else {
      return false;
    }

    const dateNow = new Date();
    if (decodedToken.exp > dateNow.getTime() / 1000) {
      return true;
    }
  }

  if (!hasJWT()) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;
