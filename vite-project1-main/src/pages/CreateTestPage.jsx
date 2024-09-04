import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from '../components/sidebar';
import './CreateTestPage.css'; 
import java from '../assets/Java.png';
import C from '../assets/C.png';
import py from '../assets/python.png';
import cpp from '../assets/c++.png';


const CreateTestPage = () => {
  const [testId, setTestId] = useState('');
  const [testQuestions, setTestQuestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newMarks, setNewMarks] = useState('');
  const [testDuration, setTestDuration] = useState(''); 
  const [courseName, setCourseName] = useState(''); 
  const [section, setsection] = useState(''); 
  const email = Cookies.get('email');
  const [teacherProfileData, setTeacherProfileData] = useState(null);
  const [IsCreated, setIsCreated] = useState(false);

  const fetchTeacherInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/geteacherinfo/${email}`);
      const teacherProfileData = response.data;
      setTeacherProfileData({ name: teacherProfileData.name, email: teacherProfileData.email });
    } catch (error) {
      console.error('Error fetching teacher info:', error);
      
    }
  };

  useEffect(() => {
    if (email) {
      fetchTeacherInfo();
    }
  }, [email]);

  useEffect(() => {
    generateRandomTestId(); 
  }, []); 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() === '' || newMarks.trim() === '') {
      setAlertMessage('Please fill in both question and marks');
      return;
    }
  
    const marks = parseInt(newMarks); 
  
    if (marks <= 0) {
      setAlertMessage('Marks should be more than 0');
      return;
    }
  
    const question = {
      question: newQuestion,
      marks: marks, 
    };

    const updatedTestQuestions = [...testQuestions, question];
    const totalMarks = updatedTestQuestions.reduce((acc, curr) => acc + curr.marks, 0);
    console.log('Total Marks:', totalMarks);
  
     setTestQuestions(updatedTestQuestions);
    setNewQuestion('');
    setNewMarks('');
    toggleForm();
  };
  

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...testQuestions];
    updatedQuestions.splice(index, 1);
    setTestQuestions(updatedQuestions);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleTestTypeChange = (e) => {
    setSelectedTestType(e.target.value);
  };

  const generateRandomTestId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 6; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setTestId(randomId);
};


const handleSubmitTest = async () => {
  if (testQuestions.length === 0) {
    setAlertMessage('Please add at least one question');
    return;

  }

  
  const totalMarks = testQuestions.reduce((acc, curr) => acc + curr.marks, 0);
  
  try {
    await axios.post('http://localhost:3001/saveTest', {
      testId,
      questions: testQuestions,
      language: selectedLanguage,
      testType: selectedTestType,
      duration: testDuration,
      email,
      courseName,
      totalMarks,
      section
    });
      console.log('Test submitted successfully!');
      setAlertMessage('Test Created Successfully');
      setIsSubmitted(true);
      setIsCreated(true)
    } catch (error) {
      console.error('Error submitting test:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          const data = error.response.data;
          if (data.message === 'Please specify Test type') {
            setAlertMessage('Please specify test type');
          } else if (data.message === 'Please specify language') {
            setAlertMessage('Please specify language');
          } else if (data.message === 'Questions array cannot be empty') {
            setAlertMessage('Please add at least one question');
          } else if (data.message === 'Test with the given ID already exists') {
            setAlertMessage('Test ID already exists');
          } else if (data.message === 'Please enter a question') {
            setAlertMessage('Please enter a question');
          } else if (data.message === 'Please enter marks') {
            setAlertMessage('Please enter marks');
          } else if (data.message === 'Marks should be more than 0') {
            setAlertMessage('Marks should be more than 0');
          } else if (data.message === 'Marks cannot be negative') {
            setAlertMessage('Marks cannot be negative');
          } else if (data.message === 'Please specify Course name'){
            setAlertMessage('Please enter course name');
          }
           else {
            setAlertMessage('Unknown error occurred');
          }
        } else if (status === 500) {
          setAlertMessage('Internal server error: Please try again later');
        } else {
          setAlertMessage('Unknown error occurred');
        }
      } else {
        setAlertMessage('Network error: Please check your internet connection');
      }
    }
  };
  
  return (
    <div className="c-container">
      <Sidebar />
      {!IsCreated && (
      <div className="content-container">
      {alertMessage && (
        <div className={`alert ${isSubmitted ? 'alert-success' : 'alert-danger'}`} role="alert">
          {alertMessage}
        </div>
      )}
        <div className="header">
          <h2>Create a test</h2>
          <p>Test ID: {testId}</p>
          <p>Teacher Name: {teacherProfileData ? teacherProfileData.name : 'Loading...'}</p>
        </div>
        <div className="form-section">
        <div className="select-wrapper">
        <div className="form-group">
  <label htmlFor="courseName">Course Name:</label>
  <input type="text" id="courseName" className="course-name-input" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
</div>
<div className="form-group">
  <label htmlFor="courseName">Section:</label>
  <input type="text" id="section" className="course-name-input" value={section} onChange={(e) => setsection(e.target.value)} />
</div>
  <div>
    <label>Select Test Type:</label>
    <select className='course-name-input' value={selectedTestType} onChange={handleTestTypeChange}>
      <option value="">Select Test Type</option>
      <option value="Quiz">Quiz</option>
      <option value="Assignment">Assignment</option>
      <option value="Mid Exam">Mid Exam</option>
      <option value="Final Exam">Final Exam</option>
    </select>
  </div>
  <div className="form-group">
  <label htmlFor="testDuration">Test Duration (in minutes):</label>
  <input type="number" id="testDuration" className="test-duration-input" value={testDuration} onChange={(e) => setTestDuration(e.target.value)} />
</div>
  <div className='radio-options'>
    <label style={{marginTop:'18px'}}>Select Language:</label>
    <div>
    <label>
        <input
          type="radio"
          name="language"
          value="c++"
          checked={selectedLanguage === "c++"}
          onChange={handleLanguageChange}
        />
        <img src={cpp} className="picon" alt="C icon"/>
      </label>
      <label>
        <input
          type="radio"
          name="language"
          value="c"
          checked={selectedLanguage === "c"}
          onChange={handleLanguageChange}
        />
        <img src={C} className="picon" alt="C icon"/>
      </label>
    </div>
    <div>
      <label>
        <input
          type="radio"
          name="language"
          value="java"
          checked={selectedLanguage === "java"}
          onChange={handleLanguageChange}
        />
        <img src={java} className="picon" alt="java icon"/>
      </label>
    </div>
    <div>
      <label>
        <input
          type="radio"
          name="language"
          value="python"
          checked={selectedLanguage === "python"}
          onChange={handleLanguageChange}
        />
        <img src={py} className="picon" alt="python icon"/>
      </label>
    </div>
  </div>
</div>

<div className="total-marks">
  <p>Total Marks: {testQuestions.reduce((acc, curr) => acc + curr.marks, 0)}</p>
</div>

          <button className="btn btn-primary" onClick={toggleForm}>Create Question</button>
          {isFormOpen && (
            <form className="question-form">
              <div className="form-group">
                <label htmlFor="newQuestion">Question:</label>
                <input type="text" id="newQuestion" className="new-question-input" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="newMarks">Marks:</label>
                <input type="number" id="newMarks" className="new-marks-input" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleAddQuestion}>Add Question</button>
              <button type="button" className="btn btn-secondary" onClick={toggleForm}>Close</button>
            </form>
          )}
        </div>
        <div className="questions-section">
  <p>Questions:</p>
  <table className="questions-table">
    <thead>
      <tr>
        <th>Question</th>
        <th>Marks</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {testQuestions.map((question, index) => (
        <tr key={index}>
          <td>{question.question}</td>
          <td>{question.marks}</td>
          <td>
            <button type="button" className="btn btn-danger" onClick={() => handleRemoveQuestion(index)}>Remove</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        <div className="submit-section">
          <button style={{marginTop: '10px'}} className="btn btn-primary" onClick={handleSubmitTest}>Submit Test</button>
        </div>
      </div>
      )}
 {IsCreated && (
  <div className="submission-success">
    <div className="svg-container">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
        <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
        <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
      </svg>
    </div>
    <h2 className="success">Test Created sucessfully!</h2>
    <h2 className="success">Your test id is {testId} </h2>
  </div>
)}
    </div>
  );
};

export default CreateTestPage;
