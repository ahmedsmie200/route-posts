import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeader() {
  const data = JSON.parse(localStorage.getItem("user"));
  return {
    token: data?.token,
    Authorization: `Bearer ${data?.token}`,
  };
}

export async function getNotifications(unread = false) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/notifications?unread=${unread}&page=1&limit=10`,
      { headers: authHeader() }
    );
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function getUnreadCount() {
  try {
    const { data } = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: authHeader(),
    });
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function markAsRead(notificationId) {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/notifications/${notificationId}/read`,
      {},
      { headers: authHeader() }
    );
    return data;
  } catch (err) {
    return err.response?.data;
  }
}

export async function markAllAsRead() {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/notifications/read-all`,
      {},
      { headers: authHeader() }
    );
    return data;
  } catch (err) {
    return err.response?.data;
  }
}