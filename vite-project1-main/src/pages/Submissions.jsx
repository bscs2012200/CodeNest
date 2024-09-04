import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import IDEA from "../components/IDEA.jsx";
import Sidebar from "../components/sidebar.jsx";
import './Submission.css';
import Zablogo from '../assets/szabist.png';

const Submissions = () => {
    const [testIds, setTestIds] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [regNos, setRegNos] = useState([]);
    const [regnames, setnames] = useState([]);
    const [selectedRegNo, setSelectedRegNo] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [duration, setduration] = useState('');
    const [Exam, setExam] = useState('');
    const [section, setsection] = useState('');
     

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
                    console.log(fetchedSubmissions);
                    setSubmissions(fetchedSubmissions);

                    const uniqueRegNos = [...new Set(fetchedSubmissions.map(sub => sub.regno))];
                    const uniqueNames = [...new Set(fetchedSubmissions.map(sub => sub.name))];
                    setRegNos(uniqueRegNos);
                    setnames(uniqueNames);
                })
                .catch(err => {
                    console.error("Error fetching submissions:", err);
                });

            axios.get(`http://localhost:3001/getTestDetails/${selectedTestId}`)
                .then(response => {
                    setQuestions(response.data.questions);
                    setCourseName(response.data.courseName);
                    setsection(response.data.section);
                    setduration(response.data.duration); 
                    setExam(response.data.testType); 
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
        setSelectedRegNo('');
        setSubmissions([]);
        setQuestions([]);
    };

    const handleRegNoChange = (event) => {
        const regNo = event.target.value;
        setSelectedRegNo(regNo);
    };
    

    
    const handleMarksChange = (submissionId, value) => {
        const numericValue = parseFloat(value);
    
        
        const submission = submissions.find(sub => sub._id === submissionId);
        const question = questions.find(q => q._id === submission.questionId);
    
        
        if (question && submission) {
            const maxMarks = question.marks;
    
            
            if (isNaN(numericValue) || numericValue < 0) {
                setMarksGained(prevState => ({
                    ...prevState,
                    [submissionId]: 'Invalid' 
                }));
            } else if (numericValue > maxMarks) {
                setMarksGained(prevState => ({
                    ...prevState,
                    [submissionId]: 'Exceeds Max Marks' 
                }));
            } else {
                setMarksGained(prevState => ({
                    ...prevState,
                    [submissionId]: numericValue
                }));
            }
        }
    };
    
    

    const filteredSubmissions = selectedRegNo 
        ? submissions.filter(submission => submission.regno === selectedRegNo)
        : [];

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

    const validateMarksFilled = () => {
        return Object.values(groupedSubmissions).every(student =>
            student.submissions.every(submission =>
                marksGained[submission._id] !== undefined &&
                marksGained[submission._id] !== 'Invalid' &&
                marksGained[submission._id] !== 'Exceeds Max Marks'
            )
        );
    };

    

    const generatePDF = () => {
        if (!validateMarksFilled()) {
            alert('Please provide marks for all questions before saving as PDF.');
            return;
        }
    
        Object.values(groupedSubmissions).forEach(student => {
            const doc = new jsPDF();
            doc.setFontSize(10); 
        
            
            doc.addImage(Zablogo, 'PNG', 10, 10, 190, 50); 
            doc.setFontSize(12);
            doc.text('Name:', 10, 70); 
            doc.text(student.name, 30, 70); 
            const nameTextX = 24;
            const nameTextY = 70;
            const lineWidth = 65; 
            doc.line(nameTextX, nameTextY + 2, nameTextX + lineWidth, nameTextY + 2); 
            doc.text('Reg #:', 90, 70); 
            const regTextX = 102;
            const regTextY = 70;
            const regWidth = 65; 
            doc.text(student.regno, 105, 70); 
            doc.line(regTextX, regTextY + 2, regTextX + regWidth, regTextY + 2);
            const subTextX = 24;
            const subTextY = 80;
            const subWidth = 65; 
            doc.text('Subject:', 10, 80); 
            doc.text(courseName, 26, 80);
            doc.line(subTextX, subTextY + 2, subTextX + subWidth, subTextY + 2);
            doc.text('Section:', 90, 80); 
            const secTextX = 105;
            const secTextY = 80;
            const secWidth = 25; 
            doc.text(section, 109, 80); 
            doc.line(secTextX, secTextY + 2, secTextX + secWidth, secTextY + 2);
            doc.text('Program:', 10, 90); 
            doc.text('BSCS', 30, 90); 
            const progTextX = 28;
            const progTextY = 90;
            const progWidth = 20; 
            doc.line(progTextX, progTextY + 2, progTextX + progWidth, progTextY + 2);
        
            
            const submissionDate = student.submissions[0].date; 
            doc.text('Date:', 50, 90);
            doc.text(submissionDate, 65, 90); 
            const dateTextX = 62;
            const dateTextY = 90;
            const dateWidth = 30; 
            doc.line(dateTextX, dateTextY + 2, dateTextX + dateWidth, dateTextY + 2);
            doc.text("Duration:", 95, 90);
            doc.text(duration.toString(), 114, 90);
            doc.text("Minutes", 120, 90);
            const durationTextX = 112;
            const durationTextY = 90;
            const durationWidth = 28; 
            doc.line(durationTextX, durationTextY + 2, durationTextX + durationWidth, durationTextY + 2);
            doc.text("Exam:", 145, 90);
            doc.text(Exam, 162, 90);
            const examTextX = 156;
            const examTextY = 90;
            const examWidth = 30; 
            doc.line(examTextX, examTextY + 2, examTextX + examWidth, examTextY + 2);
        
            
            const breakText = (text) => {
                const words = text.split(' ');
                let result = '';
                for (let i = 0; i < words.length; i++) {
                    result += words[i] + ' ';
                    if ((i + 1) % 13 === 0) result += '\n';
                }
                return result.trim();
            };
        
            
            const rules = [
                "Please fill in all the above columns.",
                "Punctuality in the examination should be observed, students be seated at least 5 minutes before the exam time.",
                "Students are not allowed to bring cell phone and any kind of electronic device inside the exam room/hall except simple calculator (if allowed). If they do so, then they should make sure that they are switched off. Otherwise, penalty including 'F' grade could be awarded.",
                "No queries related to the question paper will be entertained after 30 minutes in case of Mid-Term and 1 hour in final exam.",
                "Question papers should be returned with answer script to the concerned faculty.",
                "Impersonation may lead to expulsion from the institute.",
                "Students in possession of any written material related to the course or communicating with fellow students will be awarded 'F' Grade in the Course.",
                "Departure from the exam hall will be permitted 30 minutes after commencement of Mid-Term Exam and 1 hour in case of the Final Exam.",
                "Students will not be permitted to enter in the exam room/hall if he/she is late by more than 30 minutes.",
                "Late comers will not be given extra time.",
                "The decision of the invigilating staff will be final and binding to the students, any argument with invigilators will be liable for disciplinary action by the committee.",
                "All blank pages of the answer sheet should be crossed off by the student at the end of the exam.",
                "All other general rules set by SZABIST regarding exams will be applicable.",
                "All works on the answer sheet should be done with pen except for charts and graphs."
            ];
        
            doc.setFontSize(9); 
            let yPosition = 110;
            rules.forEach((rule, index) => {
                const formattedRule = breakText(rule);
                const ruleLines = doc.splitTextToSize(`• ${formattedRule}`, doc.internal.pageSize.width - 20);
                ruleLines.forEach((line,lineIndex) => {
                    doc.text(line, 10, yPosition);
                    if (index === 2) { 
                        const textWidth = doc.getTextWidth(line);
                        doc.line(10, yPosition + 1, 10 + textWidth, yPosition + 1); 
                    }
                    yPosition += 7;
                });
                
            });
            doc.setFontSize(12); 
        
            
            doc.setFontSize(10);
            const tableStartY = 120;
            const headerHeight = 10;
            const hcolWidths = [10, 20, 24]; 
    
            doc.text('Q#', 143, tableStartY);
            doc.text('Max Marks', 151, tableStartY);
            doc.text('Gained Marks', 171, tableStartY);
    
            doc.rect(140, tableStartY - headerHeight + 2, hcolWidths[0], headerHeight);
            doc.rect(150, tableStartY - headerHeight + 2, hcolWidths[1], headerHeight);
            doc.rect(170, tableStartY - headerHeight + 2, hcolWidths[2], headerHeight);
    
            
            let TPosition = 130;
            const rowHeight = 10;
            const colWidths = [10, 20, 24]; 
    
            let totalMaxMarks = 0;
            let totalGainedMarks = 0;
    
            questions.forEach((question, index) => {
                const gainedMarks = marksGained[student.submissions.find(sub => sub.questionId === question._id)?._id];
            
                
                doc.rect(140, TPosition - rowHeight + 2, colWidths[0], rowHeight);
                doc.rect(150, TPosition - rowHeight + 2, colWidths[1], rowHeight);
                doc.rect(170, TPosition - rowHeight + 2, colWidths[2], rowHeight);
            
                
                doc.text((index + 1).toString(), 143, TPosition); 
                doc.text(question.marks.toString(), 158, TPosition); 
                doc.text(gainedMarks !== undefined ? gainedMarks.toString() : 'Not Provided', 179, TPosition); // Gained marks
            
                
                totalMaxMarks += question.marks;
                if (gainedMarks !== undefined) {
                    totalGainedMarks += parseFloat(gainedMarks); 
                }
            
                TPosition += rowHeight;
            });
            
            
            doc.rect(140, TPosition - rowHeight + 2, colWidths[0], rowHeight);
            doc.rect(150, TPosition - rowHeight + 2, colWidths[1], rowHeight);
            doc.rect(170, TPosition - rowHeight + 2, colWidths[2], rowHeight);
    
            doc.text('Total', 141, TPosition); 
            doc.text(totalMaxMarks.toString(), 158, TPosition); 
            doc.text(totalGainedMarks.toString(), 179, TPosition); 
    
            
            const signatureBoxY = TPosition + 30; 
            const boxWidth = 70;
            const boxHeight = 30;
    
            
            doc.rect(130, 210, boxWidth, boxHeight); 
            doc.text("Instructor's Signature", 147, 236); 
    
            
            const instructorSignatureLineY = 230; 
            doc.line(130 + 10, instructorSignatureLineY, 130 + boxWidth - 10, instructorSignatureLineY); // Draw line inside the box
    
            
            doc.rect(130, 250, boxWidth, boxHeight); 
            doc.text("Invigilator's Signature", 147, 276); 
    
            const invigilatorSignatureLineY = 270; 
            doc.line(130 + 10, invigilatorSignatureLineY, 130 + boxWidth - 10, invigilatorSignatureLineY); // Draw line inside the box
    
            
        
           
            const pageWidth = doc.internal.pageSize.width;
            const margin = 10; 
    
            student.submissions.forEach(submission => {
                questions.forEach(question => {
                    if (question._id === submission.questionId) {
                        
                        doc.addPage();
                        let y = 10; 
    
                        
                        const questionLines = doc.splitTextToSize(`Question: ${question.question}`, pageWidth - 20); 
                        questionLines.forEach(line => {
                            doc.text(line, margin, y);
                            y += 7; 
                        });
    
                        
                        doc.text(`Max Marks: ${question.marks}`, margin, y);
                        y += 7;
                        doc.text(`Gained Marks: ${marksGained[submission._id]}`, margin, y);
                        y += 7;
    
                        
                        const srcLines = doc.splitTextToSize(`${submission.src}`, pageWidth - 20); 
    
                        
                        const boxHeight = srcLines.length * 7 + 14; 
                        doc.rect(margin, y, pageWidth - 20, boxHeight);
                        y += 7; 
    
                        srcLines.forEach(line => {
                            doc.text(line, margin + 5, y); 
                            y += 7; 
                        });
    
                        y += 14; 
                    }
                });
            });
        
            const filename = `${student.name}_${student.regno}.pdf`;
            doc.save(filename);
            setSelectedRegNo('');
        });
    };
    
    
    
    
    

    return (
        <div className='c-container'>
            <Sidebar />
            <div className='cntn'>
                <h2>Select Test ID</h2>
                <select className="test-dropdown" onChange={handleTestIdChange} value={selectedTestId}>
                    <option value="">Select Test ID</option>
                    {testIds.map(testId => (
                        <option key={testId} value={testId}>{testId}</option>
                    ))}
                </select>

                {selectedTestId && !selectedRegNo && (
                    <>
                        <h4>Please Select a Registration Number</h4>
  <table className="regno-table">
                            <thead>
                                <tr>
                                    <th>Registration Number</th>
                                    <th>Student Name</th>  
                                </tr>
                            </thead>
                            <tbody>
                                {regNos.map((regno, index) => (
                                    <tr key={regno} onClick={() => handleRegNoChange({ target: { value: regno } })}>
                                        <td>{regno}</td>
                                        <td>{regnames[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
        
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
                                                <label htmlFor={`marksGained-${submission._id}`}><strong>Gained Marks:</strong></label>
                                                <input
    type="number"
    min="0" // Ensure that negative values are not allowed
    className='numinput'
    value={marksGained[submission._id] !== undefined ? marksGained[submission._id] : ''}
    onChange={(e) => handleMarksChange(submission._id, e.target.value)}
    onWheel={(e) => e.preventDefault()}
/>

                                                {/* Display error message if there is one */}
                                                {marksGained[submission._id] === 'Invalid' && <p className="error">Gained marks cannot be negative or non-numeric.</p>}
                                                {marksGained[submission._id] === 'Exceeds Max Marks' && <p className="error">Gained marks cannot exceed the maximum marks.</p>}
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
                             {questions.length > 0 && (
                    <button style={{marginLeft:'40%', marginTop:'10px'} } className='btn btn-danger' onClick={generatePDF}>Save as PDF</button>
                )}
                        </div>
                    ))
                ) : (
                    <p></p>
                )}

                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Submissions;