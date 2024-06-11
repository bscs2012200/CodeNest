import React, { useState, useRef, Fragment } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar from "../components/sidebar.jsx";
import IDES from "../components/IDES.jsx";
import "./TestAttemptPage2.css";

const TestDetailsPage = () => {
  const [testId, setTestId] = useState("");
  const [testData, setTestData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [testLoaded, setTestLoaded] = useState(false);
  const regno = Cookies.get("regno");
  const editorRef = useRef(null);

  const handleTestIdChange = (event) => {
    setTestId(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getTestDetails/${testId}`);
      const testDetails = response.data;

      setTestData(testDetails);
      setLanguage(testDetails.language);
      setQuestions(testDetails.questions);
      setTestLoaded(true);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error fetching test details. Please try again later.");
      }
      setTestData(null);
      setTestLoaded(false);
    }
  };

  const getExtension = (language) => {
    switch (language) {
      case "c":
        return ".c";
      case "java":
        return ".java";
      case "python":
        return ".py";
      default:
        return "";
    }
  };

  return (
    <div className="c-container">
      <Sidebar />
      <div className="cntn">
        {!testLoaded && (
          <Fragment>
            <div className="input-container">
              <input
                value={testId}
                onChange={handleTestIdChange}
                placeholder="Enter your test ID"
                type="text"
              />
              <button onClick={fetchData} className="start-btn">
                Start
              </button>
            </div>
          </Fragment>
        )}

        {testData && (
          <div> 
            {/* <p>Test ID: {testData.testId}</p>
            <p>Language: {testData.language}</p> */}
          
            <h1>{testData.testType}</h1>
            <p>Language: {testData.language}</p>
            <p>Time Duration: {testData.duration} Minutes</p>
            {/* <h3>Questions:</h3> */}
            <div className="questions-container">
            {questions.map((question, index) => (
  <div key={index} className="question-container">
    <p className="questiont">{"Q" + (index + 1)}. {question.question}</p>
    <p>Marks: {question.marks}</p>
    <IDES
      extension={getExtension(language)}
      filename={`src${index + 1}`}
      language={language}
      testId={testId}
      regno={regno}
      questionId={question._id}
      item={question}
    />
  </div>
))}

            </div>
          </div>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default TestDetailsPage;
