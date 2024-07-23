import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";

const RegisterModal = () => {
  const { API } = useContext(AppLayoutContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [region, setRegion] = useState("")
  const [degree, setDegree] = useState("");
  const [status, setStatus] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const { setIsLogined } = useContext(AppLayoutContext);

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
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
      }
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleBackdropRemoval);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener(
          "hidden.bs.modal",
          handleBackdropRemoval
        );
      }
    };
  }, []);

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      setIsError("Parolni xato kiritdingiz");
      return;
    }
    axios
      .post(`${API}/api/register`, {
        name: firstName,
        surname: lastName,
        region : region,
        status_id: degree,
        password: password,
        contact: "+" + phoneNumber,
      })
      .then((res) => {
        if (res.status === 201) {
          window.localStorage.setItem("data", JSON.stringify(res.data.data));
          window.localStorage.setItem("token", res.data.token);
          setIsLogined(true);
          // Close the modal
          if (modalRef.current) {
            const modalElement = modalRef.current;
            const modalInstance =
              window.bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
          }
        }
        navigate("/");
      })
      .catch((error) => {
        setIsError(error.response.data.message);
        console.log(error);
      });
  };

  const togglePasswordVisibility = (type) => {
    if (type === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowPasswordConfirm(!showPasswordConfirm);
    }
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
            {isError ? <span style={{ color: "red" }}>{isError}</span> : null}
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
                <label htmlFor="lastName" className="form-label">
                  Viloyat
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="viloyat..."
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
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="parol..."
                  />
                  <span
                    className="input-group-text"
                    onClick={() => togglePasswordVisibility("password")}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              <div className="mb-2 input-password">
                <label htmlFor="passwordConfirm" className="form-label">
                  Parol qayta
                </label>
                <div className="input-group">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    className="form-control"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="parolni qayta kiriting..."
                  />
                  <span
                    className="input-group-text"
                    onClick={() => togglePasswordVisibility("passwordConfirm")}
                    style={{ cursor: "pointer" }}
                  >
                    {showPasswordConfirm ? "🙈" : "👁️"}
                  </span>
                </div>
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
