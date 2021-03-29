/* eslint-disable no-param-reassign */

import { genSalt, hash } from "bcrypt";
import PasswordValidator = require("password-validator");

// Set password rules
const minPasswordLength = 8; // min length = 8 characters
const maxPasswordLength = 55; // max length = 55 characters (bcrypt limit on input bytes)
const passwordSchema = new PasswordValidator();
passwordSchema.is().min(minPasswordLength);
passwordSchema.is().max(maxPasswordLength);
// eslint-disable-next-line no-control-regex
passwordSchema.has(/[\x00-\x7F]/); // ASCII only (to ensure 55 character == 55 bytes)

const saltRounds = 10;

/**
 * Returns reasons why the given password is invalid, if any.
 * @param password - The user's input password.
 * @returns - An array of reasons why the password is invalid. If the array is empty, it is valid.
 */
export function validPassword(
  username: string,
  password: string
): Array<string> {
  const result = passwordSchema.validate(password, { list: true });
  const reasons = [];

  // Set more specific reasoning than the validator itself offers
  // The validator returns the rules broken (or true if none are) but not the specifics
  if (Array.isArray(result)) {
    result.forEach((param: string) => {
      switch (param) {
        case "min":
          reasons.push(
            `Password must be at least ${minPasswordLength} characters long.`
          );
          break;
        case "max":
          reasons.push(
            `Password must be at most ${maxPasswordLength} characters long.`
          );
          break;
        case "has":
          reasons.push(`Password must be valid ASCII.`);
          break;
        default:
          reasons.push(param);
      }
    });
  }

  // Additional check for username and password being the same
  if (username === password) {
    reasons.push("Password must not be the same as the username.");
  }

  return reasons;
}

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
