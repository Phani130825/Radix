import React from 'react';

const PasswordStrengthBar = ({ password }) => {
  const getStrengthScore = (password) => {
    let score = 0;
    if (!password) return score;

    // Length check
    if (password.length >= 8) score++;
    // Contains number
    if (/\d/.test(password)) score++;
    // Contains lowercase letter
    if (/[a-z]/.test(password)) score++;
    // Contains uppercase letter
    if (/[A-Z]/.test(password)) score++;
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const getStrengthText = (score) => {
    switch (score) {
      case 0: return 'Too Short';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  const score = getStrengthScore(password);
  const strengthText = getStrengthText(score);

  return (
    <div className="password-strength">
      <div className={`strength-indicator strength-${score}`}></div>
      <span className="strength-message">{strengthText}</span>
    </div>
  );
};

export default PasswordStrengthBar; 