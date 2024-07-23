import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayoutContext } from "../../Layouts/AppLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ImgQuestion() {
  const initialHarflar = ["a", "b", "c", "d", "e", "f", "g", "k", "l", "q"];
  const { API } = useContext(AppLayoutContext);

  const data = JSON.parse(window.localStorage.getItem("data"));
  const u_id = data._id;
  const subjectName = window.localStorage.getItem("subjectName");

  const [level, setLevel] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [test, setTest] = useState(null);
  const [levelTest, setLevelTest] = useState(
    parseInt(window.localStorage.getItem("levelTest")) || 1
  );
  const [answer, setAnswer] = useState(Array(6).fill(""));
  const [harflar, setHarflar] = useState(initialHarflar);
  const inputRefs = useRef([]);
  const { setBall, setKey } = useContext(AppLayoutContext);
  const timerRef = useRef(null);
  const [testTime, setTestTime] = useState(
    window.localStorage.getItem("time") || 60
  );

  const modalRef = useRef(null);

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

  useEffect(() => {
    async function fetchData() {
      try {
        let subject = await fetch(`${API}/api/subject/${subjectName}`);
        subject = await subject.json();
        const subject_id = subject.data._id;
        setSubjectId(subject_id);

        let levelResponse = await fetch(
          `${API}/api/levelOne?user_id=${u_id}&subject_id=${subject_id}`
        );
        let levelData = await levelResponse.json();
        const userLevel = levelData.data[0].level;
        setLevel(userLevel);

        let testResponse = await fetch(
          `${API}/api/testImgLevel?level=${userLevel}&subject_id=${subject_id}`
        );
        let testData = await testResponse.json();
        setTest(testData);

        const keyBallResponse = await axios.get(
          `${API}/api/users/keyBall/userSubject_id`,
          {
            params: { id: u_id, subject_id: subject_id },
          }
        );
        setBall(keyBallResponse.data.data.ball);
        setKey(keyBallResponse.data.data.key);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [u_id, subjectName]);

  useEffect(() => {
    const startTime = async () => {
      if (testTime === 1) {
        axios
          .put(
            `${API}/api/users/keyBall/attempts?id=${u_id}&subject_id=${subjectId}`
          )
          .then((res) => {
            if (res.status === 200) {
              axios
                .get(
                  `${API}/api/users/keyBall/userSubject_id?id=${u_id}&subject_id=${subjectId}`
                )
                .then((res1) => {
                  let level = 0;
                  axios
                    .put(
                      `${API}/api/users/level?user_id=${u_id}&subject_id=${subjectId}&level=${level}`
                    )
                    .then((res) => {
                      if (res.status === 200) {
                        navigate("/category-detail");
                        window.localStorage.setItem("levelTest", 1);
                        window.localStorage.setItem("questionLevel", 1);
                        window.localStorage.setItem(
                          "time",
                          (+res1.data.data.attempts + 1) * 300
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
  }, [testTime, API, navigate, subjectId, u_id]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    let newAnswer = [...answer];
    newAnswer[index] = value;
    setAnswer(newAnswer);

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleLetterClick = (letter) => {
    let newAnswer = [...answer];
    for (let j = 0; j < newAnswer.length; j++) {
      if (newAnswer[j] === "") {
        newAnswer[j] = letter;
        setAnswer(newAnswer);
        inputRefs.current[j].focus();
        break;
      }
    }
    setHarflar(harflar.filter((harf) => harf !== letter));
  };

  const handleNext = async () => {
    const question_img_id = test.data[levelTest - 1]._id.toString();
    const chosen_answer = answer.join("");

    try {
      let testAns = await fetch(
        `${API}/api/testImgAnswer/userSubject_id?id=${u_id}&subject_id=${subjectId}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ question_img_id, chosen_answer }),
        }
      );
      testAns = await testAns.json();
      if (testAns.status === 201 && testAns.correct) {
        let levelTest = parseInt(window.localStorage.getItem("levelTest") || 1);
        let subject = await fetch(`${API}/api/subject/${subjectName}`);
        subject = await subject.json();

        let levelResponse = await fetch(
          `${API}/api/levelOne?user_id=${u_id}&subject_id=${subjectId}`
        );
        let levelData = await levelResponse.json();
        let userLevel = levelData.data[0].level;

        if (levelTest < userLevel) {
          window.localStorage.setItem("time", 60);
          navigate("/testQuestion");
          window.localStorage.setItem("levelTest", levelTest + 1);
          return;
        }

        userLevel = userLevel + 1;
        window.localStorage.setItem("questionLevel", userLevel);
        let res = await fetch(
          `${API}/api/users/level?user_id=${u_id}&subject_id=${subjectId}&level=${userLevel}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        res = await res.json();
        if (res.status === 200) {
          window.localStorage.removeItem("time");
          window.localStorage.setItem("levelTest", 1);
          navigate("/category-detail");
        }
      } else if (!testAns.correct) {
        let users = await fetch(
          `${API}/api/users/keyBall/userSubject_id?id=${u_id}&subject_id=${subjectId}`
        );
        users = await users.json();
        let level = 0;
        let res = await fetch(
          `${API}/api/users/level?user_id=${u_id}&subject_id=${subjectId}&level=${level}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        res = await res.json();
        if (res.status === 200) {
          navigate("/category-detail");
          window.localStorage.setItem("time", (users.data.attempts + 1) * 300);
          window.localStorage.setItem("levelTest", 1);
          window.localStorage.setItem("questionLevel", 1);
        }
      }
    } catch (error) {
      console.error("Error handling next question:", error);
    }
  };

  async function hendlerKey() {
    let res = await fetch(
      `${API}/api/users/keyBall/userSubject_id?id=${u_id}&subject_id=${subjectId}`,
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
          params: { id: u_id, subject_id: subjectId },
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
    <div className="question-content question-image">
      <div className="row mb-4 align-items-end justify-content-between">
        <div className="col-4">
          {test && (
            <img
              src={`${API}/${test && test.data[levelTest - 1].img}`}
              alt=""
              className="question-photo"
            />
          )}
        </div>
        <div className="col-12 col-lg-8">
          <div className="question-letter">
            <p className="question mb-0">
              {test && test.data[levelTest - 1].question_text}
            </p>{" "}
            <br />
            <span className="question-help">
              Foydalanish mumkin bo'lgan harflar:
            </span>{" "}
            <br />
            <ul className="question-item">
              {harflar.map((harf, index) => (
                <li
                  key={index}
                  onClick={() => handleLetterClick(harf)}
                  style={{ cursor: "pointer" }}
                >
                  {harf}
                </li>
              ))}
            </ul>
          </div>
          <h4 className="question-word">So'zni kiriting:</h4>
          <form className="question-form">
            {test &&
              [...Array(test.data[levelTest - 1].correct_answer.length)].map(
                (_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="form-control input-word"
                    type="text"
                    value={answer[index] || ""}
                    maxLength="1"
                    onChange={(e) => handleInputChange(e, index)}
                  />
                )
              )}
          </form>
        </div>
      </div>
      <div className="row justify-content-between align-items-center">
        <div className="col-1 col-lg-2">
          <i className="fas fa-clock clock-icon"></i>
          <b className="bold">{testTime}</b>
        </div>
        <div className="col-11 col-lg-6 text-end">
          <Button
            className="btn-key"
            variant="primary"
            onClick={() => handleShow("Rostdan foydalanmoqchimisiz?")}
          >
            Foydalanish <i className="fas fa-key key-icon text-white"></i>
          </Button>
          <button onClick={handleNext} className="btn btn-primary ">
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
