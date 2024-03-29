import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, reset } from "../features/auth/authSlice";
function HeaderComponent() {
  const { user } = useSelector((state) => state.auth);

  const handleLogoutClick = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/Login");
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <header className="header">
        <>
          <div className="logo">
            <Link to="/">One Place Post</Link>
          </div>
      {user ? (
          <ul>
            <li>
              <button className="btn" onClick={handleLogoutClick}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>

      ) : (

          <ul>
            <li>
              <Link to="/Login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </ul>

      )}
      </>
    </header>
  );
}

export default HeaderComponent;
