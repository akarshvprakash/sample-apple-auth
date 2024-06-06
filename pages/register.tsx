import { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';

export default function Register() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleRegister = async () => {
    const res = await fetch('/api/generate-registration-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, displayName }),
    });
    const options = await res.json();
    const registrationResponse = await startRegistration(options);
    await fetch('/api/verify-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationResponse),
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <br />
      <br />
      <a href="/login">go to login</a>
    </div>
  );
}
