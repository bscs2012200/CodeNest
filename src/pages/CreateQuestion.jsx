import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from '../components/sidebar';
import './CreateQuestion.css'; // Import CSS file for styling

function CreateQuestion() {
  const [language, setLanguage] = useState('');
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [marks, setMarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEmailFromCookies = async () => {
      try {
        const mail = Cookies.get('email');
        setEmail(mail);
      } catch (error) {
        console.error('Error fetching email from cookies:', error);
      }
    };

    fetchEmailFromCookies();
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      language,
      question,
      email,
      marks,
    };

    try {
      const response = await axios.post('http://localhost:3001/ques', newQuestion);
      setSuccessMessage(response.data.success ? 'Question saved successfully!' : '');
      setErrorMessage('');
      // Clear input fields
      setLanguage('');
      setQuestion('');
      setMarks('');
    } catch (error) {
      setErrorMessage(error.response.data.error || 'An error occurred while creating the question.');
      setSuccessMessage('');
    }
  };

  const handleCreateNewQuestion = () => {
    // Refresh the page
    window.location.reload();
  };

  return (
    <div className="c-container"> {/* Main container */}
      <Sidebar />
      <div className="content-container"> {/* Container for dashboard content */}
        <h1>Create Question</h1>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="language">Language:</label>
              <select className='langQ' id="language" value={language} onChange={handleLanguageChange}>
                <option value="">Select Language</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div>
              <label htmlFor="marks">Marks:</label>
              <input className='markQ' type="number" id="marks" value={marks} onChange={handleMarksChange} />
            </div>
            <div>
              <label htmlFor="question">Question:</label>
              <textarea className='qtext' value={question} onChange={handleQuestionChange} />
            </div>
            <button className='CQS' type="submit">Submit</button>
          </form>
        )}
        {successMessage && (
          <button className="btn btn-primary" onClick={handleCreateNewQuestion}>Create a New Question</button>
        )}
      </div>
    </div>
  );
}

export default CreateQuestion;
