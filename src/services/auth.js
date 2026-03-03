import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeader() {
  const data = JSON.parse(localStorage.getItem("user"));
  return {
    token: data?.token,
    Authorization: `Bearer ${data?.token}`,
  };
}

export async function signUp(data) {
  try {
    const { data: res } = await axios.post(`${BASE_URL}/users/signup`, data);
    return res;
  } catch (err) {
    return err.response?.data;
  }
}

export async function signIn(data) {
  try {
    const { data: res } = await axios.post(`${BASE_URL}/users/signin`, data);
    return res;
  } catch (err) {
    return err.response?.data;
  }
}

export async function getSuggestions() {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/suggestions?limit=10`, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function followUnfollow(userId) {
  try {
    const { data } = await axios.put(`${BASE_URL}/users/${userId}/follow`, {}, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function getMyProfile() {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/profile-data`, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function getUserPosts(userId) {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function uploadProfilePhoto(formData) {
  try {
    const { data } = await axios.put(`${BASE_URL}/users/upload-photo`, formData, {
      headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}