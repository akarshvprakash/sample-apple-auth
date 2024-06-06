// @ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  const expectedChallenge = ''; // Retrieve from database or session

  const verification = await verifyRegistrationResponse({
    credential: body,
    expectedChallenge,
    expectedOrigin: 'https://sample-apple-auth.vercel.app',
    expectedRPID: 'sample-apple-auth.vercel.app',
  });

  if (verification.verified) {
    const { username } = req.body;
    const { credentialPublicKey, counter, credentialID, transports } = verification.registrationInfo;

    await pool.query('UPDATE profiles SET credentialPublicKey = $1, counter = $2, id = $3, transports = $4 WHERE username = $5',
      [credentialPublicKey, counter, credentialID, transports, username]);
  }

  res.status(200).json(verification);
}
