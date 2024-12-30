const authService = require("../login");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Verify the admin login
    const adminUser = await authService.verifyAdmin(email, password);

    // Return a success response with the admin's info
    res.json({
      message: "Login successful",
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message }); // Return error messages directly
  }
}

module.exports = { login };
