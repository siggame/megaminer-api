import { UserInfo } from "./userInfo";

export {};

declare module 'express-session' {
  interface SessionData {
    userInfo: UserInfo
  }
}