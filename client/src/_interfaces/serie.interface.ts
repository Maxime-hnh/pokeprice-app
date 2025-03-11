import { Set } from "./set.interface";

export interface Serie {

  id: number;
  uid: string;
  code: string;
  name: string;
  logo: string | undefined;
  
  sets: Set[];
};