import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";
import LoginModal from "./Login";
import RegisterModal from "./Register";
import Title from "./Title";
import avatar from "../user.png";
import axios from "axios";

const Header = () => {
  const { API } = useContext(AppLayoutContext);
  const subjectName = window.localStorage.getItem("subjectName");
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const [level, setLevel] = useState(0)

  let data = window.localStorage.getItem("data");
  data = JSON.parse(data);
  const u_id = data && data._id;

  const { isLogined, ball, key, time } = useContext(AppLayoutContext);

  useEffect(() => {
    async function fetchData() {
      const subjectResponse = await axios.get(
        `${API}/api/subject/${subjectName}`
      );
      console.log(subjectResponse)
      const subjectId = subjectResponse.data.data ?  subjectResponse.data.data._id : " ";

      // Ikkinchi API chaqiruvi
      const levelResponse = await axios.get(`${API}/api/levelOne`, {
        params: { user_id: u_id, subject_id: subjectId },
      });
      const level = levelResponse.data.data[0]
        ? levelResponse.data.data[0].level
        : 1;
      setLevel(level);
      const handleStorageChange = () => {
        setToken(window.localStorage.getItem("token"));
      };
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
    fetchData()
  }, [time,isLogined, ball, key]);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <>
      <header className="site-header">
        <nav
          className="navbar navbar-expand-lg bg-white navbar-light w-100 shadow-sm"
          data-bs-theme="white"
        >
          <div className="container-fluid container-xxl">
            <a href="/" className="navbar-brand">
              IQ Test
            </a>
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#burger"
              aria-controls="burger"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse ps-4 pe-4 align-items-center"
              id="burger"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-sm-flex">
                <li className="nav-item">
                  <Link className="nav-link nav-link__item" to="/">
                    Asosiy
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link__item" to="/contact">
                    Aloqa
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link__item" to="/about">
                    Biz haqimizda
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link__item" to="/results">
                    Natijalar
                  </Link>
                </li>
              </ul>
              {isLogined ? (
                <div className="nav-ava">
                  {level == 0 && time &&
                  location.pathname === "/category-detail" &&
                  time != 60 ? (
                    <div className="block-time">
                      <i className="fas fa-clock clock-icon"></i>
                      <b className="bold">{time}</b>
                    </div>
                  ) : null}
                  {location.pathname === "/testQuestion" ||
                  location.pathname === "/imgQuestion" ||
                  location.pathname === "/category-detail" ? (
                    <>
                      <p className="nav-key">
                        <i class="fa-solid fa-medal text-primary"></i>
                        <span className="key-num">{ball}</span>
                      </p>
                      <p className="nav-key">
                        <i className="fas fa-key key-icon"></i>
                        <span className="key-num">{key}</span>
                      </p>
                    </>
                  ) : null}
                  <div className="dropdown">
                    <button
                      className="nav-ava__content"
                      data-bs-toggle="dropdown"
                      data-bs-target="#profile"
                    >
                      <p className="user-name">{data.name}</p>
                      <img
                        src={avatar}
                        alt="User image"
                        className="user-image"
                      />
                    </button>
                    <ul className="dropdown-menu" id="profile">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Profil
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Chiqish
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="btn-group me-2">
                  <a
                    href="#loginModal"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                  >
                    Kirish
                  </a>
                  <a
                    href="#regModal"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                  >
                    Ro'yxatdan o'tish
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
        <RegisterModal />
        <LoginModal
          onSuccess={() => setToken(window.localStorage.getItem("token"))}
        />
      </header>
      <Title />
    </>
  );
};

export default Header;
