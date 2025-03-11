import { makeAutoObservable } from "mobx";
import { Serie } from "../_interfaces/serie.interface";

class SerieStore {
  series: Serie[] = [];

  constructor() {
    makeAutoObservable(this);
  };

  setSeries = (series: Serie[]) => {
    this.series = series;
  };
  
};

export const serieStore = new SerieStore();