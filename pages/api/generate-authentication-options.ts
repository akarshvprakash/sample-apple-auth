// @ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';
import { setCookie } from 'cookies-next'; // Using cookies-next for example

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body;
  const result = await pool.query('SELECT credentialID FROM profiles WHERE username = $1', [username]);
  const user = result.rows[0];

  console.log("user.credentialid", user.credentialid)

  const optionsPromise = generateAuthenticationOptions({
    allowCredentials: [{
      id: user.credentialid,
      type: 'public-key',
    }],
  });

  console.log("optionsPromise", optionsPromise)

  // Wait for the promise to resolve
  const options = await optionsPromise;

  // Store challenge in a cookie (or any temporary storage)
  setCookie('authenticationChallenge', options.challenge, { req, res, maxAge: 60 * 5 });

  console.log("options", options)

  res.status(200).json(options);
}
