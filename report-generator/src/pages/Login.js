

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
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../styles/SignUp.css';

const Login = ({ setIsLoggedIn, setEmail }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, "login", formData.email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists() || userDoc.data().password !== formData.password) {
        setError("Invalid email or password.");
        return;
      }

      const userType = userDoc.data().userType;
      setEmail(formData.email); // Persist email
      setIsLoggedIn(true);
      navigate("/upload-data", { state: { role: userType } }); // Pass role
    } catch (err) {
      console.error("Error interacting with Firestore:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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
        <div className="button-group">
          <button type="submit" className="btn-primary">
            Login
          </button>
        </div>
        <p>
          Don't have an account?{' '}
          <span className="toggle-auth" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;


