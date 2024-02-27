
import './App.css'
import Login from './components/Login'
import Home from './components/Principal/Home'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Student from './components/Student/Student'
import Teacher from './components/Teacher/Teacher';
import StudentList from './components/Teacher/StudentList';
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/principal" element={<div className="home1">
          <Home />
        </div>}>
        </Route>
        <Route path="/login" element={<div className='login-page1'>
          <Login />
        </div>}>

        </Route>
        <Route path="/student" element={
          <Student />}>
        </Route>
        <Route path="/teacher" element={
          <Teacher />}>
        </Route>
        <Route path="/studentlist" element={
          <StudentList />}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
