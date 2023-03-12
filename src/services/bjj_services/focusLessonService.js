// FOCUS LESSON SERVICE

const API_URL = import.meta.env.VITE_API
// import { getAuthHeader } from './userService';

// GET ALL
export async function getAllFocusLessons() {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/focusLessons', {
        method: "GET",
        headers: { "Authorization": "Bearer " + user.token }
      });

    if (!response.ok) {
      throw new Error("error => response not ok");
    } else {
      return await response.json();
    }
  } catch (e) {
    console.log(e);
  }
}

// GET BY ID
export async function getFocusLesson(id) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/focusLessons/' + id, {
        method: "GET",
        headers: { "Authorization": "Bearer " + user.token }
      });

    if (!response.ok) {
      throw new Error("error => response not ok");
    } else {
        return await response.json()
    }
  } catch (e) {
    console.log(e);
  }
}

// CREATE
export async function createFocusLesson(data) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/focusLessons/create', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + user.token },
        body: JSON.stringify(data),
      });

    if (!response.ok) {
      throw new Error("error => response not ok");
    } else {
      return await response;
    }
  } catch (e) {
    console.log(e);
  }
}


