import { authService } from "../_services/auth.service";

export function authHeader(type: 'json' | 'form' | 'text' = "json"): HeadersInit {
  // return authorization header with jwt token
  const loggedUser = authService.loggedUserValue;
  let header: HeadersInit = {};
  switch (type) {
    case "json":
      header = Object.assign(header, {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Accept: "application/json",
      });
      break;
    case "form":
      header = Object.assign(header, {
        "Cache-Control": "no-cache",
        Accept: "application/json",
      });
      break;
    default:
      header = Object.assign(header, {
        "Cache-Control": "no-cache",
        "Content-Type": "text/plain",
      });
      break;
  }

  if (loggedUser && loggedUser.accessToken) {
    header["Authorization"] = "Bearer " + loggedUser.accessToken;
  }

  if (loggedUser && loggedUser.refreshToken) {
    header["x-refresh-token"] = loggedUser.refreshToken
  }

  return header;
}
