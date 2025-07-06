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
  const facultyAbbr = extractedFaculty;
  const facultyFull = FACULTY_MAP[facultyAbbr] || facultyAbbr;

  const departmentAbbr = extractedDepartment;
  const departmentFull = DEPARTMENT_MAP[departmentAbbr] || departmentAbbr;

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

  return NextResponse.json({ user })
}
