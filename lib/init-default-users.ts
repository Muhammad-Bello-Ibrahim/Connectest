// File: scripts/init-default-users.ts
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import User from "../lib/models/User"
import connectDB from "../lib/db"

dotenv.config()

async function initDefaultUsers() {
  try {
    await connectDB()
    console.log("✅ MongoDB connected.")

    const defaultUsers = [
      {
        name: "Admin",
        email: "admin@connectrix.com",
        studentId: "admin",
        password: "adminadmin",
        role: "admin",
      },
      {
        name: "Dean",
        email: "dean@connectrix.com",
        studentId: "dean",
        password: "deandean",
        role: "dean",
      },
    ]

    for (const userData of defaultUsers) {
      const existing = await User.findOne({
        $or: [{ studentId: userData.studentId }, { email: userData.email }],
      })

      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        await User.create({
          ...userData,
          password: hashedPassword,
          phone: "",
          address: "",
          state: "",
          localGovt: "",
          religion: "",
          gender: "",
          dob: null,
          mustChangePassword: true,
        })

        console.log(`✅ ${userData.role.toUpperCase()} created.`)
      } else {
        console.log(`ℹ️ ${userData.role.toUpperCase()} already exists.`)
      }
    }

    console.log("✅ Default users initialization complete.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error initializing default users:", error)
    process.exit(1)
  }
}

initDefaultUsers()
