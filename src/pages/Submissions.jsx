import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import IDEA from "../components/IDEA.jsx";
import Sidebar from "../components/sidebar.jsx";
import './Submission.css';

const Submissions = () => {
    const [testIds, setTestIds] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [regNos, setRegNos] = useState([]);
    const [selectedRegNo, setSelectedRegNo] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const email = Cookies.get('email');
    const [marksGained, setMarksGained] = useState({});


    useEffect(() => {
        if (email) {
            axios.get('http://localhost:3001/testIds', { params: { email } })
                .then(response => {
                    setTestIds(response.data);
                })
                .catch(error => {
                    console.error('Error fetching test IDs:', error);
                });
        }
    }, [email]);

    useEffect(() => {
        if (selectedTestId) {
            axios.get(`http://localhost:3001/testattempts/${selectedTestId}`)
                .then(res => {
                    const fetchedSubmissions = res.data;
                    setSubmissions(fetchedSubmissions);

                    // Extract unique registration numbers
                    const uniqueRegNos = [...new Set(fetchedSubmissions.map(sub => sub.regno))];
                    setRegNos(uniqueRegNos);
                })
                .catch(err => {
                    console.error("Error fetching submissions:", err);
                });

            axios.get(`http://localhost:3001/getTestDetails/${selectedTestId}`)
                .then(response => {
                    setQuestions(response.data.questions);
                })
                .catch(error => {
                    console.error('Error fetching test details:', error);
                    setErrorMessage('Error fetching test details.');
                });
        }
    }, [selectedTestId]);

    const handleTestIdChange = (event) => {
        const testId = event.target.value;
        setSelectedTestId(testId);
        setSelectedRegNo(''); // Reset selected registration number
        setSubmissions([]);
        setQuestions([]);
    };

    const handleRegNoChange = (event) => {
        const regNo = event.target.value;
        setSelectedRegNo(regNo);
    };

    // Filter submissions based on selected registration number
    const filteredSubmissions = selectedRegNo 
        ? submissions.filter(submission => submission.regno === selectedRegNo)
        : [];

    // Group submissions by registration number
    const groupedSubmissions = filteredSubmissions.reduce((acc, submission) => {
        if (!acc[submission.regno]) {
            acc[submission.regno] = {
                name: submission.name,
                regno: submission.regno,
                submissions: []
            };
        }
        acc[submission.regno].submissions.push(submission);
        return acc;
    }, {});


    const handleMarksChange = (submissionId, value) => {
        setMarksGained(prevState => ({
            ...prevState,
            [submissionId]: value
        }));
    };

    

    return (
        <div className='c-container'>
            <Sidebar/>
        <div className='cntn'>
            <h2>Select Test ID</h2>
            <select className="test-dropdown" onChange={handleTestIdChange} value={selectedTestId}>
                <option value="">Select Test ID</option>
                {testIds.map(testId => (
                    <option key={testId} value={testId}>{testId}</option>
                ))}
            </select>

            {selectedTestId && (
                <>
                    <h2>Select Registration Number</h2>
                    <select className="regno-dropdown" onChange={handleRegNoChange} value={selectedRegNo}>
                        <option value="">Select Registration Number</option>
                        {regNos.map(regno => (
                            <option key={regno} value={regno}>{regno}</option>
                        ))}
                    </select>
                </>
            )}

            {Object.keys(groupedSubmissions).length > 0 ? (
                Object.values(groupedSubmissions).map(student => (
                    <div key={student.regno} className="student-submissions">
                        <p><strong>Student Name:</strong> {student.name}</p>
                        <p><strong>Reg No:</strong> {student.regno}</p>
                        {student.submissions.map(submission => (
                            <div key={submission._id} className="submission">
                                {questions.map(question => (
                                    question._id === submission.questionId && (
                                        <div key={question._id}>
                                            <p><strong>Question:</strong> {question.question}</p>
                                            <p><strong>Max Marks:</strong> {question.marks}</p>
                                            <label htmlFor="MarksGained"><strong>Gained Marks:</strong></label>
                                            <input type="number" id={`marksGained-${submission._id}`} className="gained-marks-input" value={marksGained[submission._id] || ''} onChange={(e) => handleMarksChange(submission._id, e.target.value)} 
/>

                                        </div>
                                    )
                                ))}
                                {selectedRegNo && (
                                    <IDEA
                                        extension={submission.extension}
                                        filename={submission.filename}
                                        language={submission.language}
                                        testId={submission.testId}
                                        regno={submission.regno}
                                        questionId={submission.questionId}
                                        item={submission.question}
                                        src={submission.src}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>Please select a student registration.</p>
            )}

            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
        </div>
    );
};

export default Submissions;
