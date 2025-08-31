import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserActions } from "../hooks/user.actions";

function SignIn() {
  const location = useLocation();
  const prefilledUsername = location.state?.username || "";
  const [validated, setValidated] = useState({
    username: (prefilledUsername ? true : false),
    password: false
  });
  const [form, setForm] = useState({
    username: prefilledUsername,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const userActions = useUserActions();

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setForm({...form, username: newUsername})
    if (newUsername !== "") {
      setValidated({...validated, username: true})
    }
    else {
      setValidated({...validated, username: false})
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setForm({...form, password: newPassword})
    if (newPassword !== "") {
      setValidated({...validated, password: true})
    }
    else {
      setValidated({...validated, password: false})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginForm = e.currentTarget;

    if (loginForm.checkValidity() === false) {
      e.stopPropagation();
    }

    const data = {
      username: form.username,
      password: form.password,
    };

    userActions.login(data).catch((err) => {
      if (err.message) {
        const errorDetail = err.response.data?.detail;
        console.log(errorDetail);
        setError(errorDetail);
        setForm({ ...form, password: "" });
      }
    });
  };

  return (
    <div className="main-content-frame" style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', height: '350px', margin: '0 auto' }}>
        <input
          type="input"
          placeholder="Username"
          value={form.username}
          onChange={handleUsernameChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <div style={{ position: 'relative', margin: '10px 0' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={handlePasswordChange}
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
        <label style={{ fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
          <input type="checkbox" /> Remember Me
        </label>
        {(validated.username === true && validated.password === true)
          ? (<button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', borderRadius: '4px' }}>
              Sign In
            </button>)
          : (<button style={{ width: '100%', padding: '10px', backgroundColor: '#636f7d', color: '#c7c7c7', border: 'none', marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', borderRadius: '4px' }}>
              Sign In
            </button>)}
        <p style={{ marginTop: '10px', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>
          Don't have an account? <Link to="/sign-up" style={{ color: '#007bff' }}>Sign Up</Link>
        </p>
        <div style={{maxWidth: '250px', wordWrap: "break-word", overflowWrap: "break-word",}}>
          <p style={{ color: 'red', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}> {error} </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
