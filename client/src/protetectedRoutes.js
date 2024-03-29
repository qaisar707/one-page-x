import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({Component }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    return token ? <Component/> : navigate('/Login')
  }, []);

}

export default ProtectedRoute;