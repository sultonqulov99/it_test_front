import axios from 'axios';
import React, { useState, useContext, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
import { AppLayoutContext } from '../../Layouts/AppLayout';

const LoginModal = () => {
  const { API } = useContext(AppLayoutContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null); // Reference to the modal

  const { setIsLogined } = useContext(AppLayoutContext);

  useEffect(() => {
    const modalElement = modalRef.current;
    const handleBackdropRemoval = () => {
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', handleBackdropRemoval);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('hidden.bs.modal', handleBackdropRemoval);
      }
    };
  }, []);

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
        if (modalRef.current) {
          const modalElement = modalRef.current;
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();
        }
      }
    } catch (error) {
      setIsError("Parol yoki Telefon raqam xato")
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
        ref={modalRef}
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
              {
                isError ? <span style={{"color":"red"}}>{isError}</span> : null
              }
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
