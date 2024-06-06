// @ts-nocheck

import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  const expectedChallenge = ''; // Retrieve from database or session

  const result = await pool.query('SELECT * FROM users WHERE id = $1', [body.rawId]);
  const user = result.rows[0];

  const verification = await verifyAuthenticationResponse({
    credential: body,
    expectedChallenge,
    expectedOrigin: 'https://sample-apple-auth.vercel.app',
    expectedRPID: 'sample-apple-auth.vercel.app',
    authenticator: {
      credentialPublicKey: user.credentialPublicKey,
      counter: user.counter,
      transports: user.transports,
    },
  });

  if (verification.verified) {
    await pool.query('UPDATE profiles SET counter = $1 WHERE id = $2', [verification.authenticationInfo.newCounter, body.rawId]);
  }

  res.status(200).json(verification);
}
