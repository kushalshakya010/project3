// api.js
// licenseNumber,
// offenseDetails,
// fine,
// location,
// contactNumber,
// email

// const { json } = require("body-parser");
// const { application } = require("express");

export const getAllOffenses = async () => {
  return await fetch("http://localhost:3000/api/offenses/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      alert("Error");
    });
};

export const editOffense = async (offences) => {
  try {
    const res = await fetch(
      "http://localhost:3000/api/offenses/" + offences._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offences),
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
    alert("Error");
  }
};

export const deleteOffenseById = async (offences) => {
  try {
    const res = await fetch(
      "http://localhost:3000/api/offenses/" + offences._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
    alert("Error");
  }
};
