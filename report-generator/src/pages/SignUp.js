

// import React, { useState } from 'react';
// import '../styles/SignUp.css';

// const SignUp = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const users = JSON.parse(localStorage.getItem('users')) || [];

//     // Check if email already exists
//     const existingUser = users.find((user) => user.email === formData.email);
//     if (existingUser) {
//       setError('Email already exists. Please use a different email.');
//       setSuccess('');
//       return;
//     }

//     // Add new user to localStorage
//     users.push(formData);
//     localStorage.setItem('users', JSON.stringify(users));
//     setSuccess('Account created successfully! You can now log in.');
//     setError('');
//     setFormData({ name: '', email: '', password: '' }); // Reset form
//   };

//   return (
//     <div className="signup-container">
//       <h2>Create an Account</h2>
//       <form onSubmit={handleSubmit} className="signup-form">
//         {error && <p className="error">{error}</p>}
//         {success && <p className="success">{success}</p>}
//         <div className="form-group">
//           <label htmlFor="name">Name</label>
//           <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
//         </div>
//         <button type="submit" className="btn btn-primary">Sign Up</button>
//         <p>Already have an account? <a href="/login">Sign In</a></p>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/SignUp.css';

// const SignUp = ({ setIsLoggedIn }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const users = JSON.parse(localStorage.getItem('users')) || [];

//     // Check if user already exists
//     if (users.some((user) => user.email === formData.email)) {
//       setError('Email already exists.');
//       return;
//     }

//     // Save user and redirect
//     users.push(formData);
//     localStorage.setItem('users', JSON.stringify(users));
//     setIsLoggedIn(true);
//     navigate('/upload-data');
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit} className="signup-form">
//         {error && <p className="error">{error}</p>}
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
//         <button type="submit" className="btn btn-primary">Sign Up</button>
//         <p>Already have an account? <a href="/login">Sign In</a></p>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/SignUp.css'; // Use a combined CSS file for styling

// const SignUp = ({ setIsLoggedIn }) => {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const users = JSON.parse(localStorage.getItem('users')) || [];

//     if (isSignUp) {
//       // Sign Up Logic
//       if (users.some((user) => user.email === formData.email)) {
//         setError('Email already exists.');
//         return;
//       }
//       users.push(formData);
//       localStorage.setItem('users', JSON.stringify(users));
//       setIsLoggedIn(true);
//       navigate('/upload-data');
//     } else {
//       // Login Logic
//       const user = users.find(
//         (user) =>
//           user.email === formData.email && user.password === formData.password
//       );
//       if (user) {
//         setIsLoggedIn(true);
//         navigate('/upload-data');
//       } else {
//         setError('Invalid email or password.');
//       }
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         {error && <p className="error">{error}</p>}
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
//         <button type="submit" className="btn btn-primary">
//           {isSignUp ? 'Sign Up' : 'Sign In'}
//         </button>
//         <p>
//           {isSignUp
//             ? "Already have an account? "
//             : "Don't have an account? "}
//           <span
//             className="toggle-auth"
//             onClick={() => {
//               setError('');
//               setIsSignUp(!isSignUp);
//             }}
//           >
//             {isSignUp ? 'Sign In' : 'Sign Up'}
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

const SignUp = ({ setIsLoggedIn }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', questions: {} });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const questions = [
   
    "Do you understand medical terminology?",
    "Do you have prior experience in patient care?",
    "Are you a licensed medical practitioner?",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, answer) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      questions: {
        ...prevFormData.questions,
        [index]: answer,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (isSignUp) {
      // Sign Up Logic
      if (users.some((user) => user.email === formData.email)) {
        setError('Email already exists.');
        return;
      }

      // Determine user type based on questionnaire answers
      const isDoctor = questions.every((_, index) => formData.questions[index] === 'yes');
      const newUser = {
        ...formData,
        userType: isDoctor ? 'Doctor' : 'User',
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      setIsLoggedIn(true);
      navigate('/upload-data');
    } else {
      // Login Logic
      const user = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );
      if (user) {
        setIsLoggedIn(true);
        navigate('/upload-data');
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      
      

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
        
        {isSignUp && (
          <div className="questionnaire">
          <h3 className="questionnaire-heading">Medical Background Questionnaire</h3>

            {questions.map((question, index) => (
              <div key={index} className="form-group">
                <label className='questions'>{question}</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="yes"
                      onChange={() => handleQuestionChange(index, 'yes')}
                      required
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="no"
                      onChange={() => handleQuestionChange(index, 'no')}
                      required
                    />
                    No
                  </label>
                </div>
              </div>
            ))}
          
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <p>
          {isSignUp
            ? "Already have an account? "
            : "Don't have an account? "}
          <span
            className="toggle-auth"
            onClick={() => {
              setError('');
              setIsSignUp(!isSignUp);
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

