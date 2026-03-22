import dotenv from 'dotenv'
dotenv.config();
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Facility from './models/Facility.js';
import Chp from './models/Chp.js';
import User from './models/User.js';
await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected');

// clear existing data
await Facility.deleteMany();
await Chp.deleteMany();

// Seed Facilities
await Facility.insertMany([
  {
    name: "Thika Level 5 Hospital",
    type: "hospital",
    county: "Thika",
    ward: "Township",
    phone: "+25470000000001",
  },
  {
    name: "Mary-Help Hospital",
    type: "hospital",
    county: "Kiambu",
    ward: "Township",
    phone: "+254700000002",
  },
  {
    name: "Ruiru Level 4",
    type: "hospital",
    county: "Kiambu",
    ward: "Ruiru",
    phone: "+254700000003",
  },
  {
    name: "Avenue Hospital",
    type: "hospital",
    county: "Kiambu",
    ward: "Township",
    phone: "+254700000004",
  },
  {
    name: "Makongeni Health Centre",
    type: "health_centre",
    county: "Kiambu",
    ward: "Makongeni",
    phone: "+24570000000005",
  },
]);
console.log('Facilities seeded');

// seed Chps
await Chp.insertMany([
  {
    name: "Peter Kamau",
    phone: "+254712000001",
    ward: "Makongeni",
    county: "Kiambu",
    isVerified: true,
  },
  {
    name: "Grace Njeri",
    phone: "+254712000002",
    ward: "Ruiru",
    county: "Kiambu",
    isVerified: true,
  },
  {
    name: "John Mwangi",
    phone: "+254712000003",
    ward: "Township",
    county: "Nairobi",
    isVerified: true,
  },
  {
    name: "Fatuma Omar",
    phone: "+254712000004",
    ward: "Igegania",
    county: "Kiambu",
    isVerified: true,
  },
  {
    name: "James Odhiambo",
    phone: "+254712000005",
    ward: "Landless",
    county: "Kiambu",
    isVerified: true,
  },
]);
console.log('Chps seeded');

// supervisor login
const password = await bcrypt.hash("admin123", 10);
await User.findOneAndUpdate(
  { email: "supervisor@test.com" },
  {
    name: "Test Supervisor",
    email: "supervisor@test.com",
    role: "supervisor",
    password,
    phone: "+254700000000",
  },
  { upsert: true, new: true },
);
console.log("✅ Supervisor: supervisor@test.com / admin123");

await mongoose.disconnect();
console.log('seed complete');
process.exit(0);