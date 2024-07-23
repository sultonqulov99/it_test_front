import React, { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { AppLayoutContext } from "../../Layouts/AppLayout";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function calculateColumnCount(screenWidth) {
  if (screenWidth > 1024) return 4;
  if (screenWidth > 768 && screenWidth < 1024) return 2.5;
  if (screenWidth <= 640) return 1.5;
  return 2;
}

export default function Results() {
  const { API } = useContext(AppLayoutContext);
  const token = window.localStorage.getItem("token");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  let [color, setColor] = useState("#000");

  let data = window.localStorage.getItem("data");
  data = JSON.parse(data);
  const id = data && data._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectResponse = await fetch(
          `${API}/api/users/keyBall/${id}`
        );
        const subjectData = await subjectResponse.json();

        const subjectIds = subjectData.data.map((el) => el.subject_id);
        const subjectPromises = subjectIds.map((subject_id) =>
          fetch(`${API}/api/users/subject/${subject_id}`).then(
            (res) => res.json()
          )
        );

        const subjects = await Promise.all(subjectPromises);
        setSubjects(subjects.map((subject) => subject.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columnCount = calculateColumnCount(screenWidth);

  const handleClick = (subjectId) => {
    setLoading(true); // Set loading to true when a Swiper slide is clicked
    axios
      .get(`${API}/api/users/subjects/${subjectId}`)
      .then((res) => {
        let subjectsData = res.data.data;
        subjectsData.sort((a, b) => {
          const iqA = Math.floor((a.ball * 50) / 75 + (a.key * 50) / 15 - a.attempts);
          const iqB = Math.floor((b.ball * 50) / 75 + (b.key * 50) / 15 - b.attempts);
          const percentA = Math.floor((a.ball * 50) / 75 + (a.key * 50) / 15);
          const percentB = Math.floor((b.ball * 50) / 75 + (b.key * 50) / 15);

          if (iqA !== iqB) return iqB - iqA;
          if (percentA !== percentB) return percentB - percentA;
          if (a.ball !== b.ball) return b.ball - a.ball;
          if (a.key !== b.key) return b.key - a.key;
          return a.attempts - b.attempts;
        });
        setSelectedSubject(subjectsData);
        setLoading(false); // Set loading to false after data is loaded
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Set loading to false in case of error
      });
  };

  return (
    <div className="rayting py-4">
      <div className="container">
        <div className="row">
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={{ clickable: true }}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="mySwiper"
            spaceBetween={10}
            slidesPerView={columnCount}
          >
            {token && subjects.map((subject, index) => {
              return (
                subject && <SwiperSlide
                  style={{ cursor: "pointer" }}
                  key={subject._id}
                  className="col-12 col-md-6 col-lg-3 mb-3"
                >
                  <div
                    onClick={() => handleClick(subject._id)}
                    className="card mb-3 shadow-sm"
                    style={{ maxWidth: "540px" }}
                  >
                    <div className="row g-0">
                      <div className="col-4 col-md-4">
                        <img
                          src={`${API}/${subject.fileName}`}
                          className="img-fluid test-image"
                          alt="Subject"
                        />
                      </div>
                      <div className="col-8 col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{subject.name}</h5>
                          <p className="card-text">5 ta daraja</p>
                          <span className="test-more">Natijalar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="col-12">
            <div className="reyting-table">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <BeatLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <table className="table table-light table-striped">
                  <thead>
                    <tr>
                      <th scope="col">T/R</th>
                      <th scope="col">F.I.O</th>
                      <th scope="col">Viloyat</th>
                      <th scope="col">IQ</th>
                      <th scope="col">Foiz</th>
                      <th scope="col">Ball</th>
                      <th scope="col">Kalit</th>
                      <th scope="col">Urunishlar</th>
                    </tr>
                  </thead>
                  <tbody id="parent_body">
                    {selectedSubject &&
                      selectedSubject.map((select, index) => (
                        <tr key={select.user_id._id} className="values">
                          <td>{index + 1}</td>
                          <td>
                            {select.user_id.name} {select.user_id.surname}
                          </td>
                          <td>{select.user_id.region}</td>
                          <td>
                            {Math.floor(
                              (select.ball * 50) / 75 +
                              (select.key * 50) / 15 -
                              select.attempts
                            )}
                          </td>
                          <td>
                            {Math.floor(
                              (select.ball * 50) / 75 + (select.key * 50) / 15
                            )}
                          </td>
                          <td>{select.ball}</td>
                          <td>{select.key}</td>
                          <td>{select.attempts}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
