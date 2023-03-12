// MOVE SERVICE

const API_URL = import.meta.env.VITE_API
// import { getAuthHeader } from './userService';

export async function getAllMoves() {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/techniques/moves', {
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

// GET HUMAN BY ID
export async function getMove(id) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/techniques/moves/' + id, {
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

export async function createMove(data) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/techniques/moves', {
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


