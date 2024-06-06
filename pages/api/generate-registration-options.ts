import { NextApiRequest, NextApiResponse } from 'next';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';
import { TextEncoder } from 'util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, displayName } = req.body;

  // Convert username to Uint8Array for userID
  const encoder = new TextEncoder();
  const userID = encoder.encode(username);

  const options = generateRegistrationOptions({
    rpName: 'SimpleWebAuthn Demo',
    rpID: 'sample-apple-auth.vercel.app',
    userID,
    userName: username,
    userDisplayName: displayName,
  });

  await pool.query(
    `INSERT INTO profiles (username, displayName, credentialID, credentialPublicKey, counter, transports)
     VALUES ($1, $2, '', '', 0, '{}')
     ON CONFLICT (username) DO NOTHING`,
    [username, displayName]
  );

  res.status(200).json(options);
}
