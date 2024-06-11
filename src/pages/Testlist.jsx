import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
function TestList() {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState('');
  const [firstQuestionId, setFirstQuestionId] = useState('');

  const handleTestIdChange = (e) => {
    setTestId(e.target.value);
  };

  const fetchData = async () => {
    try {
      const responseTests = await axios.get(`http://localhost:3001/tests/${testId}`);
      setTests(responseTests.data);
      const firstId = responseTests.data.test.questionIds[0];
      setFirstQuestionId(firstId);

      const allQuestions = [];

      for (const questionId of responseTests.data.test.questionIds) {
        const responseQuestions = await axios.get(`http://localhost:3001/ques/${questionId}`);
        allQuestions.push(responseQuestions.data.question);
        console.log('Question ID:', questionId);
        console.log('Question Details:', responseQuestions.data);
      }

      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className='c-container'> 
      <Sidebar />
      <div className='testing'>
      <input
        type="text"
        id="testupdate"
        value={testId}
        onChange={handleTestIdChange}
      />
      <button onClick={fetchData} className='btn btn-primary'>Fetch Data</button>

      {/* {tests && tests.test && (
        <div className="test-section">
          <table className='test-table'>
            <tbody>
              <tr>
                <th>Test ID:</th>
                <th>Teacher Email:</th>
                {tests.test.questionIds.map((questionId, index) => (
                  <th key={index}>Question ID {index + 1}</th>
                ))}
              </tr>
              <tr>
                <td>{tests.test.testId}</td>
                <td>{tests.test.teacherEmail}</td>
                {tests.test.questionIds.map((questionId, index) => (
                  <td key={index}>{questionId}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )} */}

      {/* Render questions */}
      <div className='question-section'>
        <h2>Question Details</h2>
        <table className='questions-table'>
          <tbody>
            <tr>
              {/* <th>Email:</th>
              <th>Language:</th> */}
              <th>Question</th>
              <th>Marks:</th>
            </tr>
            {questions.map((question, index) => (
              <tr key={index}>
                {/* <td>{question.email}</td>
                <td>{question.language}</td> */}
                
                <td>{question.question}</td>
                <td>{question.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default TestList;