import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function Home() {
  return (
    <div>
      <h1>Web Attendance System</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/attendance">Attendance</Link>
      </nav>
      <p>Welcome to the attendance management system</p>
    </div>
  )
}

function Attendance() {
  return (
    <div>
      <h1>Attendance Management</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/attendance">Attendance</Link>
      </nav>
      <p>Attendance page - coming soon</p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/attendance" element={<Attendance />} />
    </Routes>
  )
}

export default App