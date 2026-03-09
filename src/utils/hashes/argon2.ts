import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

const argon2hash = async (password: string): Promise<string> => {
  if (!password) return;
  return bcrypt.hash(password, SALT_ROUNDS);
};

const argon2verify = async (hash: string, password: string): Promise<boolean> => {
  if (!hash || !password) return false;
  return bcrypt.compare(password, hash);
};

export { argon2hash, argon2verify };
