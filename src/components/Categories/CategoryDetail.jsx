import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";
import Info from "../MainPage/Info";
import { FaLock, FaLockOpen } from "react-icons/fa6";

export default function CategoryDetail() {
  const navigate = useNavigate();
  let arr = [1, 2, 3, 4, 5];
  let t = window.localStorage.getItem("time");
  const [bosqich, setBosqich] = useState(1);
  const API = "http://localhost:8080";
  const data = JSON.parse(window.localStorage.getItem("data"));
  const u_id = data._id;
  let subjectName = window.localStorage.getItem("subjectName");
  const { setTime } = useContext(AppLayoutContext)

  useEffect(() => {
    async function fetchData() {
      let subject = await fetch(`${API}/api/subject/${subjectName}`);
      subject = await subject.json();
      let subject_id = subject.data._id;
      let level = await fetch(
        `${API}/api/levelOne?user_id=${u_id}&subject_id=${subject_id}`
      );
      level = await level.json();
      level = +level.data[0].level;
      if (level === 0) {
        async function startTime() {
          let time = window.localStorage.getItem("time");

          time -= 1;
          window.localStorage.setItem("time", time);
          if (time <= -1) {
            level = 1;
            window.localStorage.removeItem("time");
            let res = await fetch(`${API}/api/users/level?user_id=${u_id}&subject_id=${subject_id}&level=${level}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json"
              }
            });
            res = await res.json();
            if (res.status === 200) {
              setBosqich(level);
              return;
            }
          }
          setTime(time);
          setTimeout(function() { startTime() }, 1000); // Changed from 2000 to 1000
        }
        startTime();
      }
      setBosqich(level);
    }

    fetchData();
  }, []);

  function clickCategory() {
    window.localStorage.setItem("time",60);
    navigate("/testQuestion");
  }
  return (
    <>
      <div className="category-detail py-4">
        <div className="container">
          <div className="row justify-content-center mt-3">
            {arr.map((el) => {
              return bosqich === el && !t ? (
                <div key={el} className="col-6 col-md-4 col-lg-2 mb-3 ">
                  <div
                    onClick={clickCategory}
                    className="level d-flex justify-content-between"
                  >
                    <div className="level-desc ">
                      <h4 className="level-title">{el}</h4>
                      <span className="level-text">daraja</span> <br />
                      <span className="test-more">Savol {el*2} ta</span>
                    </div>
                    <FaLockOpen/>
                  </div>
                </div>
              ) : (
                <div key={el} className="col-6 col-md-4 col-lg-2 mb-3 ">
                  <div className="level d-flex justify-content-between">
                    <div className="level-desc">
                      <h4 className="level-title">{el}</h4>
                      <span className="level-text">daraja</span> <br />
                      <span className="test-more">Savol {el*2} ta</span>
                    </div>
                    <FaLock/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Info />
    </>
  );
}
