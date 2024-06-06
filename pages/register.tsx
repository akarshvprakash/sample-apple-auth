import { useState } from 'react';
import Link from 'next/link'
import { startRegistration } from '@simplewebauthn/browser';

export default function Register() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch('/api/generate-registration-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName }),
      });

      if (!res.ok) {
        console.error('Error generating registration options:', res.statusText);
        return;
      }

      const options = await res.json();
      if (!options || Object.keys(options).length === 0) {
        console.error('Empty registration options received');
        return;
      }

      const registrationResponse = await startRegistration(options);
      await fetch('/api/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, registrationResponse}),
      });

      console.log('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error);
    }
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
      <Link href="/login">Go to login</Link>
    </div>
  );
}

