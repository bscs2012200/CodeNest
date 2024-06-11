import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import './UpdateQuestion.css';
import Cookies from 'js-cookie';
import { Modal, Button } from 'react-bootstrap';
function UpdateQuestion() {
  const [questions, setQuestions] = useState([]);
  const [editedQuestion, setEditedQuestion] = useState(null);
  const [filterValue, setFilterValue] = useState('c'); 
  const [email, setEmail] = useState('');
  const [updateAlert, setUpdateAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [questionToDeleteId, setQuestionToDeleteId] = useState(null);

  useEffect(() => {
    const fetchEmailFromCookies = async () => {
      try {
        const mail = Cookies.get('email');
        setEmail(mail);
      } catch (error) {
        console.error('Error fetching email from cookies:', error);
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

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/ques');
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionClick = (question) => {
    setEditedQuestion(question);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const updateResponse = await axios.put(`http://localhost:3001/ques/${editedQuestion._id}`, editedQuestion);
      console.log('Question updated:', updateResponse.data);
      setUpdateAlert(true);  fetchQuestions(); 
      setEditedQuestion(null); 
      setTimeout(() => {
        setUpdateAlert(false); 
      }, 3000);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };
  const openConfirmationModal = (id) => {
    setShowConfirmationModal(true);
    setQuestionToDeleteId(id);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setQuestionToDeleteId(null);
  };

  const confirmDelete = () => {
    if (questionToDeleteId) {
      handleDelete(questionToDeleteId);
      closeConfirmationModal();
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedQuestion(prevQuestion => ({
      ...prevQuestion,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/ques/${id}`);
      setDeleteAlert(true); 
      fetchQuestions(); 
      setEditedQuestion(null);
      setTimeout(() => {
        setDeleteAlert(false);  
      }, 3000);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleCloseCard = () => {
    setEditedQuestion(null);
  };
  
  const languageFilteredQuestions = filterValue === 'all' ? questions : questions.filter(question => question.language === filterValue);
  const filteredQuestions = languageFilteredQuestions.filter(question => question.email === email);

  return (
    <div className="c-container">
      <Sidebar />
      <div style={{ overflowY: 'auto', flex: '1', padding: '20px' }} className="question-section">
        <h1>Question Bank</h1>
        
        {updateAlert && (
              <div className="alert alert-success" role="alert">
                Question updated successfully!
              </div>
            )}
  
            
            {deleteAlert && (
              <div className="alert alert-danger" role="alert">
                Question deleted successfully!
              </div>
            )}
        
        <div className="filter-dropdown">
          <label htmlFor="language-filter">Filter by Language:</label>
          <select id="language-filter" value={filterValue} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>
  
        
        <Modal show={showConfirmationModal} onHide={closeConfirmationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeConfirmationModal}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
  
        
        {editedQuestion && (
          <div className='updatecard'>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseCard}></button>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="editedQuestion">Question:</label>
              <input type="text" id="editedQuestion" name="question" value={editedQuestion.question} onChange={handleInputChange} />
              <label htmlFor="editedLanguage">Language:</label>
              <select id="editedLanguage" name="language" value={editedQuestion.language} onChange={handleInputChange}>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <label htmlFor="editedMarks">Marks:</label>
              <input type="text" id="editedMarks" name="marks" value={editedQuestion.marks} onChange={handleInputChange} />
              <button className='updatebtn' type="submit">Update Question</button>
            </form>
  
            
            <Button className='deletebtn' onClick={() => openConfirmationModal(editedQuestion._id)}>Delete</Button>
  
        
          </div>
        )}
  
       
        <table className="questions-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Language</th>
              <th>Marks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map(question => (
              <tr key={question._id}>
                <td>{question.question}</td>
                <td>{question.language}</td>
                <td>{question.marks}</td>
                <td>
                  <button className='btn btn-primary' onClick={() => handleQuestionClick(question)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

export default UpdateQuestion;
