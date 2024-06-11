import React, { useState } from 'react';
import axios from 'axios';
import Tnav from '../components/Tnav';
import Hamburger from '../components/Hamburger';

const TestPage = () => {
  const [testId, setTestId] = useState('');
  const [testQuestions, setTestQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showTest, setShowTest] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleTestIdChange = (e) => {
    setTestId(e.target.value);
    setEmptyFieldAlert(false);
    setAlertMessage(null);
    setShowTest(false); // Reset showTest when test ID changes
  };

  const handleSubmit = async () => {
    if (!testId) {
      setEmptyFieldAlert(true);
      setAlertMessage('Test ID cannot be empty.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3001/getTest?testId=${testId}`);

      if (response.status === 200) {
        setTestQuestions(response.data.questions);
        setShowTest(true); // Set showTest to true if test is successfully fetched
      } else if (response.status === 404) {
        setTestQuestions([]);
        setAlertMessage(`Test with ID ${testId} does not exist.`);
      } else {
        setTestQuestions([]);
        setAlertMessage('Error fetching test. Please try again.');
      }
    } catch (error) {
      setTestQuestions([]);
      setAlertMessage('Error fetching test. Please try again.');
      console.error('Error fetching test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setTestQuestions([...testQuestions, '']);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...testQuestions];
    updatedQuestions.splice(index, 1);
    setTestQuestions(updatedQuestions);
  };

  const handleSaveChanges = async () => {
    
    if (testQuestions.some((question) => question.trim() === '')) {
      setEmptyFieldAlert(true);
      setAlertMessage('Fields cannot be empty. Please fill in all the questions.');
      return;
    }

    try {
      setIsLoading(true);
      
      await axios.post('http://localhost:3001/updateTest', {
        testId,
        questions: testQuestions,
      });
      
      setAlertMessage('Test updated successfully!');
    } catch (error) {
      console.error('Error updating test:', error);
      
      setAlertMessage('Error updating test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Tnav {...{ isOpen }} />
      <Hamburger isOpen={isOpen} toggleMenu={toggleMenu} />
      <div>
        <h1>Update test</h1>
        {alertMessage && (
        <div
          className={`alert ${alertMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}
          role='alert'
        >
          {alertMessage}
        </div>
      )}
        {emptyFieldAlert && (
        <div className="alert alert-danger" role="alert">
          Test ID cannot be empty. Please enter a valid Test ID.
        </div>
      )}
        <label htmlFor="testU">Test ID:</label>
        <input
          type="text"
          id="testupdate"
          value={testId}
          onChange={handleTestIdChange}
        />
        <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleSubmit}>Submit</button>
      </div>
      
      {isLoading && <p>Loading...</p>}
      {showTest && testQuestions.length > 0 && (
        <div>
          {testQuestions.map((question, index) => (
            <div key={index}>
              <textarea className='Qbox'
                value={question}
                onChange={(e) => {
                  const updatedQuestions = [...testQuestions];
                  updatedQuestions[index] = e.target.value;
                  setTestQuestions(updatedQuestions);
                }}
              />
              <button className='btn btn-danger' style={{ marginBottom: '10px' }} onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
            </div>
          ))}
          <button className='btn btn-primary' onClick={handleAddQuestion}>Add Question</button>
          <button className='btn btn-success' style={{ marginLeft: '10px' }} onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
     
    </div>
  );
};

export default TestPage;
