import React, { useState } from 'react'
import ImgQuestion from './ImgQuestion'
import TestQuestion from './TestQuestion'
import {FaLockOpen } from "react-icons/fa6";
import { Outlet } from 'react-router-dom';

export default function Question() {
    const [daraja, setDaraja] = useState( window.localStorage.getItem("questionLevel") || 1)
  return (
    <div class="question py-4">
        <div class="container">
            <div class="row justify-content-sm-start justify-content-lg-center ">
                <div class="col-12 col-md-12 col-lg-10 mb-3">
                    <Outlet />
                </div>
                <div class="col-6  col-md-4 col-lg-2 mb-3 ">
                   <div class="level d-flex justify-content-between">
                       <div class="level-desc">
                        <h4 class="level-title">{daraja}</h4>
                        <span class="level-text">daraja</span> <br/>
                        <span class="test-more">Savol {daraja*2} ta</span>
                       </div>
                       <FaLockOpen />
                   </div>
                </div>
               
            </div>
        </div>
    </div>
  )
}
