import { observable, action, computed, runInAction } from "mobx";
import { IUserList, IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { history } from "../..";
import { RootStore } from "./rootStore";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable userRegistry = new Map();
  @observable userLists: IUserList[] = [];
  @observable userList: IUserList | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @computed get getUsers() {
    return this.userRegistry;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.Users.login(values);
      runInAction("loading users", () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await agent.Users.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.Users.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action loadUsers = async () => {
    this.loadingInitial = true;

    try {
      const users = await agent.Users.list();

      runInAction("loading users", () => {
        this.userLists = [];
        users.forEach((user: IUserList) => {
          this.userRegistry.set(user.id, user);
          this.userLists.push(user);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("loading users error", () => {
        this.loadingInitial = false;
      });
    }
  };
}
