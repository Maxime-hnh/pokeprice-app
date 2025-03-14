export declare type UserProps = {
  uid?: number;
  email: string;
  password: string;
  role: string;
};

export type FetchedUser = {
  id: number;
} & UserProps;

export class User implements UserProps {
  email: string = "";
  password: string = "";
  role: string = "user";
};