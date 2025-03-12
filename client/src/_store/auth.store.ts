// import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInAnonymously } from "firebase/auth";
import { action, computed, makeObservable, observable } from "mobx";
// import { auth } from "../_config/firebaseConfig";

class AuthStore {

  idToken: string | undefined | null = localStorage.getItem("idToken");
  loggedUser: any = JSON.parse(localStorage.getItem('loggedUser') || 'null');

  constructor() {
    makeObservable(this, {
      idToken: observable,
      loggedUser: observable,
      setLoggedUser: action,
      setIdToken: action,
      isLoggedIn: computed
    });
  }

  setIdToken(idToken: string) {
    this.idToken = idToken;
    localStorage.setItem('idToken', idToken);
  }

  setLoggedUser = (loggedUser: any) => {
    this.loggedUser = loggedUser;
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
  }

  clearToken = () => {
    this.idToken = null;
    localStorage.removeItem('idToken');
    localStorage.removeItem('loggedUser');
    // auth.signOut();
  };

  get isLoggedIn() {
    return !!this.loggedUser;
  }
}

export const authStore = new AuthStore();