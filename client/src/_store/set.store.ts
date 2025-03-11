import { makeAutoObservable } from "mobx";
import { Set } from "../_interfaces/set.interface";

class SetStore {
  set: Set | null = null;

  constructor() {
    makeAutoObservable(this);
  };

  setSet = (set: Set | null) => {
    this.set = set;
  };

}

export const setStore = new SetStore();