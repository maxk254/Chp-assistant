import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;
let otpStore = {};

const authService = {
  async requestOtp(phone) {
    if (!phone) {
      return { error: "Phone is required", status: 400 };
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return { error: "Phone not registered", status: 400 };
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[phone] = otp;

    console.log(`OTP for ${phone}: ${otp}`); // For testing; replace with SMS in production
    return { message: "OTP sent", status: 200 };
  },

  async verifyOtp(phone, otp) {
    if (!phone || !otp) {
      return { error: "Phone and OTP required", status: 400 };
    }

    const realOtp = otpStore[phone];
    if (!realOtp || realOtp !== otp) {
      return { error: "Invalid OTP", status: 400 };
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return { error: "User not found", status: 400 };
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    delete otpStore[phone];
    return { token, role: user.role, status: 200 };
  },

  async supervisorLogin(email, password) {
    if (!email || !password) {
      return { error: "Email and password required", status: 400 };
    }

    try {
      const user = await User.findOne({ email, role: "supervisor" });
      if (!user) {
        return { error: "User not found", status: 400 };
      }

      if (!user.password) {
        return { error: "User has no password set", status: 400 };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { error: "Invalid password", status: 400 };
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token, role: user.role, status: 200 };
    } catch (err) {
      console.error(err);
      return { error: "Server error", status: 500 };
    }
  },

  async signup(userData) {
    const { name, role, phone, email, password } = userData;

    try {
      let existingUser;
      if (role === "supervisor") {
        existingUser = await User.findOne({ email });
      } else {
        existingUser = await User.findOne({ phone });
      }

      if (existingUser) {
        return { error: "User already exists", status: 400 };
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      const user = new User({
        name,
        role,
        phone,
        email,
        password: hashedPassword,
      });
      await user.save();

      return { message: "User registered successfully", status: 200 };
    } catch (err) {
      console.error(err);
      return { error: "Server error", status: 500 };
    }
  },
};

export default authService;
