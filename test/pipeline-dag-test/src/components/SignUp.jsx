import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email.includes('@')) setError('Please enter a valid email address.');
    else if (password.length < 6) setError('Password must be at least 6 characters.');
    else if (password !== confirmPassword) setError('Passwords do not match.');
    else {
      setTimeout(() => {
        setLoading(false);
        alert('Registration successful! (Real data saving will be added later)');
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="main-content-frame" style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <div style={{ position: 'relative', margin: '10px 0' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            👁️
          </span>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        {error && <p style={{ color: 'red', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>{error}</p>}
        {loading && <p style={{ fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>Loading...</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', borderRadius: '4px' }}>
          Sign Up
        </button>
        <p style={{ marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
          Already have an account? <Link to="/sign-in" style={{ color: '#007bff' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;