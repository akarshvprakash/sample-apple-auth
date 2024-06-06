
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import pool from '../../lib/db';
import { getCookie } from 'cookies-next'; // Using cookies-next for example

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  // Retrieve the stored challenge from the cookie
  const storedChallenge = getCookie('registrationChallenge', { req, res });

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: storedChallenge as string,
    expectedOrigin: 'https://sample-apple-auth.vercel.app',
    expectedRPID: 'sample-apple-auth.vercel.app',
  });

  console.log("verification", verification);

  if (verification.verified) {
    const { username } = req.body;
    // const { credentialPublicKey, counter, credentialID, transports } = verification.registrationInfo;

    // await pool.query('UPDATE profiles SET credentialPublicKey = $1, counter = $2, id = $3, transports = $4 WHERE username = $5',
    //   [credentialPublicKey, counter, credentialID, transports, username]);
  }

  res.status(200).json(verification);
}
