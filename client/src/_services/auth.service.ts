import { BehaviorSubject, Observable } from "rxjs";
import { handleResponse } from "../_helpers/handleResponse";
import { authHeader } from "../_helpers/auth-header";
import { authStore } from "../_store/auth.store";

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
  isRefreshing = false;
  refreshSubscribers: ((token: string) => void)[] = [];

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
    authStore.setLoggedUser(user)
    this.loggedUserSubject.next(user);
    return user;
  }

  refreshToken = async (): Promise<AuthenticatedUser | void> => {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token) => {
          resolve(this.loggedUserValue!);
        });
      });
    }

    this.isRefreshing = true;
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          ...authHeader(),
        },
      };

      const response = await fetch('/api/auth/refreshToken', requestOptions);
      const user = await handleResponse(response);

      // Stocke le nouveau token
      localStorage.setItem('loggedUser', JSON.stringify(user));
      authService.loggedUserSubject.next(user);

      // Notifie toutes les requêtes en attente
      this.refreshSubscribers.forEach((callback) => callback(user.accessToken));
      this.refreshSubscribers = [];

      return user;
    } catch (error) {
      authService.logout();
      window.location.reload();
    } finally {
      this.isRefreshing = false;
    }
  };

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