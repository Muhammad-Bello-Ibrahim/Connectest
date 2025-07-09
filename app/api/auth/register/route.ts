import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import User from "@/lib/models/User"
import Club from "@/lib/models/Club"
import connectDB from "@/lib/db"

// Input validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(100),
  studentId: z.string().optional(),
  phone: z.string().min(10, "Phone number too short").max(20, "Phone number too long").optional(),
  localGovt: z.string().max(50).optional(),
  address: z.string().max(200).optional(),
  religion: z.string().max(50).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dob: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
  role: z.enum(["student", "admin", "dean"]).optional(),
  level: z.string().max(20).optional(),
  faculty: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
})

function normalize(str?: string) {
  return typeof str === "string" ? str.trim().toUpperCase() : ""
}

const FACULTY_MAP: Record<string, string> = {
  AS: "ARTS AND SOCIAL SCIENCES",
  ED: "EDUCATION",
  LL: "LAW",
  MD: "MEDICINE",
  PH: "PHARMACY",
  SC: "SCIENCE",
};

const DEPARTMENT_MAP: Record<string, string> = {
  AC: "ACCOUNTING",
  AR: "ARCHITECTURE",
  BA: "BUSINESS ADMINISTRATION",
  BF: "BANKING AND FINANCE",
  CR: "CRIMINOLOGY",
  EC: "ECONOMICS",
  ECE: "ECONOMIC EDUCATION",
  EM: "EDUCATIONAL MANAGEMENT",
  EN: "ENGLISH",
  HS: "HISTORY",
  IN: "INTERNATIONAL RELATIONS",
  IR: "ISLAMIC STUDIES",
  LS: "LIBRARY AND INFORMATION SCIENCE",
  PA: "PUBLIC ADMINISTRATION",
  PC: "PEACE STUDIES AND CONFLICT RESOLUTION",
  PS: "POLITICAL SCIENCE",
  PSE: "POLITICAL SCIENCE EDUCATION",
  SG: "SOCIOLOGY",
  BL: "LAW",
  HA: "HUMAN ANATOMY",
  HN: "HUMAN NUTRITION AND DIETETICS",
  HP: "HUMAN PHYSIOLOGY",
  MD: "MEDICINE",
  NS: "NURSING",
  PH: "PHARM D.",
  PHT: "PUBLIC HEALTH",
  PM: "PHARMACOLOGY",
  BC: "BIOCHEMISTRY",
  BH: "BIOTECHNOLOGY",
  BS: "BIOLOGY",
  BT: "BOTANY",
  CH: "CHEMISTRY",
  CS: "COMPUTER SCIENCE",
  ET: "ENVIRONMENTAL TECHNOLOGY",
  GL: "GEOLOGY",
  GS: "GEOGRAPHY",
  MC: "MICROBIOLOGY",
  MT: "MATHEMATICS",
  PV: "PHYSICS",
  PY: "PURE AND APPLIED PHYSICS",
  SL: "SCIENCE LABORATORY TECHNOLOGY",
  ST: "STATISTICS",
  ZO: "ZOOLOGY",
};

export async function POST(req: NextRequest) {
  await connectDB()
  
  try {
    const body = await req.json()

    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validationResult.error.issues 
      }, { status: 400 })
    }

    const data = validationResult.data

    // Normalize relevant fields for case-insensitive matching
    const faculty = normalize(data.faculty)
    const department = normalize(data.department)
    const state = normalize(data.state)
    const religion = normalize(data.religion)

    // Extract faculty and department from studentId if provided
    let extractedFaculty = faculty;
    let extractedDepartment = department;
    if (data.studentId) {
      const match = data.studentId.match(/^UG\d{2}\/([A-Z]{2})([A-Z]{2})\/\d+$/i)
      if (match) {
        extractedFaculty = normalize(match[1])
        extractedDepartment = normalize(match[2])
      }
    }

    // Check for existing user (case-insensitive email, exact studentId)
    const existing = await User.findOne({
      $or: [
        { email: data.email.toLowerCase() }, 
        ...(data.studentId ? [{ studentId: data.studentId.toUpperCase() }] : [])
      ]
    });
    if (existing) {
      return NextResponse.json({ 
        error: "Email or Student ID already registered." 
      }, { status: 409 });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(data.password, 12) // Increased rounds from 10 to 12

    // Resolve faculty and department full names
    const facultyAbbr = extractedFaculty;
    const facultyFull = FACULTY_MAP[facultyAbbr] || facultyAbbr;
    const departmentAbbr = extractedDepartment;
    const departmentFull = DEPARTMENT_MAP[departmentAbbr] || departmentAbbr;

    // Find matching clubs
    const matchingClubs = await Club.find({
      $or: [
        { type: "faculty", faculty: { $in: [facultyAbbr, facultyFull] } },
        { type: "department", faculty: { $in: [facultyAbbr, facultyFull] }, department: { $in: [departmentAbbr, departmentFull] } },
        { type: "state", state },
        { type: "religion", religion },
        { type: "general" },
      ],
    })

    const user = await User.create({
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      studentId: data.studentId?.toUpperCase(),
      phone: data.phone?.trim(),
      state,
      localGovt: data.localGovt?.trim(),
      address: data.address?.trim(),
      religion,
      gender: data.gender,
      dob: data.dob,
      password: hashedPassword,
      role: data.role || "student",
      level: data.level?.trim(),
      faculty: facultyAbbr,
      facultyFull,
      department: departmentAbbr,
      departmentFull,
      clubs: matchingClubs.map((club) => club._id),
    });

    // Log successful registration (without sensitive data)
    console.log("New user registered:", {
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      faculty: user.faculty,
      department: user.department,
      clubsMatched: matchingClubs.length,
    });

    const userObj = user.toObject();
    delete userObj.password; // Remove password from response

    return NextResponse.json({
      message: "Registration successful",
      user: {
        _id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        studentId: userObj.studentId,
        phone: userObj.phone,
        state: userObj.state,
        localGovt: userObj.localGovt,
        address: userObj.address,
        religion: userObj.religion,
        gender: userObj.gender,
        dob: userObj.dob,
        role: userObj.role,
        level: userObj.level,
        faculty: userObj.faculty,
        facultyFull: userObj.facultyFull,
        department: userObj.department,
        departmentFull: userObj.departmentFull,
        bio: userObj.bio,
        avatar: userObj.avatar,
        clubsMatched: matchingClubs.length,
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ 
      error: "Registration failed" 
    }, { status: 500 });
  }
}
