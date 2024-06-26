import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";

const RegisterModal = () => {
  let API = "http://localhost:8080";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [degree, setDegree] = useState("");
  const [status, setStatus] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate()

  const { setIsLogined } = useContext(AppLayoutContext)

  const modalRef = useRef(null); // Reference to the modal

  useEffect(() => {
    axios
      .get(`${API}/api/users/status/all`)
      .then((res) => {
        setStatus(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    const modalElement = modalRef.current;
    const handleBackdropRemoval = () => {
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
      }
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

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      return;
    }
    axios
      .post(`${API}/api/register`, {
        name: firstName,
        surname: lastName,
        status_id: degree,
        password: password,
        contact: "+" + phoneNumber,
      })
      .then((res) => {
        if (res.status === 201) {
          window.localStorage.setItem("data", JSON.stringify(res.data.data));
          window.localStorage.setItem("token", res.data.token);
          setIsLogined(true)
          // Close the modal
          if (modalRef.current) {
            const modalElement = modalRef.current;
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
          }
        }
        navigate("/")
      })
      .catch((error) => {
        setIsError(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <div
      className="modal fade"
      id="regModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={modalRef} // Assigning the ref to the modal
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Ro'yxatdan o'tish
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            >
              <div className="mb-2">
                <label htmlFor="firstName" className="form-label">
                  Ism
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ism..."
                />
              </div>
              <div className="mb-2">
                <label htmlFor="lastName" className="form-label">
                  Famila
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="familya..."
                />
              </div>
              <div className="mb-2">
                <label htmlFor="selectDegree" className="form-label">
                  Darajangiz
                </label>
                <select
                  className="form-select"
                  id="selectDegree"
                  onChange={(e) => setDegree(e.target.value)}
                >
                  <option value="" disabled selected>
                    Darajani tanlang...
                  </option>
                  {status.map((el) => (
                    <option key={el._id} value={el._id}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="phoneNumber" className="form-label">
                  Telefon raqam
                </label>
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
                <label htmlFor="password" className="form-label">
                  Parol
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="telefon raqam..."
                />
                <span
                  className="toggle-password"
                  //   onClick={() => togglePasswordVisibility()}
                >
                  👁️
                </span>
              </div>
              <div className="mb-2 input-password">
                <label htmlFor="passwordConfirm" className="form-label">
                  Parol qayta
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordConfirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="qayta raqam..."
                />
                <span
                  className="toggle-password"
                  //   onClick={() => togglePasswordVisibility()}
                >
                  👁️
                </span>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRegister}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
