const API_URL = import.meta.env.VITE_API

async function getAllHumans() {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/humans', {
        method: "GET",
        headers: { "Authorization": "Bearer " + user.token }
      });

    if (!response.ok) {
      throw new Error("error => response not ok")
    } else {
      return await response.json();
    }
  } catch (e) {
    console.log(e);

  }
}

async function getAllActiveHumans() {
  let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

  try {
    const response = await fetch(API_URL + '/humans/active', {
      method: "GET",
      headers: { "Authorization": "Bearer " + user.token }
    });

    if (!response.ok) {
      throw new Error("error => response not ok")
    } else {
      return await response.json();
    }
  } catch (e) {
    console.log(e);
  }
}

async function getAllInactiveHumans() {
  let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

  try {
    const response = await fetch(API_URL + '/humans/inactive', {
      method: "GET",
      headers: { "Authorization": "Bearer " + user.token }
    });

    if (!response.ok) {
      throw new Error("error => response not ok")
    } else {
      return await response.json();
    }
  } catch (e) {
    console.log(e);
  }
}

async function getHuman(id) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    if(id.typeOf === number)

    try {
      const response = await fetch(API_URL + '/humans/' + id, {
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

async function createHuman(data) {
    let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

    try {
      const response = await fetch(API_URL + '/humans', {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + user.token },
        body: JSON.stringify(data),
      });

    if (response.status === 409) {
      throw new Error("Conflict, data already exists");
    } else if (!response.ok) {
      throw new Error("error => response not ok");
    } else {
      return response
    }
  } catch (e) {
    console.log(e);
  }
}

async function updateHuman(id, data) {
  let user = JSON.parse(localStorage.getItem("BJJFocusUser"))

  try {
    const response = await fetch(API_URL + '/humans/' + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + user.token },
      body: JSON.stringify(data),
    });

  if (response.status === 409) {
    throw new Error("Conflict, data already exists");
  } else if (!response.ok) {
    throw new Error("error => response not ok");
  } else {
    return response
  }
} catch (e) {
  console.log(e);
}
}


module.exports = {
  createHuman,
  getHuman,
  getAllHumans,
  getAllActiveHumans,
  getAllInactiveHumans,
  updateHuman,
}