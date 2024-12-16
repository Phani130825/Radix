

// import React, { useState } from 'react';
// import '../styles/Login.css';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const users = JSON.parse(localStorage.getItem('users')) || [];

//     // Check if email and password match
//     const user = users.find(
//       (user) => user.email === formData.email && user.password === formData.password
//     );

//     if (user) {
//       setSuccess('Login successful!');
//       setError('');
//       // Redirect or proceed to the next page
//     } else {
//       setError('Invalid email or password.');
//       setSuccess('');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Sign In</h2>
//       <form onSubmit={handleSubmit} className="login-form">
//         {error && <p className="error">{error}</p>}
//         {success && <p className="success">{success}</p>}
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Sign In</button>
//         <p>Don't have an account? <a href="/signup">Sign Up</a></p>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email and password match
    const user = users.find(
      (user) => user.email === formData.email && user.password === formData.password
    );

    if (user) {
      setIsLoggedIn(true);
      navigate('/upload-data');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign In</button>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
};

export default Login;
