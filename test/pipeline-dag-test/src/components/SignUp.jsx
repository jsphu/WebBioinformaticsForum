import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserActions } from '../hooks/user.actions';

function SignUp() {
  const [validated, setValidated] = useState({email: false, password: false});
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState([]);
  const userActions = useUserActions();

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setForm({ ...form, email: newEmail });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail)) {
      setError(["Please provide a valid email address."]);
      setValidated({ ...validated, email: false });
    } else {
      setError([]);
      setValidated({ ...validated, email: true });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setForm({ ...form, confirmPassword: newConfirmPassword })
    if (form.password !== newConfirmPassword) {
      setError(["Passwords do not match.",""]);
      setValidated({ ...validated, password: false });
    } else {
      setError([]);
      setValidated({ ...validated, password: true });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const registerForm = e.currentTarget;

    if (registerForm.checkValidity() === false) {
      e.stopPropagation();
    }

    const data = {
      username: form.username,
      email: form.email,
      password: form.password
    }

    userActions.register(data).catch((err) => {
      if (err.message) {
        const errMsg = err.response.data;
        const { username, email, password, ...otherErrors } = errMsg || {};
        const errors = {
          username,
          email,
          password,
          error: Object.keys(otherErrors).length ? otherErrors : null
        };
        setError(
          Object.entries(errors)
            .filter(([_, message]) => message)
            .map(([field, message]) => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`)
        );
        setForm({ ...form, confirmPassword: "" })
      }
    });
  };

  return (
    <div className="main-content-frame" style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleEmailChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <div style={{ position: 'relative', margin: '10px 0' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            {showPassword ? 'Ω' : '👁️'}
          </span>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleConfirmPasswordChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        {error.map((msg, i) => (
          <p key={i} style={{ color: 'red', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
            {msg}
          </p>))
        }
        {(validated.email === true && validated.password === true)
          ? (<button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', borderRadius: '4px' }}>
              Sign Up
            </button>)
          : (<button style={{ width: '100%', padding: '10px', backgroundColor: '#636f7d', color: '#c7c7c7', border: 'none', marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', borderRadius: '4px' }}>
              Sign Up
            </button>)}

        <p style={{ marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
          Already have an account? <Link to="/sign-in" style={{ color: '#007bff' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
