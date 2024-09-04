import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Viewtest.css';

function Viewtest() {
  const [testIds, setTestIds] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/testIds')
      .then(response => {
        setTestIds(response.data);
      })
      .catch(error => {
        console.error('Error fetching test IDs:', error);
      });
  }, []);

  const handleTestIdClick = async (testId) => {
    setSelectedTestId(testId);
    try {
      const response = await axios.get(`http://localhost:3001/questions/${testId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="container">
      <div className="test-section">
  <table className="test-table">
    <thead>
      <tr>
    <th>Test ID list</th>
    </tr>
    </thead>
    <tbody>
      {testIds.map(testId => (
        <tr key={testId} onClick={() => handleTestIdClick(testId)}>
          <td>{testId}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <div className="question-section">
       
        <table className="questions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{question}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Viewtest;
