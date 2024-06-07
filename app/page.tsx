// @ts-nocheck
'use client';
import { useState } from 'react';
import { useLocalStorage } from "../lib/hook";
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [credential, setCredential] = useLocalStorage({}, null);

  const handleLogin = async () => {
    try {
      if(!username || !validateEmail(username)) {
        alert("Enter a valid email id");
      }
      const res = await fetch('/api/generate-authentication-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const options = await res.json();
      const authenticationResponse = await startAuthentication(options);
      const response = await fetch('/api/verify-authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authenticationResponse),
      });
      console.log(response);
      setCredential({
        username
      })
      alert('Authetication successful');
    } catch (error) {
      console.error('Error during authetication:', error);
      alert('Error during authetication:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch('/api/generate-registration-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
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
      const response = await fetch('/api/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, response: registrationResponse}),
      });
      console.log(response);
      alert('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between login-page">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <label style={{width: "100%", color: "rgb(55 65 81 / var(--tw-border-opacity))"}} for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Register Form</label>
        <div class="relative mb-2" style={{width: "100%"}}>
          <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
            </svg>
          </div>
          <input value={username}
          onChange={(e) => setUsername(e.target.value)} type="email" required="true" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" />
        </div>
        <button style={{width: "100%"}} onClick={handleLogin} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Login</button>
      </div>
      {
        credential && credential?.username ? <button onClick={handleRegister} style={{width: "100%"}} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Loggin as {credential?.username}</button> : null
      }
      
    </main>
  );
}