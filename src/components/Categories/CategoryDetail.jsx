import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";
import Info from "../MainPage/Info";
import { FaLock, FaLockOpen } from "react-icons/fa6";
import axios from "axios";

export default function CategoryDetail() {
  const navigate = useNavigate();
  let arr = [1, 2, 3, 4, 5];
  let t = window.localStorage.getItem("time");
  const [bosqich, setBosqich] = useState(1);
  const { API } = useContext(AppLayoutContext);
  const data = JSON.parse(window.localStorage.getItem("data"));
  const [level, setLevel] = useState()
  const [subject_id, setSubject_id] = useState("");
  const u_id = data._id;
  let subjectName = window.localStorage.getItem("subjectName");
  const { setTime, setKey, setBall } = useContext(AppLayoutContext)

  useEffect(() => {
    async function fetchData() {
      let subject = await fetch(`${API}/api/subject/${subjectName}`);
      subject = await subject.json();
      let subject_id = subject.data._id;
      //key ball
      const keyBallResponse = await axios.get(
        `${API}/api/users/keyBall/userSubject_id`,
        {
          params: { id: u_id, subject_id: subject_id },
        }
      );
      setSubject_id(subject_id)
      setBall(keyBallResponse.data.data.ball);
      setKey(keyBallResponse.data.data.key);

      //level
      let level = await fetch(
        `${API}/api/levelOne?user_id=${u_id}&subject_id=${subject_id}`
      );
      level = await level.json();
      level = +level.data[0].level;
      setLevel(level)
    }

    fetchData();
  }, []);

  useEffect( () => {
    if (level === 0) {
      async function startTime() {
        let time = window.localStorage.getItem("time");

        time -= 1;
        window.localStorage.setItem("time", time);
        if (time <= -1) {
          let l = 1;
          window.localStorage.removeItem("time");
          let res = await fetch(`${API}/api/users/level?user_id=${u_id}&subject_id=${subject_id}&level=${l}`, {
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
        setTimeout(function() { startTime() }, 1000);
      }
      startTime();
    }
    setBosqich(level);
  },[level] )

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
              return bosqich === el && t !== 0 ? (
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
