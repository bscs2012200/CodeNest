import React, { useState, useRef, useEffect, Fragment } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Sidebar2 from "../components/sidebar2.jsx";
import IDES from "../components/IDES.jsx";
import "./TestAttemptPage2.css";

const TestDetailsPage = () => {
  const [testId, setTestId] = useState("");
  const [testData, setTestData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [testLoaded, setTestLoaded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // State for countdown timer
  const regno = Cookies.get("regno");
  const editorRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [filename, setFilename] = useState(""); // State for filename

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleTestIdChange = (event) => {
    setTestId(event.target.value);
  };

  const handleFilenameChange = (event) => {
    setFilename(event.target.value);
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
      setTimeRemaining(testDetails.duration * 60); // Set countdown time based on test duration
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

  // Countdown timer logic
  useEffect(() => {
    let intervalId;
    if (testLoaded && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (testLoaded && timeRemaining === 0) {
      handleSubmit();
    }

    return () => clearInterval(intervalId); // Cleanup interval
  }, [testLoaded, timeRemaining]);

  // Function to format time in HH:MM:SS format
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getExtension = (language) => {
    switch (language) {
      case "c":
        return ".c";
      case "java":
        return ".java";
      case "python":
        return ".py";
      case "c++":
        return ".cpp";
      default:
        return "extension not specified";
    }
  };

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getstudentinfo/${regno}`);
      const studentProfileData = response.data; 
      setStudentProfile({ name: studentProfileData.name, regno: studentProfileData.regno });
    } catch (error) {
      console.error('Error fetching student info:', error);
      setErrorMessage('Error fetching student info. Please check the Registration Number.');
    }
  };

  useEffect(() => {
    if (regno) {
      fetchStudentInfo();
    }
  }, [regno]);

  return (
    <div className="c-container">
      <Sidebar2 />
      {!isSubmitted && (
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
              <h1>{testData.testType}</h1>
              {studentProfile && <p>Name: {studentProfile.name}</p>}
              <p>Total Marks: {testData.totalMarks}</p>
              <p>Time Duration: {testData.duration} Minutes</p>
              <p className="countdown">Time Remaining: {formatTime(timeRemaining)}</p>
              <div>
                {questions.map((question, index) => (
                  <div key={index} className="question-container">
                    <p className="questiont">{"Q" + (index + 1)}. {question.question}</p>
                    <p>Marks: {question.marks}</p>
                    {language === "java" && (
                      <div className="filename-input-container">
                        <label htmlFor={`filename-${index}`}>Enter filename:</label>
                        <input
                          id={`filename-${index}`}
                          type="text"
                          value={filename}
                          onChange={handleFilenameChange}
                          placeholder="Filename (without extension)"
                        />
                      </div>
                    )}
                    <IDES
                      extension={getExtension(language)}
                      filename={language === "java" ? filename : `src${index + 1}`}
                      language={language}
                      testId={testId}
                      regno={regno}
                      questionId={question._id}
                      item={question}
                      name={studentProfile.name}
                    />
                  </div>
                ))}
              </div>
              <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
            </div>
          )}
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      )}
      {isSubmitted && (
        <div className="submission-success">
          <div className="svg-container">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
              <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
              <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
            </svg>
          </div>
          <h2 className="success">Test submitted successfully!</h2>
        </div>
      )}
    </div>
  );
};

export default TestDetailsPage;
