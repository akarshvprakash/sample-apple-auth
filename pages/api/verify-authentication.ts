// @ts-nocheck

import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  // Retrieve the stored challenge from the cookie
  const storedChallenge = getCookie('authenticationChallenge', { req, res });

  const result = await pool.query('SELECT * FROM profiles WHERE credentialID = $1', [body.rawId]);
  const user = result.rows[0];

  console.log("user", user)
  console.log("storedChallenge", storedChallenge)

  // const verification = await verifyAuthenticationResponse({
  //   response: body,
  //   expectedChallenge: storedChallenge as string,
  //   expectedOrigin: 'https://sample-apple-auth.vercel.app',
  //   expectedRPID: 'sample-apple-auth.vercel.app',
  //   authenticator: {
  //     credentialPublicKey: user.credentialPublicKey,
  //     counter: user.counter
  //   },
  // });


  // if (verification.verified) {
  //   await pool.query('UPDATE profiles SET counter = $1 WHERE credentialID = $2', [verification.authenticationInfo.newCounter, body.rawId]);
  // }

  res.status(200).json(verification);
}
