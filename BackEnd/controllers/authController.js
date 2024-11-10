// controllers/authController.js

const User = require("../models/User"); // Import the User model
// const jwt = require("jsonwebtoken"); // For generating JWT tokens

// Function to handle login
exports.login = async (req, res) => {
  const { licenseNumber, password } = req.body;

  try {
    // Find the user by license number
    const user = await User.findOne({ licenseNumber });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.password != password) {
      return res.status(404).json({ error: "Password incorrect" });
    }
    // // Generate a JWT token
    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );

    // Send the token to the client
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Function to handle  register---------------------------------------------------------------------------------
exports.register = async (req, res) => {
  const { licenseNumber, name, email, contactNumber, role, password } =
    req.body;
  try {
    // Find the user by license number
    const user = await User.findOne({ licenseNumber });
    console.log(req.body);

    if (user) {
      return res.status(404).json({ error: "User already exist" });
    }

    const newUser = new User(req.body);
    await newUser.save();

    // Generate a JWT token
    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );

    // Send the token to the client
    res.status(200).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
