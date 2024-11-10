// api.js
// licenseNumber,
// offenseDetails,
// fine,
// location,
// contactNumber,
// email

// const { json } = require("body-parser");
// const { application } = require("express");

document
  ?.getElementById("add-offense-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const licenseNumber = document.getElementById("license-number").value;
    const offenseDetails = document.getElementById("offense-details").value;
    const fine = document.getElementById("fine").value;
    const location = document.getElementById("location").value;
    const contactNumber = document.getElementById("contact-number").value;
    const email = document.getElementById("email").value;

    // Simulate sending data to the backend via AJAX
    fetch("http://localhost:3000/api/offenses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        licenseNumber: licenseNumber,
        offenseDetails: offenseDetails,
        fine: fine,
        location: location,
        contactNumber: contactNumber,
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((existData) => {
        if (existData) {
          alert(existData.message);
          window.location.href = "dashboard.html";
          console.log(existData);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error");
      });
  });

export const getAllOffenses = () => {
  return fetch("http://localhost:3000/api/offenses/", {
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
