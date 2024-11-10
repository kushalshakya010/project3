document
  .getElementById("login-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const licenseNumber = document.getElementById("license").value;
    const password = document.getElementById("password").value;

    if (!licenseNumber || !password) {
      alert("Please fill out all fields");
      return;
    }

    // http://localhost:3000/api/payments
    // Send the data to backend API
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        licenseNumber: licenseNumber,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.error);
          return;
        }
        localStorage.clear();
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "police") {
          // Redirect to the appropriate dashboard

          window.location.href = "../views/police/dashboard.html";
        } else {
          window.location.href = "../views/driver/dashboard.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login");
      });
  });

//-----------------------------------register--------------------------------------
document
  .getElementById("register-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const role = document.getElementById("role").value;
    const licenseNumber = document.getElementById("license").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const password = document.getElementById("password").value;
    console.log(role, licenseNumber, name, email, contactNumber, password);

    if (
      !role ||
      !licenseNumber ||
      !password ||
      !name ||
      !email ||
      !contactNumber
    ) {
      alert("Please fill out all fields");
      return;
    }

    // http://localhost:3000/api/payments
    // Send the data to backend API
    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        licenseNumber: licenseNumber,
        name: name,
        email: email,
        contactNumber: contactNumber,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log({ data: data });
        if (!data.error) {
          alert(data.message);
          // Redirect to the appropriate dashboard
          // window.location.replace("../views/login.html");
          window.location.href = "../views/login.html";
        } else {
          alert(data.error || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login");
      });
  });
