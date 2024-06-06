// @ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body;
  const result = await pool.query('SELECT credentialID FROM profiles WHERE username = $1', [username]);
  const user = result.rows[0];

  console.log("user.credentialID", user.credentialID)

  const optionsPromise = generateAuthenticationOptions({
    allowCredentials: [{
      id: user.credentialID,
      type: 'public-key',
    }],
  });

  console.log("optionsPromise", optionsPromise)

  const options = await optionsPromise;

  console.log("options", options)

  res.status(200).json(options);
}
