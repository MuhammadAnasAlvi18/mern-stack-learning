import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

// API base URL - ensure no trailing slash
const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

function App() {
  const [values, setValues] = useState({
    name: "",
    age: "",
    standard: ""
  })

  const [students, setStudents] = useState([])

  const [message, setMessage] = useState({
    text: "",
    type: "" // "success" or "error"
  })

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/get-students`);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setMessage({
        text: "Failed to fetch students",
        type: "error"
      });
    }
  }

  useEffect(()=>{
    fetchStudents();
  }, [])

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }
  
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${API_URL}/api/add-student`, values);
      setMessage({
        text: "Student added successfully!",
        type: "success"
      });
      // Clear form
      setValues({
        name: "",
        age: "",
        standard: ""
      });
      // Refresh student list
      fetchStudents();
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Failed to add student",
        type: "error"
      });
    }
  }

  return (
    <div className='add-student'>
      <h2>Add New Student</h2>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleAddStudent} className="add-student-form">
        <input 
          type="text" 
          name="name"
          placeholder="Name" 
          value={values.name}
          onChange={handleChange} 
          required
        />
        <input 
          type="number" 
          name="age"
          placeholder="Age" 
          value={values.age}
          onChange={handleChange} 
          required
        />
        <input 
          type="text" 
          name="standard"
          placeholder="Standard" 
          value={values.standard}
          onChange={handleChange} 
          required
        />
        <button type="submit">Add Student</button>
      </form>
      <div className="student-list">
        <h2>Student List</h2>
        {students.length > 0 ? (
          <ul>
            {students.map((student, index) => (
              <li key={student._id || index}>
                Name: {student.name}, Age: {student.age}, Standard: {student.standard}
              </li>
            ))}
          </ul>
        ) : (
          <p>No students found</p>
        )}
      </div>
    </div>
  )
}

export default App
