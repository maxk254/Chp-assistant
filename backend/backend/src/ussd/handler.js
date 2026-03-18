// handles all ussd logic
import Chp from '../models/Chp.js';
// import africastalking from 'africastalking';
import Patient from '../models/Patients.js';
import Session from '../models/Session.js';
import Facility from '../models/Facility.js';
import Alert from '../models/Alert.js';
import axios from 'axios';
import {
  sendCHPWelcomeSMS,
  sendCHPSummarySMS,
  sendPatientReferralSMS,
  sendFacilityAlertSMS
} from '../services/smsService.js';

// ── In-memory session store ───────────────────────
// Holds data between USSD steps for each session
const sessionStore = {};

export default async (req, res) => {

  // ── What Africa's Talking sends on every keypress
  const { sessionId, phoneNumber, text } = req.body;
    
  //TEMPORARILY
  console.log('USSD Request received:');
  console.log('sessionId:', sessionId);
  console.log('phoneNumber:', phoneNumber);
  console.log('text:', text);
  // Split all inputs — every * separates a step
  // text = ""          → steps = []     → step 0
  // text = "1"         → steps = ["1"]  → step 1
  // text = "1*Jane"    → steps = ["1","Jane"] → step 2
  const steps = text ? text.split('*') : [];
  const step  = steps.length;

  // Always respond with plain text for USSD
  res.set('Content-Type', 'text/plain');

  try {

    // ── Find Chp by phone number ──────────────────
    let Chp = await Chp.findOne({ phone: phoneNumber });

    // ════════════════════════════════════════════════
    // ONBOARDING — Chp not registered yet
    // ════════════════════════════════════════════════
    if (!Chp) {

      // Step 0 — First dial, ask for name
      if (step === 0) {
        sessionStore[sessionId] = {};
        return res.send(
          `CON Welcome to Afya AI 🏥\n` +
          `Chp Registration\n\n` +
          `Enter your full name:`
        );
      }

      // Step 1 — Got name, ask for ward
      if (step === 1) {
        sessionStore[sessionId] = { name: steps[0] };
        return res.send(
          `CON Enter your ward\n` +
          `(e.g. Mathare, Kibera, Kangemi):`
        );
      }

      // Step 2 — Got ward, ask for county
      if (step === 2) {
        sessionStore[sessionId].ward = steps[1];
        return res.send(
          `CON Enter your county\n` +
          `(e.g. Nairobi, Mombasa, Kisumu):`
        );
      }

      // Step 3 — Got all data, create Chp
      if (step === 3) {
        sessionStore[sessionId].county = steps[2];

        // Save Chp to database
        Chp = await Chp.create({
          name:       sessionStore[sessionId].name,
          phone:      phoneNumber,
          ward:       sessionStore[sessionId].ward,
          county:     sessionStore[sessionId].county,
          isVerified: false
        });

        // Clean up session store
        delete sessionStore[sessionId];

        // Send welcome SMS to Chp
        await sendCHPWelcomeSMS(Chp);

        return res.send(
          `END ✅ Registration Complete!\n\n` +
          `Welcome ${Chp.name}.\n` +
          `Ward: ${Chp.ward}\n` +
          `County: ${Chp.county}\n\n` +
          `Check your SMS for details.\n` +
          `Dial again to start logging patients.`
        );
      }
    }

    // ════════════════════════════════════════════════
    // MAIN MENU — Step 0 for registered Chp
    // ════════════════════════════════════════════════
    if (step === 0) {
      // Initialize fresh session
      sessionStore[sessionId] = {};

      return res.send(
        `CON Afya AI 🏥\n` +
        `Hello ${Chp.name}\n` +
        `Ward: ${Chp.ward}\n\n` +
        `1. New Patient Visit\n` +
        `2. My Sessions Today\n` +
        `3. My Patient History\n` +
        `4. Emergency Referral\n` +
        `5. My Profile`
      );
    }

    const mainChoice = steps[0];

    // ════════════════════════════════════════════════
    // OPTION 1 — NEW PATIENT VISIT
    // ════════════════════════════════════════════════
    if (mainChoice === '1') {

      // Step 1 → Ask patient name
      if (step === 1) {
        return res.send(
          `CON New Patient Visit\n\n` +
          `Enter patient full name:`
        );
      }

      // Step 2 → Ask patient age
      if (step === 2) {
        sessionStore[sessionId].patientName = steps[1];
        return res.send(`CON Enter patient age:`);
      }

      // Step 3 → Ask gender
      if (step === 3) {
        // Validate age is a number
        if (isNaN(parseInt(steps[2]))) {
          return res.send(
            `CON ❌ Invalid age.\n` +
            `Please enter a number:\n` +
            `(e.g. 28)`
          );
        }
        sessionStore[sessionId].patientAge = steps[2];
        return res.send(
          `CON Select patient gender:\n\n` +
          `1. Male\n` +
          `2. Female`
        );
      }

      // Step 4 → Ask patient phone number
      if (step === 4) {
        sessionStore[sessionId].gender =
          steps[3] === '1' ? 'male' : 'female';
        return res.send(
          `CON Enter patient phone number\n` +
          `(to receive referral SMS)\n\n` +
          `Enter number or 0 to skip:`
        );
      }

      // Step 5 → Ask first symptom
      if (step === 5) {
        // Store phone — null if they entered 0
        sessionStore[sessionId].patientPhone =
          steps[4] === '0' ? null : steps[4];

        return res.send(
          `CON Select main symptom:\n\n` +
          `1. Fever\n` +
          `2. Cough\n` +
          `3. Difficulty Breathing\n` +
          `4. Vomiting or Diarrhea\n` +
          `5. Chest Pain\n` +
          `6. Unconscious or Seizure\n` +
          `7. Bleeding\n` +
          `8. Headache or Stiff Neck`
        );
      }

      // Step 6 → Ask second symptom
      if (step === 6) {
        const symptomMap = {
          '1':'Fever',
          '2':'Cough',
          '3':'Difficulty Breathing',
          '4':'Vomiting',
          '5':'Chest Pain',
          '6':'Unconscious',
          '7':'Bleeding',
          '8':'Headache'
        };
        sessionStore[sessionId].symptom1 =
          symptomMap[steps[5]] || 'Unknown';

        return res.send(
          `CON Any other symptom?\n\n` +
          `1. Fever\n` +
          `2. Cough\n` +
          `3. Difficulty Breathing\n` +
          `4. Vomiting or Diarrhea\n` +
          `5. Chest Pain\n` +
          `6. Headache\n` +
          `7. None`
        );
      }

      // Step 7 → Ask if patient is conscious/responsive
      if (step === 7) {
        const symptomMap2 = {
          '1':'Fever',
          '2':'Cough',
          '3':'Difficulty Breathing',
          '4':'Vomiting',
          '5':'Chest Pain',
          '6':'Headache',
          '7': null
        };
        const symptom2 = symptomMap2[steps[6]];
        const symptoms = [sessionStore[sessionId].symptom1];
        if (symptom2) symptoms.push(symptom2);
        sessionStore[sessionId].symptoms = symptoms;

        return res.send(
          `CON Is the patient conscious?\n\n` +
          `1. Yes — fully awake\n` +
          `2. Confused or drowsy\n` +
          `3. Unconscious`
        );
      }

      // Step 8 → Process everything, get diagnosis, send SMS
      if (step === 8) {
        // Store consciousness level
        const consciousnessMap = {
          '1': 'Fully conscious',
          '2': 'Confused or drowsy',
          '3': 'Unconscious'
        };
        const consciousness = consciousnessMap[steps[7]];

        // Add to symptoms if not fully conscious
        if (steps[7] !== '1') {
          sessionStore[sessionId].symptoms.push(consciousness);
        }

        const symptoms = sessionStore[sessionId].symptoms;

        // ── Save patient to DB ──────────────────────
        const patient = await Patient.create({
          name:   sessionStore[sessionId].patientName,
          age:    parseInt(sessionStore[sessionId].patientAge),
          gender: sessionStore[sessionId].gender,
          phone:  sessionStore[sessionId].patientPhone,
          ward:   Chp.ward,
          county: Chp.county
        });

        // ── Call AI Service ─────────────────────────
        let diagnosis;
        try {
          const { data } = await axios.post(
            `${process.env.AI_SERVICE_URL}/diagnose`,
            {
              patient_age:    patient.age,
              patient_gender: patient.gender,
              symptoms
            }
          );
          diagnosis = data;
        } catch (err) {
          console.error('AI Service unreachable:', err.message);
          // Safe fallback — never leave Chp without guidance
          diagnosis = {
            severity:            'HIGH',
            possible_conditions: ['Unable to assess — manual review needed'],
            immediate_actions:   ['Refer to nearest facility immediately'],
            refer_to_facility:   true,
            facility_type:       'health_centre',
            Chp_instructions:    'AI service unavailable. Refer patient to nearest health centre immediately.'
          };
        }

        // ── Find nearest suitable facility ──────────
        const facility = await Facility.findOne({
          type: diagnosis.facility_type || 'health_centre'
        });

        // ── Save session to DB ──────────────────────
        const session = await Session.create({
          patient:            patient._id,
          Chp:                Chp._id,
          symptoms,
          severity:           diagnosis.severity,
          possibleConditions: diagnosis.possible_conditions,
          immediateActions:   diagnosis.immediate_actions,
          referToFacility:    diagnosis.refer_to_facility,
          facilityType:       diagnosis.facility_type,
          ChpInstructions:    diagnosis.Chp_instructions
        });

        // ── Save alert if HIGH or EMERGENCY ─────────
        if (
          ['HIGH', 'EMERGENCY'].includes(diagnosis.severity) &&
          facility
        ) {
          await Alert.create({
            session:  session._id,
            facility: facility._id,
            smsSent:  true
          });
        }

        // ── Fire all SMS simultaneously ─────────────
        const smsPromises = [
          // Always send Chp summary
          sendCHPSummarySMS(Chp, patient, diagnosis, facility),
        ];

        // Send patient SMS only if phone provided
        if (patient.phone) {
          smsPromises.push(
            sendPatientReferralSMS(
              patient.phone,
              patient.name,
              diagnosis,
              facility
            )
          );
        }

        // Send facility alert only if HIGH or EMERGENCY
        if (
          ['HIGH', 'EMERGENCY'].includes(diagnosis.severity) &&
          facility
        ) {
          smsPromises.push(
            sendFacilityAlertSMS(facility, patient, diagnosis)
          );
        }

        // Run all SMS at same time
        await Promise.all(smsPromises);

        // ── Clean up session store ──────────────────
        delete sessionStore[sessionId];

        // ── Build USSD response ─────────────────────
        const severityDisplay = {
          EMERGENCY: '🚨 EMERGENCY',
          HIGH:      '⚠️  HIGH',
          MEDIUM:    '🟡 MEDIUM',
          LOW:       '✅ LOW'
        }[diagnosis.severity];

        let response =
          `END ${severityDisplay}\n\n` +
          `Patient: ${patient.name}\n` +
          `${diagnosis.Chp_instructions}\n`;

        if (diagnosis.possible_conditions?.length) {
          response +=
            `\nPossible: ${diagnosis.possible_conditions[0]}`;
        }

        if (diagnosis.refer_to_facility && facility) {
          response +=
            `\n\nRefer to:\n` +
            `${facility.name}\n` +
            `Call: ${facility.phone}`;
        }

        // Tell Chp what SMS was sent
        response += `\n\n`;
        response += `SMS sent to you ✓\n`;
        if (patient.phone) response += `SMS sent to patient ✓\n`;
        if (['HIGH','EMERGENCY'].includes(diagnosis.severity)) {
          response += `Facility alerted ✓`;
        }

        return res.send(response);
      }
    }

    // ════════════════════════════════════════════════
    // OPTION 2 — MY SESSIONS TODAY
    // ════════════════════════════════════════════════
    if (mainChoice === '2') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessions = await Session.find({
        Chp:       Chp._id,
        createdAt: { $gte: today }
      }).populate('patient');

      if (sessions.length === 0) {
        return res.send(
          `END 📋 No sessions today yet.\n\n` +
          `Select option 1 to\n` +
          `log your first patient.`
        );
      }

      // Show max 5 to fit USSD screen
      const list = sessions.slice(0, 5).map((s, i) =>
        `${i + 1}. ${s.patient.name} - ${s.severity}`
      ).join('\n');

      const more = sessions.length > 5
        ? `\n...and ${sessions.length - 5} more`
        : '';

      return res.send(
        `END 📋 Today's Sessions (${sessions.length})\n\n` +
        `${list}${more}\n\n` +
        `SMS summary sent to you ✓`
      );
    }

    // ════════════════════════════════════════════════
    // OPTION 3 — MY PATIENT HISTORY
    // ════════════════════════════════════════════════
    if (mainChoice === '3') {

      if (step === 1) {
        return res.send(
          `CON Patient History\n\n` +
          `1. This week\n` +
          `2. This month\n` +
          `3. All time`
        );
      }

      if (step === 2) {
        const now = new Date();
        let startDate = new Date();

        if (steps[1] === '1') {
          // This week — last 7 days
          startDate.setDate(now.getDate() - 7);
        } else if (steps[1] === '2') {
          // This month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
          // All time
          startDate = new Date(0);
        }

        const sessions = await Session.find({
          Chp:       Chp._id,
          createdAt: { $gte: startDate }
        });

        const total      = sessions.length;
        const emergency  = sessions.filter(s => s.severity === 'EMERGENCY').length;
        const high       = sessions.filter(s => s.severity === 'HIGH').length;
        const medium     = sessions.filter(s => s.severity === 'MEDIUM').length;
        const low        = sessions.filter(s => s.severity === 'LOW').length;
        const referrals  = sessions.filter(s => s.referToFacility).length;

        const period = steps[1] === '1'
          ? 'This Week'
          : steps[1] === '2'
          ? 'This Month'
          : 'All Time';

        return res.send(
          `END 📊 ${period}\n\n` +
          `Total Patients: ${total}\n` +
          `🚨 Emergency: ${emergency}\n` +
          `⚠️  High: ${high}\n` +
          `🟡 Medium: ${medium}\n` +
          `✅ Low: ${low}\n` +
          `Referrals: ${referrals}`
        );
      }
    }

    // ════════════════════════════════════════════════
    // OPTION 4 — EMERGENCY REFERRAL
    // ════════════════════════════════════════════════
    if (mainChoice === '4') {
      // Get nearest hospital
      const hospital = await Facility.findOne({ type: 'hospital' });

      return res.send(
        `END 🚨 EMERGENCY PROTOCOL\n\n` +
        `Call ambulance:\n` +
        `0722 314 239\n\n` +
        `Emergency hotline:\n` +
        `0800 723 253 (FREE)\n\n` +
        `Nearest hospital:\n` +
        `${hospital?.name || 'Mama Lucy Hospital'}\n` +
        `${hospital?.phone || '020 2013344'}\n\n` +
        `Stay with patient.\n` +
        `Keep them calm and still.`
      );
    }

    // ════════════════════════════════════════════════
    // OPTION 5 — MY PROFILE
    // ════════════════════════════════════════════════
    if (mainChoice === '5') {
      // Get total sessions for this Chp
      const totalSessions = await Session.countDocuments({
        Chp: Chp._id
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = await Session.countDocuments({
        Chp:       Chp._id,
        createdAt: { $gte: today }
      });

      return res.send(
        `END 👤 My Profile\n\n` +
        `Name: ${Chp.name}\n` +
        `Phone: ${Chp.phone}\n` +
        `Ward: ${Chp.ward}\n` +
        `County: ${Chp.county}\n` +
        `Status: ${Chp.isVerified ? '✅ Verified' : '⏳ Pending'}\n\n` +
        `📊 Stats:\n` +
        `Today: ${todaySessions} patients\n` +
        `Total: ${totalSessions} patients`
      );
    }

    // ── Invalid input ─────────────────────────────
    return res.send(
      `END ❌ Invalid option.\n` +
      `Please dial again.`
    );

  } catch (err) {
    console.error('USSD Handler error:', err);
    // Clean up session on error
    delete sessionStore[sessionId];
    return res.send(
      `END ⚠️ Something went wrong.\n` +
      `Please try again.\n` +
      `If problem persists call support.`
    );
  }
};
