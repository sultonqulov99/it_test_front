import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function TestQuestion() {
  const API = "http://localhost:8080";
  let data = window.localStorage.getItem("data");
  data = JSON.parse(data);
  const u_id = data._id;
  const subjectName = window.localStorage.getItem("subjectName");
  const navigate = useNavigate();

  //modal
  const [show, setShow] = useState(false);
  const [modalBodyContent, setModalBodyContent] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (content) => {
    setModalBodyContent(content);
    setShow(true);
  };
  //end

  const [subject_id, setSubject_id] = useState("");
  const [level, setLevel] = useState(1);
  const [test, setTest] = useState([]);
  const [levelTest, setLevelTest] = useState(
    window.localStorage.getItem("levelTest") || 1
  );
  const [testTime, setTestTime] = useState(
    window.localStorage.getItem("time") || 60
  );
  const [testVariant, setTestVariant] = useState([]);
  const [testAnsware, setTestAnsware] = useState("");
  const [questiontestId, setQuestiontestId] = useState("");
  const { setBall, setKey } = useContext(AppLayoutContext);
  const timerRef = useRef(null);


  const handleCheckboxChange = (value) => {
    setTestAnsware(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Birinchi API chaqiruvi
        const subjectResponse = await axios.get(
          `${API}/api/subject/${subjectName}`
        );
        const subjectId = subjectResponse.data.data._id;
        setSubject_id(subjectId);

        // Ikkinchi API chaqiruvi
        const levelResponse = await axios.get(`${API}/api/levelOne`, {
          params: { user_id: u_id, subject_id: subjectId },
        });
        const level = levelResponse.data.data[0]
          ? levelResponse.data.data[0].level
          : 1;
        setLevel(level);

        // Uchinchi API chaqiruvi
        const testResponse = await axios.get(`${API}/api/testLevel`, {
          params: { level, subject_id: subjectId },
        });
        console.log(testResponse.data.data)
        setTest(testResponse.data.data);
        setTestVariant(testResponse.data.data[levelTest - 1].additive_answer);
        setQuestiontestId(testResponse.data.data[levelTest - 1]._id);

        // To'rtinchi API chaqiruvi
        const keyBallResponse = await axios.get(
          `${API}/api/users/keyBall/userSubject_id`,
          {
            params: { id: u_id, subject_id: subjectId },
          }
        );
        setBall(keyBallResponse.data.data.ball);
        setKey(keyBallResponse.data.data.key);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [API, subjectName, u_id]);
  useEffect(() => {
    const startTime = async () => {
      if (testTime === 1) {
        axios
          .put(
            `${API}/api/users/keyBall/attempts?id=${u_id}&subject_id=${subject_id}`
          )
          .then((res) => {
            if (res.status === 200) {
              axios
                .get(
                  `${API}/api/users/keyBall/userSubject_id?id=${u_id}&subject_id=${subject_id}`
                )
                .then((res1) => {
                  let level = 0;
                  axios
                    .put(
                      `${API}/api/users/level?user_id=${u_id}&subject_id=${subject_id}&level=${level}`
                    )
                    .then((res) => {
                      if (res.status === 200) {
                        navigate("/category-detail");
                        window.localStorage.setItem("levelTest", 1);
                        window.localStorage.setItem("questionLevel", 1);
                        window.localStorage.setItem(
                          "time",
                          +res1.data.data.attempts * 1 * 100
                        );
                      }
                    });
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      window.localStorage.setItem("time", testTime);
      setTestTime((prevTime) => prevTime - 1);
    };

    timerRef.current = setTimeout(startTime, 1000);
    return () => clearTimeout(timerRef.current);
  }, [testTime, API, navigate, subject_id, u_id]);

  function handlerBtn() {
    axios
      .post(
        `${API}/api/testAnswer/userSubject_id?id=${u_id}&subject_id=${subject_id}`,
        {
          question_test_id: questiontestId,
          chosen_answer: testAnsware,
        }
      )
      .then((res) => {
        console.log(res)
        if (res.status === 201 && res.data.correct) {
          // setAction(false);
          window.localStorage.setItem("time",60);
          navigate("/imgQuestion")
        } else {
          axios
            .put(
              `${API}/api/users/keyBall/attempts?id=${u_id}&subject_id=${subject_id}`
            )
            .then((res) => {
              if (res.status === 200) {
                axios
                  .get(
                    `${API}/api/users/keyBall/userSubject_id?id=${u_id}&subject_id=${subject_id}`
                  )
                  .then((res1) => {
                    let level = 0;
                    axios
                      .put(
                        `${API}/api/users/level?user_id=${u_id}&subject_id=${subject_id}&level=${level}`
                      )
                      .then((res) => {
                        if (res.status === 200) {
                          navigate("/category-detail");
                          window.localStorage.setItem("levelTest", 1);
                          window.localStorage.setItem("questionLevel", 1);
                          window.localStorage.setItem(
                            "time",
                            +res1.data.data.attempts * 1 * 100
                          );
                        }
                      });
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function hendlerKey() {
    let res = await fetch(
      `${API}/api/users/keyBall/userSubject_id?id=${u_id}&subject_id=${subject_id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    res = await res.json();
    if (res.status === 200) {
      setTestTime(60);
      const keyBallResponse = await axios.get(
        `${API}/api/users/keyBall/userSubject_id`,
        {
          params: { id: u_id, subject_id: subject_id },
        }
      );
      setBall(keyBallResponse.data.data.ball);
      setKey(keyBallResponse.data.data.key);
      handleClose();
    } else if (res.status === 404) {
      setModalBodyContent("Vaqt olish uchun kalit yo'q");
      handleShow("Vaqt olish uchun kalit yo'q");
    }
  }
  return (
    <div className="question-content mb-3">
      <div className="row mb-4">
        <div className="col-7">
          <h2 className="question-test">
            {test[levelTest - 1]
              ? test[levelTest - 1].test_text
              : "Bu darajada hali savol yo'q"}
          </h2>
        </div>
        <div className="col-5">
          <form>
            {testVariant.map((el, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={el}
                  id={`answer${index}`}
                  checked={testAnsware === el}
                  onChange={() => handleCheckboxChange(el)}
                />
                <label className="form-check-label" htmlFor={`answer${index}`}>
                  {el}
                </label>
              </div>
            ))}
          </form>
        </div>
      </div>
      <div className="row justify-content-between align-items-center">
        <div className="col-1 col-lg-2">
          <i className="fas fa-clock clock-icon"></i>
          <b className="bold">{testTime}</b>
        </div>
        <div className="col-11 col-lg-6 text-end ">
          <Button className="btn-key" variant="primary" onClick={() => handleShow("Rostdan foydalanmoqchimisiz?")}>
            Foydalanish <i className="fas fa-key key-icon text-white"></i>
          </Button>
          <button onClick={handlerBtn} className="btn btn-primary ">
            Keyingisi...
          </button>

          {/* MODAL key */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Kalitni ishlatish</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalBodyContent}</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Yo'q
              </Button>
              <Button variant="primary" onClick={hendlerKey}>
                Ha
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
