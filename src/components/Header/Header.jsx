import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";
import LoginModal from "./Login";
import RegisterModal from "./Register";
import Title from "./Title";
import { FaMedal } from "react-icons/fa6";

const Header = () => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  
  let data = window.localStorage.getItem("data");
  data = JSON.parse(data);

  const { isLogined,ball,key,time } = useContext(AppLayoutContext)

  useEffect(() => {
    // Update token state when localStorage changes
    const handleStorageChange = () => {
      setToken(window.localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Redirect to the home page after logout
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
                  {
                    (time && location.pathname ==="/category-detail" && time != 60) ? <div className="block-time">
                    <i className="fas fa-clock clock-icon"></i>
                    <b className="bold">{time}</b>
                  </div> : null
                  }
                  <p className="nav-key">
                  <i class="fa-solid fa-medal text-primary" ></i>
                    <span className="key-num">{ball}</span>
                  </p>
                  <p className="nav-key">
                    <i className="fas fa-key key-icon"></i>
                    <span className="key-num">{key}</span>
                  </p>
                  <div className="dropdown">
                    <button
                      className="nav-ava__content"
                      data-bs-toggle="dropdown"
                      data-bs-target="#profile"
                    >
                      <p className="user-name">{data.name}</p>
                      <img
                        src="https://picsum.photos/40/40"
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
                        <button className="dropdown-item" onClick={handleLogout}>
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
        <LoginModal onSuccess={() => setToken(window.localStorage.getItem("token"))} />
      </header>
      <Title />
    </>
  );
};

export default Header;
