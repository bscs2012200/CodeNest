import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Tnav from '../components/Tnav';
import Hamburger from '../components/Hamburger';
import Cookies from 'js-cookie';
import Sidebar from '../components/sidebar';
function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('c'); // Default value 'all'
  const [email, setEmail] = useState('');
  const [testId, setTestId] = useState('');
  const [selectedQuestionsIds, setSelectedQuestionsIds] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(null);

  useEffect(() => {
    const fetchEmailFromCookies = async () => {
      try {
        const mail = Cookies.get('email');
        setEmail(mail);
      } catch (error) {
        console.error('Error fetching email from cookies:', error);
        // Handle error
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ques');
        setQuestions(response.data.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchEmailFromCookies();
    fetchQuestions();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleQuestionClick = async (questionId) => {
    try {
      const response = await axios.get(`http://localhost:3001/ques/${questionId}`);
      setSelectedQuestion(response.data); // Assuming your backend returns the full question object
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleTestIdChange = (event) => {
    setTestId(event.target.value);
  };

  const handleCheckboxChange = (questionId) => {
    setSelectedQuestionsIds(prevIds => {
      if (prevIds.includes(questionId)) {
        return prevIds.filter(id => id !== questionId);
      } else {
        return [...prevIds, questionId];
      }
    });
  };

  const handleSaveTest = async () => {
    try {
      const saveResponse = await axios.post('http://localhost:3001/tests', {
        testId,
        teacherEmail: email,
        questionIds: selectedQuestionsIds
      });
      console.log('Test saved:', saveResponse.data);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error saving test:', error);
      setShowErrorAlert({ type: 'serverError', message: error.response.data.error });
    }
  };

  const handleCreateNewTest = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(null);
    window.location.reload();
  };

  const languageFilteredQuestions = filterValue === 'all' ? questions : questions.filter(question => question.language === filterValue);
  const filteredQuestions = languageFilteredQuestions.filter(question => question.email === email);

  return (
    <div className="c-container">
      <Sidebar />
      <div className="question-section">
        <h1 style={{textAlign: 'center'}}>Create test</h1>
        {showSuccessAlert && (
          <div>
            <div className="alert alert-success" role="alert">
              Test saved successfully
            </div>
            <button className="btn btn-primary" onClick={handleCreateNewTest}>Create a new test</button>
          </div>
        )}

        {!showSuccessAlert && (
          <div>
            {showErrorAlert && (
              <div className="alert alert-danger" role="alert">
                {showErrorAlert.message}
              </div>
            )}
            <div>
              <label style={{marginLeft: '8px'}} htmlFor="testId">Test ID:</label>
              <input type="text" id="testId" value={testId} onChange={handleTestIdChange} />
            </div>
            <div className="filter-dropdown" style={{ marginTop: '8px'}}>
              <label style={{marginLeft: '8px'}} htmlFor="language-filter">Filter by Language:</label>
              <select id="language-filter" value={filterValue} onChange={handleFilterChange}>
                {/* <option value="all">All</option> */}
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>
            <table className="questions-table">
              <thead>
                <tr>
                  <th>#</th>
                  {/* <th>ID</th>
                  <th>email</th> */}
                  <th>Question</th>
                  <th>Language</th>
                  <th>Max Marks</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((question, index) => (
                  <tr key={question._id} onClick={() => handleQuestionClick(question._id)}>
                    <td>{index + 1}</td>
                    {/* <td>{question._id}</td>
                    <td>{question.email}</td> */}
                    <td>{question.question}</td>
                    <td>{question.language}</td>
                    <td>{question.marks}</td>
                    <td><input type="checkbox" onChange={() => handleCheckboxChange(question._id)} checked={selectedQuestionsIds.includes(question._id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className='button-3' onClick={handleSaveTest} style={{marginLeft:'40%'}}>Save Test</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionsList;
