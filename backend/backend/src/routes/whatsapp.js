// get/api/whatsapp
import express from "express";
import axios from "axios";
import Chp from "../models/Chp.js";
import Patient from "../models/Patients.js";
import Session from "../models/Session.js";
import Facility from "../models/Facility.js";

const router = express.Router();

// Africa's Talking sends POST here when CHW messages on WhatsApp
router.post("/", async (req, res) => {
  try {
    const { from, text } = req.body;
    const message = text.trim().toUpperCase();

    // ── Find or Register CHW ──────────────────────
    let chw = await CHW.findOne({ phone: from });

    if (!Chp) {
      // First time this number messages
      // Auto register them
      Chp = await Chp.create({
        name: "CHW " + from.slice(-4),
        phone: from,
        ward: "Unknown",
        county: "Nairobi",
        isVerified: false,
      });

      await sendWhatsApp(
        from,
        `🏥 *Welcome to Afya AI*\n\n` +
          `You have been registered.\n` +
          `Your ID: ${Chp._id}\n\n` +
          `To log a patient send:\n` +
          `*PATIENT* Name, Age, Gender, Symptom1, Symptom2\n\n` +
          `Example:\n` +
          `PATIENT Jane, 28, female, fever, cough\n\n` +
          `For help send: *HELP*`,
      );

      return res.json({ success: true });
    }

    // ── HELP command ──────────────────────────────
    if (message === "HELP") {
      await sendWhatsApp(
        from,
        `🏥 *Afya AI Commands*\n\n` +
          `1️⃣ Log a patient:\n` +
          `PATIENT Name, Age, Gender, Symptom1, Symptom2\n\n` +
          `2️⃣ Example:\n` +
          `PATIENT Jane, 28, female, fever, chest pain\n\n` +
          `3️⃣ View your sessions today:\n` +
          `SESSIONS\n\n` +
          `4️⃣ Emergency:\n` +
          `EMERGENCY`,
      );
      return res.json({ success: true });
    }

    // ── EMERGENCY command ─────────────────────────
    if (message === "EMERGENCY") {
      await sendWhatsApp(
        from,
        `🚨 *EMERGENCY PROTOCOL*\n\n` +
          `Call: 0800 723 253 (free)\n` +
          `Ambulance: 0722 314 239\n\n` +
          `Nearest facilities:\n` +
          `🏥 Mama Lucy: 020 2013344\n` +
          `🏥 Pumwani: 020 2724573\n\n` +
          `Stay with the patient.\n` +
          `Keep them calm and still.`,
      );
      return res.json({ success: true });
    }

    // ── SESSIONS command ──────────────────────────
    if (message === "SESSIONS") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessions = await Session.find({
        chp: Chp._id,
        createdAt: { $gte: today },
      }).populate("patient");

      if (sessions.length === 0) {
        await sendWhatsApp(from, "📋 No sessions recorded today.");
        return res.json({ success: true });
      }

      const list = sessions
        .map((s, i) => `${i + 1}. ${s.patient.name} — *${s.severity}*`)
        .join("\n");

      await sendWhatsApp(
        from,
        `📋 *Your Sessions Today*\n\n${list}\n\n` + `Total: ${sessions.length}`,
      );

      return res.json({ success: true });
    }

    // ── PATIENT command ───────────────────────────
    if (message.startsWith("PATIENT")) {
      // Parse: PATIENT Jane, 28, female, fever, cough
      const raw = text.replace(/patient/i, "").trim();
      const parts = raw.split(",").map((p) => p.trim());

      // Validate minimum parts
      if (parts.length < 4) {
        await sendWhatsApp(
          from,
          `❌ *Wrong format*\n\n` +
            `Send: PATIENT Name, Age, Gender, Symptom1\n\n` +
            `Example:\n` +
            `PATIENT Jane, 28, female, fever, cough`,
        );
        return res.json({ success: true });
      }

      const [name, age, gender, ...symptoms] = parts;

      // Validate age
      if (isNaN(parseInt(age))) {
        await sendWhatsApp(
          from,
          "❌ Age must be a number. Example: PATIENT Jane, *28*, female, fever",
        );
        return res.json({ success: true });
      }

      // Validate gender
      const genderClean = gender.toLowerCase();
      if (!["male", "female"].includes(genderClean)) {
        await sendWhatsApp(from, "❌ Gender must be male or female.");
        return res.json({ success: true });
      }

      // Tell CHW we are processing
      await sendWhatsApp(from, "⏳ Analyzing symptoms...");

      // Save patient
      const patient = await Patient.create({
        name,
        age: parseInt(age),
        gender: genderClean,
        ward: chw.ward,
        county: chw.county,
      });

      // Call AI service
      const { data: diagnosis } = await axios.post(
        `${process.env.AI_SERVICE_URL}/diagnose`,
        {
          patient_age: patient.age,
          patient_gender: patient.gender,
          symptoms,
        },
      );

      // Find nearest facility
      const facility = await Facility.findOne({
        type: diagnosis.facility_type || "health_centre",
      });

      // Save session
      const session = await Session.create({
        patient: patient._id,
        chp: Chp._id,
        symptoms,
        severity: diagnosis.severity,
        possibleConditions: diagnosis.possible_conditions,
        immediateActions: diagnosis.immediate_actions,
        referToFacility: diagnosis.refer_to_facility,
        facilityType: diagnosis.facility_type,
        chwInstructions: diagnosis.chw_instructions,
      });

      // Severity emoji
      const emoji = {
        EMERGENCY: "🚨",
        HIGH: "⚠️",
        MEDIUM: "🟡",
        LOW: "✅",
      }[diagnosis.severity];

      // Build response message
      let reply =
        `${emoji} *${diagnosis.severity}*\n\n` +
        `*Patient:* ${name}, ${age}yr ${gender}\n` +
        `*Symptoms:* ${symptoms.join(", ")}\n\n` +
        `*Possible:* ${diagnosis.possible_conditions.join(", ")}\n\n` +
        `*Action:* ${diagnosis.chw_instructions}\n\n`;

      if (diagnosis.refer_to_facility && facility) {
        reply +=
          `*Refer to:* ${facility.name}\n` + `*Call:* ${facility.phone}\n\n`;
      }

      reply += `_Patient saved ✓ Session #${session._id.toString().slice(-6)}_`;

      await sendWhatsApp(from, reply);
      return res.json({ success: true });
    }

    // ── Unknown command ───────────────────────────
    await sendWhatsApp(
      from,
      `❓ I didn't understand that.\n\n` +
        `Send *HELP* to see available commands.`,
    );

    res.json({ success: true });
  } catch (err) {
    console.error("WhatsApp route error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Helper: Send WhatsApp message via Africa's Talking ────────────
async function sendWhatsApp(to, message) {
  try {
    // Africa's Talking WhatsApp uses same SMS endpoint
    // but with a WhatsApp channel
    const response = await axios.post(
      "https://api.africastalking.com/version1/messaging",
      new URLSearchParams({
        username: process.env.AT_USERNAME,
        to,
        message,
        channel: "whatsapp",
      }),
      {
        headers: {
          apiKey: process.env.AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return response.data;
  } catch (err) {
    console.error("WhatsApp send error:", err.message);
  }
}

export default router;