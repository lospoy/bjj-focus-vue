// TECHNIQUE SERVICE

const API_URL = import.meta.env.VITE_API
// import { getAuthHeader } from './userService';

export async function getAllTechniques() {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/techniques', {
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
export async function getTechnique(id) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/techniques/id/' + id, {
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

export async function createTechnique(data) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/techniques', {
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


