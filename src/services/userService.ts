import { AxiosRequestConfig } from "axios";
import { axiosCall } from "./axiosService";

export async function getUserInfo() {
  return {
    username: "Jawbone999",
    fullName: "Jonathan Henderson",
    email: "jkhenderson999@gmail.com",
    isAdmin: true,
    clubTeam: "Officer Core",
  };
}
