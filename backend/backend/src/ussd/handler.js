import CHPModel from '../models/Chp.js';
import Patient from '../models/Patients.js';
import Session from '../models/Session.js';
import Facility from '../models/Facility.js';
import Alert from '../models/Alert.js';
import axios from 'axios';
import {
  sendCHPWelcomeSMS,
  sendCHPSummarySMS,
  sendPatientReferralSMS,
  sendFacilityAlertSMS,
} from '../services/smsService.js';

// ── In-memory session store ───────────────────────
const sessionStore = {};

export default async (req, res) => {

  const { sessionId, phoneNumber, text } = req.body;
  const steps = text ? text.split('*') : [];
  const step  = steps.length;

  res.set('Content-Type', 'text/plain');

  try {

    // ── Find CHP by phone ─────────────────────────
    let chp = await CHPModel.findOne({ phone: phoneNumber });

    // ════════════════════════════════════════════════
    // ONBOARDING — CHP not registered yet
    // ════════════════════════════════════════════════
    if (!chp) {

      if (step === 0) {
        sessionStore[sessionId] = {};
        return res.send(
          `CON Welcome to CHP AI ASSISTANT 🏥\n` +
          `CHP Registration\n\n` +
          `Enter your full name:`
        );
      }

      if (step === 1) {
        sessionStore[sessionId] = { name: steps[0] };
        return res.send(
          `CON Enter your ward\n` +
          `(e.g. Mathare, Kibera, Kangemi):`
        );
      }

      if (step === 2) {
        sessionStore[sessionId].ward = steps[1];
        return res.send(
          `CON Enter your county\n` +
          `(e.g. Nairobi, Mombasa, Kisumu):`
        );
      }

      if (step === 3) {
        sessionStore[sessionId].county = steps[2];

        chp = await CHPModel.create({
          name:       sessionStore[sessionId].name,
          phone:      phoneNumber,
          ward:       sessionStore[sessionId].ward,
          county:     sessionStore[sessionId].county,
          isVerified: false
        });

        delete sessionStore[sessionId];

        await sendCHPWelcomeSMS(chp);

        return res.send(
          `END ✅ Registration Complete!\n\n` +
          `Welcome ${chp.name}.\n` +
          `Ward: ${chp.ward}\n` +
          `County: ${chp.county}\n\n` +
          `Check your SMS for details.\n` +
          `Dial again to start logging patients.`
        );
      }
    }

    // ════════════════════════════════════════════════
    // MAIN MENU
    // ════════════════════════════════════════════════
    if (step === 0) {
      sessionStore[sessionId] = {};

      return res.send(
        `CON Afya AI 🏥\n` +
        `Hello ${chp.name}\n` +
        `Ward: ${chp.ward}\n\n` +
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

      // Step 1 → Patient name
      if (step === 1) {
        return res.send(
          `CON New Patient Visit\n\n` +
          `Enter patient full name:`
        );
      }

      // Step 2 → Patient age
      if (step === 2) {
        sessionStore[sessionId].patientName = steps[1];
        return res.send(`CON Enter patient age:`);
      }

      // Step 3 → Gender
      if (step === 3) {
        if (isNaN(parseInt(steps[2]))) {
          return res.send(
            `CON Invalid age.\n` +
            `Please enter a number e.g. 28:`
          );
        }
        sessionStore[sessionId].patientAge = steps[2];
        return res.send(
          `CON Select patient gender:\n\n` +
          `1. Male\n` +
          `2. Female`
        );
      }

      // Step 4 → Patient phone
      if (step === 4) {
        sessionStore[sessionId].gender =
          steps[3] === '1' ? 'male' : 'female';
        return res.send(
          `CON Enter patient phone number\n` +
          `(to receive referral SMS)\n\n` +
          `Enter number or 0 to skip:`
        );
      }

      // Step 5 → First symptom
      if (step === 5) {
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

      // Step 6 → Second symptom
      if (step === 6) {
        const symptomMap = {
          '1': 'Fever',
          '2': 'Cough',
          '3': 'Difficulty Breathing',
          '4': 'Vomiting',
          '5': 'Chest Pain',
          '6': 'Unconscious',
          '7': 'Bleeding',
          '8': 'Headache'
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

      // Step 7 → Consciousness level
      if (step === 7) {
        const symptomMap2 = {
          '1': 'Fever',
          '2': 'Cough',
          '3': 'Difficulty Breathing',
          '4': 'Vomiting',
          '5': 'Chest Pain',
          '6': 'Headache',
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

      // Step 8 → Process + Diagnose + Save + SMS
      if (step === 8) {
        const consciousnessMap = {
          '1': 'Fully conscious',
          '2': 'Confused or drowsy',
          '3': 'Unconscious'
        };
        const consciousness = consciousnessMap[steps[7]];

        if (steps[7] !== '1') {
          sessionStore[sessionId].symptoms.push(consciousness);
        }

        const symptoms = sessionStore[sessionId].symptoms;

        // ── Save patient ────────────────────────────
        const patient = await Patient.create({
          name:   sessionStore[sessionId].patientName,
          age:    parseInt(sessionStore[sessionId].patientAge),
          gender: sessionStore[sessionId].gender,
          phone:  sessionStore[sessionId].patientPhone,
          ward:   chp.ward,
          county: chp.county
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
          diagnosis = {
            severity:            'HIGH',
            possible_conditions: ['Unable to assess — manual review needed'],
            immediate_actions:   ['Refer to nearest facility immediately'],
            refer_to_facility:   true,
            facility_type:       'health_centre',
            chp_instructions:    'AI unavailable. Refer to nearest health centre immediately.'
          };
        }

        // ── Find facility ───────────────────────────
        const facility = await Facility.findOne({
          type: diagnosis.facility_type || 'health_centre'
        });

        // ── Save session ────────────────────────────
        const session = await Session.create({
          patient:            patient._id,
          chp:                chp._id,
          symptoms,
          severity:           diagnosis.severity,
          possibleConditions: diagnosis.possible_conditions,
          immediateActions:   diagnosis.immediate_actions,
          referToFacility:    diagnosis.refer_to_facility,
          facilityType:       diagnosis.facility_type,
          chpInstructions:    diagnosis.chp_instructions
        });

        // ── Save alert if HIGH or EMERGENCY ─────────
        if (['HIGH', 'EMERGENCY'].includes(diagnosis.severity) && facility) {
          await Alert.create({
            session:  session._id,
            facility: facility._id,
            smsSent:  true
          });
        }

        // ── Send all SMS simultaneously ─────────────
        const smsPromises = [
          sendCHPSummarySMS(chp, patient, diagnosis, facility)
        ];

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

        if (['HIGH', 'EMERGENCY'].includes(diagnosis.severity) && facility) {
          smsPromises.push(
            sendFacilityAlertSMS(facility, patient, diagnosis)
          );
        }

        await Promise.all(smsPromises);

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
          `${diagnosis.chp_instructions}\n`;

        if (diagnosis.possible_conditions?.length) {
          response += `\nPossible: ${diagnosis.possible_conditions[0]}`;
        }

        if (diagnosis.refer_to_facility && facility) {
          response +=
            `\n\nRefer to:\n` +
            `${facility.name}\n` +
            `Call: ${facility.phone}`;
        }

        response += `\n\nSMS sent to you ✓\n`;
        if (patient.phone) response += `SMS sent to patient ✓\n`;
        if (['HIGH', 'EMERGENCY'].includes(diagnosis.severity)) {
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
        chp:       chp._id,
        createdAt: { $gte: today }
      }).populate('patient');

      if (sessions.length === 0) {
        return res.send(
          `END 📋 No sessions today yet.\n\n` +
          `Select option 1 to\n` +
          `log your first patient.`
        );
      }

      const list = sessions.slice(0, 5).map((s, i) =>
        `${i + 1}. ${s.patient.name} - ${s.severity}`
      ).join('\n');

      const more = sessions.length > 5
        ? `\n...and ${sessions.length - 5} more`
        : '';

      return res.send(
        `END 📋 Today's Sessions (${sessions.length})\n\n` +
        `${list}${more}`
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
          startDate.setDate(now.getDate() - 7);
        } else if (steps[1] === '2') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
          startDate = new Date(0);
        }

        const sessions = await Session.find({
          chp:       chp._id,
          createdAt: { $gte: startDate }
        });

        const total     = sessions.length;
        const emergency = sessions.filter(s => s.severity === 'EMERGENCY').length;
        const high      = sessions.filter(s => s.severity === 'HIGH').length;
        const medium    = sessions.filter(s => s.severity === 'MEDIUM').length;
        const low       = sessions.filter(s => s.severity === 'LOW').length;
        const referrals = sessions.filter(s => s.referToFacility).length;

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
      const hospital = await Facility.findOne({ type: 'hospital' });
      return res.send(
        `END 🚨 EMERGENCY PROTOCOL\n\n` +
        `Call ambulance: 0722 314 239\n` +
        `Emergency line: 0800 723 253 (FREE)\n\n` +
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
      const totalSessions = await Session.countDocuments({
        chp: chp._id
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaySessions = await Session.countDocuments({
        chp:       chp._id,
        createdAt: { $gte: today }
      });

      return res.send(
        `END 👤 My Profile\n\n` +
        `Name: ${chp.name}\n` +
        `Phone: ${chp.phone}\n` +
        `Ward: ${chp.ward}\n` +
        `County: ${chp.county}\n` +
        `Status: ${chp.isVerified ? '✅ Verified' : '⏳ Pending'}\n\n` +
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
    delete sessionStore[sessionId];
    return res.send(
      `END ⚠️ Something went wrong.\n` +
      `Please try again.\n` +
      `If problem persists call support.`
    );
  }
};
