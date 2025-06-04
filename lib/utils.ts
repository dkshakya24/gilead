import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return "Invalid credentials!";
    case ResultCode.InvalidSubmission:
      return "Invalid submission, please try again!";
    case ResultCode.UserAlreadyExists:
      return "User already exists, please log in!";
    case ResultCode.UserCreated:
      return "User created, welcome!";
    case ResultCode.UnknownError:
      return "Something went wrong, please try again!";
    case ResultCode.UserLoggedIn:
      return "Logged in!";
  }
};
export const username = "John";

export function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export enum ResultCode {
  InvalidCredentials = "INVALID_CREDENTIALS",
  InvalidSubmission = "INVALID_SUBMISSION",
  UserAlreadyExists = "USER_ALREADY_EXISTS",
  UnknownError = "UNKNOWN_ERROR",
  UserCreated = "USER_CREATED",
  UserLoggedIn = "USER_LOGGED_IN",
}
