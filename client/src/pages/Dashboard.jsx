import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {  reset } from "../features/posts/post-slice.js";
import PostForm from "../components/post-form.jsx";
import Spinner from "../components/Spinner";
import { TiTickOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { allowedPlatforms } from '../utils/constants';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
function Dashboard() {

  const { user } = useSelector((state) => state.auth);
  
  const { isLoading, isError, isSuccess,message } = useSelector(
    (state) => state.posts
    );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOauthLogin = async (platform) => {

    try {
      const {token} = user
      
      const headers= {
        authorization: `Bearer ${token}`,
      }
      
      const { data } = await axios.get(`https://localhost:8000/${platform}/oauth`,{headers});
      if (data) {
        const { url } = data;
        window.location.href = url;

      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const platform = searchParams.get('platform');

    if (success === 'true' && platform) {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      if (!user?.access_tokens.includes(platform)) {
        user.access_tokens = [...user?.access_tokens, platform];
        localStorage.setItem('user', JSON.stringify(user));
      }

      window.location.href = 'http://localhost:3000';
    }
  }, [location.search]);


  useEffect(() => {
    if (isError) {
      toast.error(message);
      (reset());
    }
    if (!user) {
      navigate("/login");
    } 
    if (isSuccess) {
      toast.success(message)
      dispatch(reset());
    }
    
  }, [user, isSuccess,isError]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome - {user ? user?.name?.toUpperCase() : "Guest"}</h1>
        {
          allowedPlatforms.map((item, index) => (
            !user?.access_tokens.includes(item.name.toLowerCase())&& <button className="btn  btn-block" key={index} type="submit" onClick={() => handleOauthLogin(item.name.toLowerCase())} >
            Login with -  {item.name}
            </button>
          ))
        }
      </section>
      <PostForm />
      <section className="content">
        <div style={{ display: "flex", flexDirection: 'row', justifyContent:'space-evenly' }}>
        {user?.access_tokens.length>0 ? user?.access_tokens.map((item,i) => (
          
          <button type="submit" className="btn" key={i}>
            <TiTickOutline />
            {item}
          </button>
        )):
        <h1>You Don't Have Any Social Media Integrated yet</h1>
      }
      </div>
      </section>
    </>
  );
}

export default Dashboard;
