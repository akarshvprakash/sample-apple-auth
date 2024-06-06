import { NextApiRequest, NextApiResponse } from 'next';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';
import { TextEncoder } from 'util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, displayName } = req.body;

  console.log('Received username:', username);
  console.log('Received displayName:', displayName);

  if (!username || !displayName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert username to Uint8Array for userID
    const encoder = new TextEncoder();
    const userID = encoder.encode(username);

    // Generate registration options
    const options = generateRegistrationOptions({
      rpName: 'SimpleWebAuthn Demo',
      rpID: 'sample-apple-auth.vercel.app',
      userID,
      userName: username,
      userDisplayName: displayName,
    });

    console.log('Generated registration options:', options);

    // Ensure user is saved in the database
    await pool.query(
      `INSERT INTO profiles (username, displayName, credentialID, credentialPublicKey, counter, transports)
       VALUES ($1, $2, '', '', 0, '{}')
       ON CONFLICT (username) DO NOTHING`,
      [username, displayName]
    );

    // Return the generated options
    return res.status(200).json(options);
  } catch (error) {
    console.error('Error generating registration options:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

