import axios, { AxiosResponse } from "axios";
import { IActivity, IActivitiesEnvelope } from "../models/activity";
import { IUser, IUserList, IUserFormValues } from "../models/user";
import { history } from "../..";
import { toast } from "react-toastify";
import { IProfile, IPhoto } from "../models/profile";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(undefined, (error) => {
  if (error.messsage === "Network error" && !error.response) {
    toast.error("Network error - check the API!");
  }

  const { status, data, config, headers } = error.response;

  if (
    status === 401 &&
    (headers["www-authenticate"] as string).includes(
      'Bearer error="invalid_token", error_description="The token expired'
    )
  ) {
    console.log(error.response);
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.info("You session has expired. Please login again!");
  }

  if (status === 404) {
    history.push("/NotFound");
  }

  if (
    status === 400 &&
    config.method === "get" &&
    data.erros.HasOwnProperty("id")
  ) {
    history.push("/NotFound");
  }

  if (status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }

  throw error.response;
});

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formsData = new FormData();
    formsData.append("File", file);
    return axios
      .post(url, formsData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    axios
      .get("/activities", { params: params })
      .then(responseBody),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`),
};

const Users = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/register", user),
  list: (): Promise<IUserList[]> => requests.get("/user/list"),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profile/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postForm(`/photo`, photo),
  setMainPhoto: (id: string) => requests.post(`/photo/${id}/setmain`, {}),
  deletePhoto: (id: string) => requests.del(`/photo/${id}`),
  follow: (username: string) =>
    requests.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) => requests.del(`/profiles/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
  listActivites: (username: string, predicate: string) =>
    requests.get(`/profile/${username}/activities?predicate=${predicate}`),
};

export default {
  Activities,
  Users,
  Profiles,
};
