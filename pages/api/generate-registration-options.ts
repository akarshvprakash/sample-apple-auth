import { NextApiRequest, NextApiResponse } from 'next';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';
import { TextEncoder } from 'util';
import { setCookie } from 'cookies-next'; // Using cookies-next for example

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, displayName } = req.body;

  console.log('Received username:', username);
  console.log('Received displayName:', displayName);

  if (!username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert username to Uint8Array for userID
    const encoder = new TextEncoder();
    const userID = encoder.encode(username);

    // Generate registration options
    const optionsPromise = generateRegistrationOptions({
      rpName: 'SimpleWebAuthn Demo',
      rpID: 'appleauth.vercel.app',
      userID,
      userName: username
    });

    // Wait for the promise to resolve
    const options = await optionsPromise;

    // Store challenge in a cookie (or any temporary storage)
    setCookie('registrationChallenge', options.challenge, { req, res, maxAge: 60 * 5 });

    console.log('Generated registration options:', options);

    // Ensure user is saved in the database
    await pool.query(
      `INSERT INTO profiles (username, displayName, credentialID, credentialPublicKey, counter, attestationobject)
       VALUES ($1, $2, '', '', 0, '')
       ON CONFLICT (username) DO NOTHING`,
      [username, ""]
    );

    // Return the generated options
    return res.status(200).json(options);
  } catch (error) {
    console.error('Error generating registration options:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

