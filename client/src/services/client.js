import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

//All request will wait 2 seconds before timeout
axiosClient.defaults.timeout = 2000;

axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.response.use(
  function (response) {
    //Dispatch any action on success
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      console.log('401 error, should redirect to login');

      //Add Logic to
      //1. Redirect to login page or
      //2. Request refresh token
    }
    return Promise.reject(error);
  }
);

export default class Client {
  #token;

  setToken(token) {
    this.#token = token;
    axiosClient.defaults.headers = {
      ...axiosClient.defaults.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  get(URL) {
    return axiosClient.get(URL).then((response) => response);
  }

  post(URL, payload) {
    return axiosClient.post(URL, payload).then((response) => response);
  }

  put(URL, payload) {
    return axiosClient.put(URL, payload).then((response) => response);
  }

  patch(URL, payload) {
    return axiosClient.patch(URL, payload).then((response) => response);
  }
  
  delete(URL) {
    return axiosClient.delete(URL).then((response) => response);
  }
}
