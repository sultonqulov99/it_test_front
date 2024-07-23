import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AppLayoutContext } from '../../Layouts/AppLayout'

export default function Contact() {
  const [fullName, setFullName] = useState("")
  const [contact, setContact] = useState("")
  const [text, setText] = useState("")
  const { API } = useContext(AppLayoutContext);
  const data = JSON.parse(window.localStorage.getItem("data"));
  const u_id =data && data._id;

  function clickContact(e){
    e.preventDefault()
    axios.post(`${API}/api/contact`,{
      "fullName":fullName,
      "text":text,
      "contact":"+" + contact,
      "user_id":u_id
    }).then(res => {
      setFullName("")
      setContact("")
      setText("")
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <div class="contact py-5">
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-4 mb-3">
                    <div class="contact-item">
                      <img src="./img/phone icon.svg" alt="Call icon" />
                      <h4 class="contact-title">Telefon</h4>
                      <a href="tel:998994768495" class="contact-link">(998) 99 476 84 95</a>
                    </div>
                </div>
                <div class="col-12 col-lg-4 mb-3">
                    <div class="contact-item">
                      <img src="./img/mail icon.svg" alt="Email icon" />
                      <h4 class="contact-title">Elektron pochta</h4>
                      <a href="mailto:doniyorjonibekov1995@gmail.com" class="contact-link">doniyorjonibekov1995@gmail.com</a>
                    </div>
                </div>
                <div class="col-12 col-lg-4 mb-3">
                    <div class="contact-item">
                      <img src="./img/location icon.svg" alt="Location icon" />
                      <h4 class="contact-title">Manzil</h4>
                      <a href="" class="contact-link">Guliston sh,IT LIVE ACADEMY</a>
                    </div>
                </div>
            </div>
            <div class="row my-3">  
                <div class="col-12">
                  <div class="contact-form d-flex justify-content-center">
                    <div class="col-10 col-lg-6">
                      <h2 class="contact-headline text-center my-3">Savollaringiz bo’lsa murojaat qiling</h2>
                      <form action="#!" method="POST">
                        <div class="mb-3">
                          <label for="name" class="form-label">F.I.O</label>
                          <input onChange={e => setFullName(e.target.value)} type="text" value={fullName} class="form-control" id="name" placeholder="Kiriting" />
                        </div>
                        <div class="mb-3">
                          <label for="phone" class="form-label">Telefon raqamingiz</label>
                          <input onChange={e => setContact(e.target.value)} type="number" value={contact} class="form-control" id="phone" placeholder="+998" />
                        </div>
                        <div class="mb-3">
                          <label for="message" class="form-label">Xabar</label>
                          <textarea onChange={e => setText(e.target.value)} value={text} class="form-control" id="message" rows="4"></textarea>
                        </div>
                        <div class="mb-3">
                      
                         <button onClick={clickContact} type="submit" class="btn btn-primary">Yuborish</button>
                        </div>
                      </form>
                    </div>
                </div>
             </div>
            </div>
        </div>
    </div>
  )
}
