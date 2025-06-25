import { useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {setUser} = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const res = await axiosInstance.post('/signup', formData);
        setUser(res.data);
        setMessage("User Created Successfully");
        setError('');
        setLoading(false);
        setFormData({fullname: '', email: '', password: ''});
    } catch (error) {
        console.log(error.message);
        setError(error.response.data.message);
        setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us today! Please fill out the form to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullname" className="form-label">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={formData.fullname}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a password"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="btn btn-primary">
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;