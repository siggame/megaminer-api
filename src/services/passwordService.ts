/* eslint-disable no-param-reassign */

import { genSalt, hash } from "bcrypt";

const saltRounds = 10;

export async function getRandomSalt() {
  return genSalt(saltRounds);
}

export async function getHashedPassword(password: string, salt: string) {
  return hash(password, salt);
}

export function cleanUserData(user: any): any {
  user.password = undefined;
  user.salt = undefined;

  return user;
}