import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../_interfaces/user.interface";
import { handleResponse } from "../_helpers/handleResponse";
import { authHeader } from "../_helpers/auth-header";

export enum AuthRole {
  SUPERADMIN = "superadmin",
  ADMIN = 'admin',
  USER = 'user',
}

export class AuthenticationRequest {
  email = "";
  password = "";
}

export interface AuthenticatedUser {
  accessToken: string;
  refreshToken: string;
  id: number;
  email: string;
  role: AuthRole;
}

class AuthService {

  readonly loggedUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('loggedUser') ?? 'null'));

  loggedUser: Observable<AuthenticatedUser | null> = this.loggedUserSubject.asObservable();

  get loggedUserValue(): AuthenticatedUser | null {
    return this.loggedUserSubject.value;
  }

  signup = async (body: AuthenticationRequest) => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(body),
    };
    return await handleResponse(await fetch(`/api/auth/signup`, requestOptions));
  };

  login = async (values: AuthenticationRequest): Promise<AuthenticatedUser | void> => {
    const requestOptions = {
      method: 'POST',
      headers: {
        ...authHeader()
      },
      body: JSON.stringify(values),
    };
    const response = await fetch(`/api/auth/login`, requestOptions);
    const user = await handleResponse(response);
    localStorage.setItem('loggedUser', JSON.stringify(user));
    this.loggedUserSubject.next(user);
    return user;
  }

  refreshToken = async (): Promise<AuthenticatedUser | void> => {
    const requestOptions = {
      method: 'POST',
      headers: {
        ...authHeader()
      },
      // body: JSON.stringify(refreshToken),
    };
    const response = await fetch('api/auth/refreshToken', requestOptions);
    const user = await handleResponse(response);
    localStorage.setItem('loggedUser', JSON.stringify((user)));
    this.loggedUserSubject.next(user);
    return user;
  }

  isLogged(): boolean {
    const loggedUser = localStorage.getItem('loggedUser');
    return loggedUser !== null;
  }

  hasRole(role: AuthRole): boolean {
    return this.getRole() === role;
  }

  getRole(): AuthRole {
    if (this.isLogged()) {
      if (this.loggedUserValue)
        return this.loggedUserValue.role;
      return AuthRole.USER;
    }
    return AuthRole.USER;
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
    this.loggedUserSubject.next(null);
  }
}

export const authService = new AuthService();