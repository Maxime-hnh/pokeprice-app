// import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInAnonymously } from "firebase/auth";
import { action, makeObservable, observable } from "mobx";
// import { auth } from "../_config/firebaseConfig";

class AuthStore {

  idToken: string | undefined | null = localStorage.getItem("idToken");
  loggedUser: any = JSON.parse(localStorage.getItem('loggedUser') || 'null');

  constructor() {
    makeObservable(this, {
      idToken: observable,
      loggedUser: observable,
      setLoggedUser: action,
      setIdToken: action
    });


    // onAuthStateChanged(auth, async (user) => {
    //   await setPersistence(auth, browserLocalPersistence)
    //   if (user) {
    //     await user.getIdToken(true).then(async (newToken) => {
    //       this.setIdToken(newToken)
    //       this.setLoggedUser(user)
    //     })
    //   } else {
    //     this.clearToken()
    //   }
    // });

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
}

export const authStore = new AuthStore();