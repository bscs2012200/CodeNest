import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Viewtest.css';
import Sidebar from '../components/sidebar';
import Cookies from 'js-cookie';
import { Modal, Button, Alert } from 'react-bootstrap';

function TestListPage() {
  const [testIds, setTestIds] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [examDetails, setExamDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestDetails, setEditedTestDetails] = useState({
    testType: '',
    language: '',
    courseName: '',
    duration: '',
    section: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [editedQuestion, setEditedQuestion] = useState({ question: '', marks: '' });
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
const [deletingQuestionIndex, setDeletingQuestionIndex] = useState(-1);

  const email = Cookies.get('email');

  useEffect(() => {
    if (email) {
      axios.get('http://localhost:3001/testIds', {
        params: { email },
      })
        .then(response => {
          setTestIds(response.data);
        })
        .catch(error => {
          console.error('Error fetching test IDs:', error);
        });
    }
  }, [email]);

  useEffect(() => {
    // Reset editingQuestionIndex when selectedTestId changes
    setEditingQuestionIndex(-1);
  }, [selectedTestId]);

  const confirmDeleteQuestion = async (questionIndex) => {
    try {
      // Delete the question using the questionIndex
      const updatedQuestions = [...examDetails.questions];
      updatedQuestions.splice(questionIndex, 1);
  
      const totalMarks = calculateTotalMarks(updatedQuestions); // Recalculate total marks
  
      await axios.put(`http://localhost:3001/deleteQuestion/${selectedTestId}`, {
        updatedQuestions,
        totalMarks
      });
  
      // Update the exam details state with the updated questions and total marks
      setExamDetails(prevExamDetails => ({
        ...prevExamDetails,
        questions: updatedQuestions,
        totalMarks: totalMarks
      }));
  
      // Close the delete confirmation modal
      closeDeleteConfirmationModal();
    } catch (error) {
      console.error('Error deleting question:', error);
      // Handle error
    }
  };
  

  const openDeleteConfirmationModal = (index) => {
    setDeletingQuestionIndex(index);
    setShowDeleteConfirmationModal(true);
  };
  
  // Function to close delete confirmation modal
  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
    setDeletingQuestionIndex(-1);
  };
  
  // Modify the handleDeleteQuestionClick function to open the delete confirmation modal
  const handleDeleteQuestionClick = (index) => {
    openDeleteConfirmationModal(index);
  };

  const handleTestIdChange = async (event) => {
    const testId = event.target.value;
    setSelectedTestId(testId);
    try {
      const response = await axios.get(`http://localhost:3001/questions/${testId}`);
      setExamDetails(response.data);
      handleCloseUpdateCard();
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  const handleAddQuestionClick = () => {
    const newQuestion = { question: '', marks: '' };
  
    // Update the state to add the new question
    setExamDetails(prevExamDetails => ({
      ...prevExamDetails,
      questions: [...prevExamDetails.questions, newQuestion],
    }));
  };

 
  
  const handleEditButtonClick = () => {
    setIsEditing(true);
    setEditedTestDetails({
      testType: examDetails.testType,
      language: examDetails.language,
      courseName: examDetails.courseName,
      duration: examDetails.duration,
      section: examDetails.section,
      
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedTestDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Clear previous errors
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.put(`http://localhost:3001/updateTest/${selectedTestId}`, editedTestDetails);

      // If update is successful, show success message
      setSuccessMessage(response.data.message);

      const updatedTest = response.data.updatedTest;

      // Update exam details
      setExamDetails({
        ...examDetails,
        testType: updatedTest.testType,
        language: updatedTest.language,
        courseName: updatedTest.courseName,
        duration: updatedTest.duration,
        section: updatedTest.section,
      });

      setIsEditing(false);

      // Set timeout for success message to disappear after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      // If there are validation errors, show error messages for each field
      if (error.response && error.response.status === 400 && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        // If there's another error, show a general error message
        setErrorMessage('Error updating test');
      }
    }
  };

  const openConfirmationModal = (id) => {
    setSelectedTestId(id);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedTestId('');
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/deleteTest/${selectedTestId}`);
      setExamDetails(null);
      setIsEditing(false);
      // Remove the deleted test ID from the testIds array
      setTestIds(testIds.filter(id => id !== selectedTestId));
      closeConfirmationModal();
      // Show success message for test deletion
      setSuccessMessage('Test deleted successfully');

      // Set timeout for success message to disappear after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error deleting test:', error);
      // Show error message for test deletion
      setErrorMessage('Error deleting test');
    }
  };

  const handleCloseUpdateCard = () => {
    setIsEditing(false);
  };

  const handleEditQuestionClick = (index) => {
    setEditingQuestionIndex(index);
    setEditedQuestion({
      question: examDetails.questions[index].question,
      marks: examDetails.questions[index].marks,
    });
  };

  const handleSaveQuestionClick = async (questionIndex) => {
    if (parseInt(editedQuestion.marks) < 1) {
      setErrorMessage('Marks cannot be less than 1');
      return;
    }
    try {
      const updatedQuestions = [...examDetails.questions];
      updatedQuestions[questionIndex] = {
        question: editedQuestion.question,
        marks: editedQuestion.marks
      };
  
      const totalMarks = calculateTotalMarks(updatedQuestions); // Calculate total marks on the frontend
  
      await axios.put(`http://localhost:3001/updateQuestion/${selectedTestId}`, {
        questionIndex,
        updatedQuestion: updatedQuestions[questionIndex],
        totalMarks: totalMarks 
      });
  
      setExamDetails(prevExamDetails => ({
        ...prevExamDetails,
        questions: updatedQuestions,
        totalMarks: totalMarks // Update total marks on the frontend
      }));
  
      // Reset editing state
      setEditingQuestionIndex(-1);
      setEditedQuestion({ question: '', marks: '' });
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        // If it's not a validation error, show a general error message
        setErrorMessage('Question or Marks cannot be empty');
      }
    }
  };
  

  const handleCopyTestId = (testId) => {
    navigator.clipboard.writeText(testId)
      .then(() => {
        alert('Test ID copied to clipboard', testId);
        // Optionally, you can provide feedback to the user that the text has been copied
      })
      .catch((error) => {
        console.error('Error copying test ID to clipboard:', error);
        // Handle error if unable to copy to clipboard
      });
  };

  // Function to calculate total marks
  const calculateTotalMarks = (questions) => {
    let totalMarks = 0;
    questions.forEach(question => {
      totalMarks += parseInt(question.marks);
    });
    return totalMarks;
  };

  return (
    <div className="c-container">
      <Sidebar />
      <div className='cntn'>
        <div className="test-section">
          <h2>Select Test ID</h2>
          <select className="test-dropdown" onChange={handleTestIdChange} value={selectedTestId}>
            <option value="">Select Test ID</option>
            {testIds.map(testId => (
              <option key={testId} value={testId}>{testId}</option>
            ))}
          </select>
          <h4 onClick={() => handleCopyTestId(selectedTestId)} className='fa fa-copy'></h4>
        </div>
        {isEditing && (
          <div className="updatecard">
            <button style={{marginLeft:'99%'}} type="button" className="btn-close" aria-label="Close" onClick={handleCloseUpdateCard}></button>
            <h2>Edit Test Details</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="testType">Test Type:</label>
                <select id="testType" name="testType" value={editedTestDetails.testType} onChange={handleInputChange}>
                  <option value="">Select Test Type</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Mid exam">Mid exam</option>
                  <option value="Final exam">Final exam</option>
                </select>
                {errors.testType && <Alert variant="danger">{errors.testType}</Alert>}
              </div>
              <div className="form-group">
                <label htmlFor="language">Language:</label>
                <select id="language" name="language" value={editedTestDetails.language} onChange={handleInputChange}>
                  <option value="">Select Language</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>
                {errors.language && <Alert variant="danger">{errors.language}</Alert>}
              </div>
              <div className="form-group">
                <label htmlFor="courseName">Course Name:</label>
                <input type="text" id="courseName" name="courseName" value={editedTestDetails.courseName} onChange={handleInputChange} />
                {errors.courseName && <Alert variant="danger">{errors.courseName}</Alert>}
              </div>
              <div className="form-group">
                <label htmlFor="duration">Time Duration:</label>
                <input type="text" id="duration" name="duration" value={editedTestDetails.duration} onChange={handleInputChange} />
                {errors.duration && <Alert variant="danger">{errors.duration}</Alert>}
              </div>
              <div className="form-group">
                <label htmlFor="section">Section:</label>
                <input type="text" id="section" name="section" value={editedTestDetails.section} onChange={handleInputChange} />
                {errors.section && <Alert variant="danger">{errors.section}</Alert>}
              </div>
              <Button type="submit">Update Test</Button>
              <Button style={{marginTop: '10px'}} variant="danger" onClick={() => openConfirmationModal(selectedTestId)}>Delete Test</Button>
            </form>
          </div>
        )}
        <Modal show={showConfirmationModal} onHide={closeConfirmationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this test?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeConfirmationModal}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showDeleteConfirmationModal} onHide={closeDeleteConfirmationModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeDeleteConfirmationModal}>Cancel</Button>
    <Button variant="danger" onClick={() => confirmDeleteQuestion(deletingQuestionIndex)}>Delete</Button>
  </Modal.Footer>
</Modal>
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')} >
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
            {errorMessage}
          </Alert>
        )}
        {examDetails && (
          <div className="test-details-section">
            <h2>Test Details</h2>
            <table className='test-table'>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Language</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Time Duration</th>
                  <th>Total marks</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{examDetails.testType}</td>
                  <td>{examDetails.language}</td>
                  <td>{examDetails.email}</td>
                  <td>{examDetails.courseName}</td>
                  <td>{examDetails.duration} Minutes</td>
                  <td>{examDetails.totalMarks}</td>
                  <td>{examDetails.section}</td>
                  <td>
                    <button className='btn btn-primary' onClick={handleEditButtonClick}>Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {examDetails && (
          <div className="question-section">
            <h2>Questions</h2>
            <table className="questions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {examDetails.questions.map((questionObj, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {editingQuestionIndex === index ? (
                        <input
                          className='Qedit'
                          type="text"
                          value={editedQuestion.question}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
                        />
                      ) : (
                        questionObj.question
                      )}
                    </td>
                    <td>
                      {editingQuestionIndex === index ? (
                        <input
                          type="text"
                          value={editedQuestion.marks}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, marks: e.target.value })}
                        />
                      ) : (
                        questionObj.marks
                      )}
                    </td>
                    <td>
                      {editingQuestionIndex === index ? (
                        <button className='btn btn-success' onClick={() => handleSaveQuestionClick(index)}>Save</button>
                      ) : (
                        <h4 style={{marginLeft:'10px'}} onClick={()=> handleEditQuestionClick(index)} class="fas fa-edit"></h4>
                      )}
                      <h4 style={{marginLeft:'10px'}} onClick={()=> handleDeleteQuestionClick(index)} class="fa fa-trash"></h4>
                    </td>
                  </tr>
                ))}
              </tbody>
              
            </table>
            
            <button style={{marginLeft:'30px',marginTop:'30px'}} className="btn btn-primary" onClick={handleAddQuestionClick}><i class='fa fa-plus'></i>Add Question Field</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestListPage;

