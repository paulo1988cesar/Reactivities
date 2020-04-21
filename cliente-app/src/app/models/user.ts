export interface IUser {
  id: string;
  displayName: string;
  token: string;
  image?: string;
  username?: string;
}

export interface IUserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}

export interface IUserList {
  id: string;
  displayName: string;
  username: string;
  status: string;
  email: string;
}

