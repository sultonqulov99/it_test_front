import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import axios from "axios";
import { AppLayoutContext } from "../../Layouts/AppLayout";

function calculateColumnCount(screenWidth) {
  let columnCount;
  if (screenWidth > 1024) {
    columnCount = 4;
  } else if (screenWidth > 768 && screenWidth < 1024) {
    columnCount = 2.5;
  } else if (screenWidth <= 640) {
    columnCount = 1.5;
  } else {
    columnCount = 2;
  }
  return columnCount;
}

export default function Science() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  let token = window.localStorage.getItem("token");

  const API = "http://localhost:8080";
  let data = window.localStorage.getItem("data");
  data = JSON.parse(data);
  const u_id = data? data._id : "";
  // let status_id = window.localStorage.getItem("token");
  const [subjects, setSubjects] = useState([]);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const { isLogined, setIsLogined } = useContext(AppLayoutContext);

  useEffect(() => {
    token
      ? axios
          .get(`${API}/api/users/statusId/${token}`)
          .then((res) => {
            setSubjects(res.data.data);
          })
          .catch((error) => {
            if(error.response.status === 500){
              window.localStorage.clear()
              setIsLogined(false)
            }
            console.log(error);
          })
      : axios
          .get(`${API}/api/users/subjects/all`)
          .then((res) => {
            setSubjects(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLogined]);

  const columnCount = calculateColumnCount(screenWidth);

  async function clickCategory(name) {
    if (token) {
      try{
        window.localStorage.setItem("subjectName",name)
        // Fetch the subject
        let subjectResponse = await axios.get(`${API}/api/subject/${name}`);
        let subject = subjectResponse.data;
        let subject_id = subject.data._id;
        // Fetch the level
        let levelResponse = await axios.get(`${API}/api/levelOne`, {
        params: {
          user_id: u_id,
          subject_id: subject_id
        }
      });
      let level = levelResponse.data.data[0] ? +levelResponse.data.data[0].level : undefined;
      // Update user level
      let updateLevelResponse = await axios.put(`${API}/api/users/level?user_id=${u_id}&subject_id=${subject_id}&level=${level}`)
    // Update user subject
      let updateSubjectResponse = await axios.put(`${API}/api/users/subject?id=${u_id}&subject_id=${subject_id}`)
      // Check response statuses
      if (updateLevelResponse.status === 200 || updateLevelResponse.status === 201 && updateSubjectResponse.status === 201) {
        window.localStorage.setItem("subjectName", name);
        navigate("category-detail");
      }
      }catch(error){
        console.error("Error updating subject or level", error);
      }
      
    }
  }

  return (
    <section className="science">
      <div className="container py-5">
        <h2 className="science-headline">O'zingizni sinab ko'ring!</h2>
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
            {subjects.map((el, index) => (
              <SwiperSlide key={el} className="col-12 col-md-6 col-lg-3 mb-3">
                <div
                  onClick={() => clickCategory(el.name)}
                  className="card mb-3 shadow-sm"
                  style={{ maxWidth: "540px","cursor":"pointer"}}
                >
                  <div className="row g-0">
                    <div className="col-4 col-md-4">
                      <img
                        src="https://picsum.photos/100/100"
                        className="img-fluid test-image"
                        alt="Dasturlash"
                      />
                    </div>
                    <div className="col-8 col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{el.name}</h5>
                        <p className="card-text">5 ta daraja</p>
                        <span className="test-more">Boshlash...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
