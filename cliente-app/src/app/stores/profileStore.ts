import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import { IProfile, IPhoto } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.username;
    } else {
      return false;
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;

    try {
      const photo = await agent.Profiles.uploadPhoto(file);

      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.IsMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
            this.uploadingPhoto = false;
          }
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.setMainPhoto(photo.id);

      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((a) => a.id === photo.id)!.IsMain = true;
        this.profile!.image = photo.url;
        this.profile!.photos.find((a) => a.IsMain)!.IsMain = false;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Problem setting photo as main");
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);

      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (a) => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;

    try {
      await agent.Profiles.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unFollow = async (username: string) => {
    this.loading = true;

    try {
      await agent.Profiles.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
     this.loading = true;
     try {
         const profiles = await agent.Profiles.listFollowings(
         this.profile!.username,
         predicate
       );
       runInAction(() => {
         this.followings = profiles;
         this.loading = false;
       });
     } catch (error) {
       toast.error("Problem loading followings");
       runInAction(() => {
         this.loading = false;
       });
     }
  };
}