import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {

  const [data, setData] = useState(null);
  const {setUser} = useAuthStore();
  const getData = async () => {
    try {
      const res = await axiosInstance.get('/check');
      setData(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    <div>
      {
        data && <>
          <h2>Full Name : {data.fullname}</h2>
          <h2>Email : {data.email}</h2>
          <h2>Id : {data._id}</h2>
          <h2>Account Created At : {data.createdAt.split('T')[0]}</h2>
        </>
      }
    </div>
  )
}

export default Home