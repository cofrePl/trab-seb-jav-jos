import bcrypt from 'bcrypt'

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10)
export const comparePassword = (pw: string, hash: string) => bcrypt.compare(pw, hash)
