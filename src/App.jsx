import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About/About.jsx";
import CategoryDetail from "./components/Categories/CategoryDetail.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Main from "./components/MainPage/Main.jsx";
import ImgQuestion from "./components/Questions/ImgQuestion.jsx";
import Question from "./components/Questions/Question.jsx";
import TestQuestion from "./components/Questions/TestQuestion.jsx";
import Results from "./components/Results/Results.jsx";
import AppLayout from "./Layouts/AppLayout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Main />} />
          <Route path="category-detail" element={<CategoryDetail />} />
          <Route path="/" element={<Question />}>
            <Route path="testQuestion" element={<TestQuestion />}/>
            <Route path="imgQuestion" element={<ImgQuestion />} />
          </Route>
          <Route path="results" element={<Results />}/>
          <Route path="contact" element={<Contact />}/>
          <Route path="about" element={<About />}/>
        </Route>  
      </Routes>
    </Router>
  )
}

export default App;
