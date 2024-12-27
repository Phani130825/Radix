

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
// import '../styles/SignUp.css';

// const SignUp = ({ setIsLoggedIn, setEmail }) => {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [formData, setFormData] = useState({ email: '', password: '', questions: {} });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const db = getFirestore();

//   const questions = [
//     "Do you understand medical terminology?",
//     "Do you have prior experience in patient care?",
//     "Are you a licensed medical practitioner?",
//   ];

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleQuestionChange = (index, answer) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       questions: {
//         ...prevFormData.questions,
//         [index]: answer,
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const userDocRef = doc(db, 'login', formData.email);
//       const userDoc = await getDoc(userDocRef);

//       if (isSignUp) {
//         // Sign Up Logic
//         if (userDoc.exists()) {
//           setError('Email already exists.');
//           return;
//         }

//         const isDoctor = questions.every((_, index) => formData.questions[index] === 'yes');
//         const newUser = {
//           email: formData.email,
//           password: formData.password,
//           userType: isDoctor ? 'Doctor' : 'User',
//         };

//         await setDoc(userDocRef, newUser);
//         setEmail(formData.email); // Persist email
//         setIsLoggedIn(true);
//         navigate('/upload-data');
//       } else {
//         // Login Logic
//         if (!userDoc.exists() || userDoc.data().password !== formData.password) {
//           setError('Invalid email or password.');
//           return;
//         }

//         setEmail(formData.email); // Persist email
//         setIsLoggedIn(true);
//         navigate('/upload-data');
//       }
//     } catch (err) {
//       console.error('Error interacting with Firestore:', err);
//       setError('An error occurred. Please try again.');
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

//         {isSignUp && (
//           <div className="questionnaire">
//             <h3 className="questionnaire-heading">Medical Background Questionnaire</h3>

//             {questions.map((question, index) => (
//               <div key={index} className="form-group">
//                 <label className="questions">{question}</label>
//                 <div className="radio-group">
//                   <label>
//                     <input
//                       type="radio"
//                       name={`question-${index}`}
//                       value="yes"
//                       onChange={() => handleQuestionChange(index, 'yes')}
//                       required
//                     />
//                     Yes
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name={`question-${index}`}
//                       value="no"
//                       onChange={() => handleQuestionChange(index, 'no')}
//                       required
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

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
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import '../styles/SignUp.css';





const SignUp = ({ setIsLoggedIn, setEmail }) => {
   const [currentStage, setCurrentStage] = useState(0);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', questions: {} });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, "login", formData.email);
      const userDoc = await getDoc(userDocRef);
  
      if (isSignUp) {
        // Sign Up Logic
        if (userDoc.exists()) {
          setError("Email already exists.");
          return;
        }
  
        const isDoctor = questions.every((_, index) => formData.questions[index] === "yes");
        const newUser = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          questions: formData.questions,
          userType: isDoctor ? "Doctor" : "User",
        };
  
        await setDoc(userDocRef, newUser);
        setEmail(formData.email); // Persist email
        setIsLoggedIn(true);
        navigate("/upload-data", { state: { role: newUser.userType } }); // Pass role
      } else {
        // Login Logic
        if (!userDoc.exists() || userDoc.data().password !== formData.password) {
          setError("Invalid email or password.");
          return;
        }
  
        const userType = userDoc.data().userType;
        setEmail(formData.email); // Persist email
        setIsLoggedIn(true);
        navigate("/upload-data", { state: { role: userType } }); // Pass role
      }
    } catch (err) {
      console.error("Error interacting with Firestore:", err);
      setError("An error occurred. Please try again.");
    }
  };
  
  

  const validateStage = () => {
    let valid = true;

    switch (currentStage) {
      case 0:
        if (!formData.email || !formData.password) {
          setError('Please fill out all fields in this stage.');
          valid = false;
        }
        break;
      case 1:
        if (!formData.name || !formData.age || !formData.weight || !formData.height) {
          setError('Please fill out all fields in this stage.');
          valid = false;
        }
        break;
      case 2:
        if (questions.some((_, index) => !formData.questions[index])) {
          setError('Please answer all the questions in this stage.');
          valid = false;
        }
        break;
      default:
        break;
    }

    return valid;
  };

  const handleNext = () => {
    if (validateStage()) {
      setError(''); // Clear any previous error
      setCurrentStage((prev) => prev + 1);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 0:
        return (
          <>
            <h3>Email and Password</h3>
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
          </>
        );
      case 1:
        return (
          <>
            <h3>Personal Details</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
        case 2:
          return (
            <>
              <h3>Medical Background Questionnaire</h3>
              {questions.map((question, index) => (
                <div key={index} className="form-group">
                  <label>{question}</label>
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
            </>
          );
        
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        {renderStage()}
        <div className="button-group">
          {currentStage > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStage((prev) => prev - 1)}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          {currentStage < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
          )}
        </div>
        <p>
          Already have an account?{' '}
          <span className="toggle-auth" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};
  

export default SignUp;