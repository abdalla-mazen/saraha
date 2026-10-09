import { hash, compare } from "bcrypt";

export async function hashValue(value, saltRounds = 12) {
  return await hash(value, saltRounds);
}

export async function compareValue(value, hashedValue) {
  return await compare(value, hashedValue);
}