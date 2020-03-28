import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IUser } from "../models/user";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";

configure({ enforceActions: "always" });

class UserStore {
  @observable userRegistry = new Map();
  @observable userLists: IUser[] = [];
  @observable user: IUser | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get getUsers() {
    return this.userRegistry;
  }

  @action loadUsers = async () => {
    this.loadingInitial = true;

    try {
      const users = await agent.Users.list();

      runInAction("loading activities", () => {
        this.userLists = [];
        users.forEach((user: IUser) => {
          this.userRegistry.set(user.id, user);
          this.userLists.push(user);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
      });
    }
  };
}

export default createContext(new UserStore());
