import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/lib/models/User"
import Club from "@/lib/models/Club"
import connectDB from "@/lib/db"

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
  const data = await req.json()

  // Destructure all fields from data
  const {
    name,
    email,
    studentId,
    phone,
    localGovt,
    address,
    religion: rawReligion,
    gender,
    dob,
    password,
    role,
    level,
    faculty: rawFaculty,
    department: rawDepartment,
    state: rawState,
  } = data

  // Normalize relevant fields
  const faculty = normalize(rawFaculty)
  const department = normalize(rawDepartment)
  const state = normalize(rawState)
  const religion = normalize(rawReligion)

  // If extracting from studentId, normalize those too:
  let extractedFaculty = faculty;
  let extractedDepartment = department;
  if (studentId) {
    const match = studentId.match(/^UG\d{2}\/([A-Z]{2})([A-Z]{2})\/\d+$/i)
    if (match) {
      extractedFaculty = normalize(match[1])
      extractedDepartment = normalize(match[2])
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // After extracting and normalizing
  const facultyAbbr = extractedFaculty; // e.g. "SC"
  const facultyFull = FACULTY_MAP[facultyAbbr] || facultyAbbr; // e.g. "SCIENCE"

  const departmentAbbr = extractedDepartment; // e.g. "CS"
  const departmentFull = DEPARTMENT_MAP[departmentAbbr] || departmentAbbr; // e.g. "COMPUTER SCIENCE"

  // Automatch clubs
  const matchingClubs = await Club.find({
    $or: [
      { type: "faculty", faculty: { $in: [facultyAbbr, facultyFull] } },
      { type: "department", faculty: { $in: [facultyAbbr, facultyFull] }, department: { $in: [departmentAbbr, departmentFull] } },
      { type: "state", state },
      { type: "religion", religion },
      { type: "general" },
    ],
  })

  const existing = await User.findOne({
    $or: [{ email }, { studentId }]
  });
  if (existing) {
    return NextResponse.json({ error: "Email or Student ID already registered." }, { status: 409 });
  }

  try {
    const user = await User.create({
      name,
      email,
      studentId,
      phone,
      state,
      localGovt,
      address,
      religion,
      gender,
      dob,
      password: hashedPassword,
      role: role || "student",
      level,
      faculty: facultyAbbr,
      facultyFull,
      department: departmentAbbr,
      departmentFull,
      clubs: matchingClubs.map((club) => club._id),
    });

    // Log user details and club names
    console.log("New user registered:", {
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      faculty: user.faculty,
      department: user.department,
      clubs: matchingClubs.map((club) => club.name),
    });
    console.log({
      facultyAbbr,
      facultyFull,
      departmentAbbr,
      departmentFull,
      state,
      religion,
      clubsFound: matchingClubs.map(c => ({
        name: c.name,
        type: c.type,
        faculty: c.faculty,
        department: c.department,
        state: c.state,
        religion: c.religion,
      })),
    });

    const userObj = user.toObject();
    delete userObj.password; // Remove password from response

    return NextResponse.json({
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
        // clubs: userObj.clubs, // if you want to return clubs
      }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Registration failed", details: err?.message || err }, { status: 500 });
  }
}
