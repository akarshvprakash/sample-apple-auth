import { NextApiRequest, NextApiResponse } from 'next';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, displayName } = req.body;
  const options = generateRegistrationOptions({
    rpName: 'SimpleWebAuthn Demo',
    rpID: 'sample-apple-auth.vercel.app',
    userID: username,
    userName: displayName,
    userDisplayName: displayName,
  });

  await pool.query('INSERT INTO profiles (username, displayName, id, credentialPublicKey, counter, transports) VALUES ($1, $2, $3, $4, $5, $6)',
    [username, displayName, '', '', 0, []]);

  res.status(200).json(options);
}
