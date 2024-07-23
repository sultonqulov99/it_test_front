import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

export const AppLayoutContext = createContext();


export default function AppLayout() {
  const API = "http://localhost:8080"
  let data = window.localStorage.getItem("data");
  data = JSON.parse(data);
  const u_id = data ? data._id : null;
  const subjectName = window.localStorage.getItem("subjectName");
  const [isLogined, setIsLogined] = useState(window.localStorage.getItem('token') || false)
  const [key,setKey] = useState(0)
  const [ball,setBall] = useState(0)
  const [time,setTime] = useState(window.localStorage.getItem("time") || false)
  const navigate = useNavigate()

  useEffect( ()=> {
    if(!isLogined){
      navigate("/")
    }
    axios.get(
      `${API}/api/subject/${subjectName}`
    ).then(res => {
      console.log(res)
      axios.get(
        `${API}/api/users/keyBall/userSubject_id`,
        {
          params: { id: u_id, subject_id: res.data.data._id },
        }
      ).then(res => {
        setBall(res.data.data.ball);
        setKey(res.data.data.key);
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
    })
  },[])
  return (
    <AppLayoutContext.Provider value={{ isLogined, setIsLogined, key,setKey,ball,setBall,time,setTime, API }} className="site-header-hero">
      <Header/>
        <div style={{ minHeight:'430px', background:'#f7f7f8' }}>
          <Outlet />
        </div>
      <Footer />
    </AppLayoutContext.Provider>
  )
}
