import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Std_reg from './pages/Std_reg.jsx';
import Std_login from './pages/Std_login.jsx';
import Std_Dash from './pages/Std_Dash.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import LiveIDE from './components/LiveIDE.jsx';
import OpenIDE from './pages/OpenIDE.jsx'
import TestPage from './pages/TestPage.jsx';
import Home from './pages/Home.jsx';
import Viewtest from './pages/Viewtest.jsx';
import CreateTestPage from './pages/CreateTestPage.jsx';
import TestAttemptPage2 from './pages/TestAttemptPage2.jsx';
import CreateQuestion from './pages/CreateQuestion.jsx';
import QuestionsList from './pages/QuestionsList.jsx';
import TestList from './pages/Testlist.jsx';
import UpdateQuestion from './pages/UpdateQUestion.jsx';
import TestAttemptPage from './pages/TestAttemptPage.jsx';
import TestDetailsPage from './pages/TestDetailsPage.jsx';
import TestListPage from './pages/TestListPage.jsx';
import Submissions from './pages/Submissions.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
function App() {
 return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/studentreg" element={<Std_reg />} />
        <Route path="/studentlogin" element={<Std_login />} /> 
        <Route path="/studentdash" element={<Std_Dash />} /> 
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/liveide" element={<LiveIDE />} />
        <Route path="/openIDE" element={<OpenIDE />} />
        <Route path="/TestPage" element={<TestPage />} />
        <Route path="/Viewtest" element={<Viewtest />} />
        <Route path="/createtest" element={<CreateTestPage />} />
        <Route path="/ide" element={<TestList />} />
        <Route path="/listid" element={<TestListPage />} />
        <Route path="/Testattempt" element={<TestAttemptPage2 />} />
        <Route path="/createquestion" element={<CreateQuestion />} />
        <Route path="/up" element={<UpdateQuestion />} />
        <Route path="/questionlist" element={<QuestionsList />} />
        <Route path="/ot" element={<TestAttemptPage />} />
        <Route path="/at" element={<TestDetailsPage />} />
        <Route path="/s" element={<Submissions/>} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />

      </Routes>
    </Router>
 );
}

export default App;