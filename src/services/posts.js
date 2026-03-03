import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeader() {
  const data = JSON.parse(localStorage.getItem("user"));
  return {
    token: data?.token,
    Authorization: `Bearer ${data?.token}`,
  };
}

export async function getAllPosts() {
  try {
    const { data } = await axios.get(`${BASE_URL}/posts`, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function getHomeFeed() {
  try {
    const { data } = await axios.get(`${BASE_URL}/posts/feed?only=following&limit=10`, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function createPost(formData) {
  try {
    const { data } = await axios.post(`${BASE_URL}/posts`, formData, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function toggleLike(postId) {
  try {
    const { data } = await axios.put(`${BASE_URL}/posts/${postId}/like`, {}, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function toggleBookmark(postId) {
  try {
    const { data } = await axios.put(`${BASE_URL}/posts/${postId}/bookmark`, {}, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}