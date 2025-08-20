import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
// Models and utils will be dynamically imported after DB connection
import connectDB from "@/lib/db"

// Input validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(100).optional(),
  studentId: z.string(),
  faculty: z.string(),
  department: z.string(),
  state: z.string().optional(),
  religion: z.string().optional(),
  localGovt: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
  confirmPassword: z.string().optional(),
  acceptPolicy: z.boolean().optional()
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
  await connectDB();
  try {
    const body = await req.json();

    // Dynamically import models and utils after DB connection
    const User = (await import("@/lib/models/User")).default;
    const { assignAndCreateClubsForUser } = await import("@/lib/utils");


    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Invalid input data',
        details: validationResult.error.issues
      }, { status: 400 });
    }

    const data = validationResult.data;
    // acceptPolicy is now optional - no enforcement for minimal student registration

    // Normalize relevant fields for case-insensitive matching
    const faculty = normalize(data.faculty);
    const department = normalize(data.department);
    const state = normalize(data.state);
    const religion = normalize(data.religion);

    // Extract faculty and department from studentId if provided
    let extractedFaculty = faculty;
    let extractedDepartment = department;
    if (data.studentId) {
      const match = data.studentId.match(/^UG\d{2}\/([A-Z]{2})([A-Z]{2})\/\d+$/i);
      if (match) {
        extractedFaculty = normalize(match[1]);
        extractedDepartment = normalize(match[2]);
      }
    }

    // Check for existing user (case-insensitive email if provided, exact studentId)
    const existingConditions = [];
    if (data.email) {
      existingConditions.push({ email: data.email.toLowerCase() });
    }
    if (data.studentId) {
      existingConditions.push({ studentId: data.studentId.toUpperCase() });
    }

    if (existingConditions.length > 0) {
      const existing = await User.findOne({
        $or: existingConditions
      });
      if (existing) {
        return NextResponse.json({
          error: "Email or Student ID already registered."
        }, { status: 409 });
      }
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Resolve faculty and department full names
    const facultyAbbr = extractedFaculty;
    const facultyFull = FACULTY_MAP[facultyAbbr] || facultyAbbr;
    const departmentAbbr = extractedDepartment;
    const departmentFull = DEPARTMENT_MAP[departmentAbbr] || departmentAbbr;

    // Assign and auto-create clubs as needed (always add SRC, match by faculty/department/state/religion/LGA)
    const clubs = await assignAndCreateClubsForUser({
      facultyAbbr,
      facultyFull,
      departmentAbbr,
      departmentFull,
      state,
      religion,
      lga: data.localGovt,
    });

    const user = await User.create({
      name: data.name.trim(),
      ...(data.email && { email: data.email.toLowerCase() }),
      studentId: data.studentId?.toUpperCase(),
      password: hashedPassword,
      faculty: facultyAbbr,
      facultyFull,
      department: departmentAbbr,
      departmentFull,
      state,
      religion,
      localGovt: data.localGovt,
      clubs,
    });

    // Log successful registration (without sensitive data)
    console.log("New user registered:", {
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      faculty: user.faculty,
      department: user.department,
      clubsMatched: clubs.length,
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
        // ...other fields omitted for minimal response...
        role: userObj.role,
        faculty: userObj.faculty,
        facultyFull: userObj.facultyFull,
        department: userObj.department,
        departmentFull: userObj.departmentFull,
        bio: userObj.bio,
        avatar: userObj.avatar,
        clubsMatched: clubs.length,
      }
    }, { status: 201 });
  } catch (err: unknown) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({
      error: "Registration failed"
    }, { status: 500 });
  }
}
