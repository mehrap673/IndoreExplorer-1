import { Router } from "express";
import {
  authenticateAdmin,
  loginAdmin,
  registerFirstAdmin,
  type AuthRequest,
} from "../auth";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    const result = await loginAdmin(username, password);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/register-first-admin", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }
    const result = await registerFirstAdmin({ username, email, password });
    res.json(result);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Registration failed",
    });
  }
});

router.get("/verify", authenticateAdmin, (req: AuthRequest, res) => {
  res.json({ user: req.adminUser });
});

router.post("/logout", authenticateAdmin, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;