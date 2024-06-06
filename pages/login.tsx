import { useState } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function Login() {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/generate-authentication-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const options = await res.json();
    const authenticationResponse = await startAuthentication(options);
    await fetch('/api/verify-authentication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authenticationResponse),
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <br />
      <br />
      <a href="/register">go to register</a>
    </div>
  );
}
