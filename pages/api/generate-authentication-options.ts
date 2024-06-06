// @ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body;
  const result = await pool.query('SELECT credentialID FROM profiles WHERE username = $1', [username]);
  const user = result.rows[0];

  const options = generateAuthenticationOptions({
    allowCredentials: [{
      id: user.id,
      type: 'public-key',
    }],
  });

  res.status(200).json(options);
}
