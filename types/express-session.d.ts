import { UserInfo } from "./userInfo";

declare module 'express-session' {
  interface SessionData {
    userInfo: UserInfo
  }
}