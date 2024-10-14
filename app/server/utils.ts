import crypto from 'crypto';
import util from 'util';

const pbkdf2 = util.promisify(crypto.pbkdf2)

export const generatePasswordHash = async (password: string) => {
  const saltLength = 16; // Translates to a length of 32 when hex encoded
  const salt = crypto.randomBytes(saltLength).toString('hex');
  const iterations = 50000;
  const keylen = 32; // Translates to a length of 64 when hex encoded
  const digest = 'sha256'
  const hash = await pbkdf2(password, salt, iterations, keylen, digest);
  const encodedHash = hash.toString('hex');
  return `pbkdf2:${digest}:${iterations}$${salt}$${encodedHash}`
}

export const checkPasswordHash = async (hashedPassword: string | undefined, clearTextPassword: string) => {
  if (!hashedPassword) {
    return false;
  }

  const pieces = hashedPassword.split(/:|\$/);
  const digest = pieces[1];
  const iterations = parseInt(pieces[2]);
  const salt = pieces[3];
  const hash = pieces[4];
  const decodedHash = Buffer.from(hash, 'hex');
  const keylen = decodedHash.length;
  const hashedClearTextPassword = await pbkdf2(clearTextPassword, salt, iterations, keylen, digest);
  const encodedClearTextPassword = hashedClearTextPassword.toString('hex');
  return encodedClearTextPassword === hash;
}
