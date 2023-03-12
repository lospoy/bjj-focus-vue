const API_URL = import.meta.env.VITE_API

// SAVE A SESSION
export async function saveSession(data) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

  try {
    const response = await fetch(API_URL + '/sessions', {
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

// GET ALL SESSIONS
export async function getAllSessions() {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/sessions', {
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

// UPDATE A SESSION
export async function updateSession(data, id) {
  let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

  try {
    const response = await fetch(API_URL + '/sessions/' + id, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + user.token },
      body: JSON.stringify(data),
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