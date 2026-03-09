declare const argon2hash: (password: string) => Promise<string>;
declare const argon2verify: (hash: string, password: string) => Promise<boolean>;
export { argon2hash, argon2verify };
