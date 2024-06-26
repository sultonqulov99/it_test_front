import axios from 'axios';
import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
import { AppLayoutContext } from '../../Layouts/AppLayout';

const LoginModal = () => {
  const API = "http://localhost:8080";
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const navigate = useNavigate();

  const { setIsLogined } = useContext(AppLayoutContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API}/api/login`, {
        contact: phoneNumber,
        password: password
      });
      if (response.data.status === 201) {
        setCloseModal(true);
        window.localStorage.setItem("data", JSON.stringify(response.data.massage));
        window.localStorage.setItem("token", response.data.token);
        setIsLogined(true);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Kirish</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="mb-2">
                  <label htmlFor="phoneNumber" className="form-label">Telefon raqam</label>
                  <input
                    type="number"
                    className="form-control"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="telefon raqam..."
                  />
                </div>
                <div className="mb-2 input-password">
                  <label htmlFor="password" className="form-label">Parol</label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="parol..."
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss={closeModal ? "modal" : ""}
                onClick={handleLogin}
              >
                Kirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
