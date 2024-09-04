import React, { Fragment, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import IDES from "../components/IDES.jsx";
import axios from 'axios';
import Cookies from 'js-cookie';
import './TestAttemptPage2.css'; // Import CSS file for TestAttemptPage2

const TestAttemptPage2 = () => {
  const [language, setLanguage] = useState('');
  const editorRef = useRef(null);
  const [execute, setExecute] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState('');
  const [error, setError] = useState(null); // State for error
  const [testLoaded, setTestLoaded] = useState(false); // State for tracking test loaded status
  const regno = Cookies.get('regno');
  const [filenames, setFilenames] = useState(regno || '');

  const handleTestIdChange = (e) => {
    setTestId(e.target.value);
  };

  const fetchData = async () => {
    
    try {
      const responseTests = await axios.get(`http://localhost:3001/tests/${testId}`);
      setTests(responseTests.data);
     
      const allQuestions = [];

      for (const questionId of responseTests.data.test.questionIds) {
        const responseQuestions = await axios.get(`http://localhost:3001/ques/${questionId}`);
        allQuestions.push(responseQuestions.data.question);
        console.log('Question ID:', questionId);
        console.log('Question Details:', responseQuestions.data);
      }
      console.log(allQuestions.length > 0 ? allQuestions[0].language : '');
      setLanguage(allQuestions.length > 0 ? allQuestions[0].language : '');
      setQuestions(allQuestions);
     
      setTestLoaded(true); // Set testLoaded to true after test is successfully loaded
      setError(null); // Clear error when test is loaded
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        if (error.response.status === 404) {
          setError({ status: 404, message: 'Test not found' });
        } else if (error.response.status === 500) {
          setError({ status: 500, message: 'Server error' });
        } else {
          setError({ status: error.response.status, message: 'Unknown error' });
        }
      } else {
        setError({ status: 'Unknown', message: 'An unknown error occurred' });
      }
      
    }
  };

  const getExtension = (language) => {
    switch (language) {
      case 'c':
        return '.c';
      case 'java':
        return '.java';
      case 'python':
        return '.py';
      default:
        return '';
    }
  };

  return (
    <div className="test-attempt-page">
      <h2 style={{textAlign: 'center'}}>Attempt Test</h2>
      {error && <div className="alert alert-danger"> {error.message}</div>}
      
      {!testLoaded && (
        <Fragment>
          <div class="input-container">
  <input  value={testId}
            onChange={handleTestIdChange} placeholder="Enter your test ID" type="text" />
  <button onClick={fetchData} className="start-btn">Start</button>
</div>
        </Fragment>
        
      )}

      
    
     
      
      {testLoaded &&
        questions.map((question, index) => (
          <div key={index} className="question-container">
            <h4>Question: {question.question}</h4>
            <p>Marks: {question.marks}</p>
            <p>{question.language}</p>
            <IDES 
              extension={getExtension(language)}
              filename={"file1"}
              language={language}
              testId={testId}
              regno = {regno}
              questionId={question._id}
              item={question}
              key={index}
            />
          </div>
        ))
      }
    </div>
  );
};

export default TestAttemptPage2;
