import africastalking from 'africastalking';
import Facility from '../models/Facility.js';


// Send single sms
async function sendSMS(to, message) {
  try {

    // AT KEYS
    const AT = africastalking({
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME,
    });
    const SMS = AT.SMS;
    // ensures phone number has + prefix
    const phone = to.startsWith('+') ? to : `+${to}`

    await SMS.send({
      to: [phone],
      message,
      from: 'ChpAI'
    });
    console.log(`SMS sent to ${phone}`);
  } catch (err) {
    console.error(`sms failed to ${to}:`, err.message);
  }
}

// welcome message to CHP registers
export async function sendCHPWelcomeSMS(chp) {
  const message =
    `Welcome to CHP AI ${chp.name}!\n` +
    `You are registered as a CHp in ${chp.ward}.\n` +
    `Dial *384*5900# to log patients.\n`;
    `For help reply HELP`

    await sendSMS(chp.phone, message);
}

// CHP Summary SMS after each patient visit
export async function sendCHPSummarySMS(chp, Patient, diagnosis, facility) {
  const emoji = {
    EMERGENCY: "🚨",
    HIGH: "⚠️",
    MEDIUM: "🟡",
    LOW: "✅",
  }[diagnosis.severity];

  let message =
    `${emoji} Chp AI Summary\n` +
    `Patient: ${Patient.name} (${Patient.age}${Patient.gender === "male" ? "M" : "F"})\n` +
    `Severity: ${diagnosis.severity}\n` +
    `Action: ${diagnosis.chp_instructions}`;

    if (diagnosis.refer_to_facility && facility) {
      message += 
      `\nRefer to: ${facility.name}` + 
      `\nCall: ${facility.phone}`;
    }

    await sendSMS(chp.phone, message);
}

// patient Referal SMS
export async function sendPatientReferralSMS(patientPhone, patientName, diagnosis, facility) {
  if (!patientPhone) return; // no phone number skip silentlty

  const emoji = {
    EMERGENCY: "🚨 URGENT",
    HIGH: "⚠️ IMPORTANT",
    MEDIUM: "🟡 ADVISORY",
    LOW: "✅ INFO",
  }[diagnosis.severity];

  let message =
    `${emoji} - Afya AI\n` +
    `Dear ${patientName},\n` +
    `A CHW has assessed your health.\n`;

  if (diagnosis.refer_to_facility && facility) {
    message +=
      `Please visit:\n` + `${facility.name}\n` + `Tel: ${facility.phone}\n`;

    if (diagnosis.severity === "EMERGENCY") {
      message += `Go IMMEDIATELY. This is urgent.`;
    } else if (diagnosis.severity === "HIGH") {
      message += `Please go today.`;
    } else {
      message += `Visit within 2 days.`;
    }
  } else {
    message += `You can manage at home.\n${diagnosis.chw_instructions}`;
  }

  await sendSMS(patientPhone, message);
}

// facility Alert SMS
export async function sendFacilityAlertSMS(facility, patient, diagnosis) {
  const message =
    `🏥 CHP AI ALERT [${diagnosis.severity}]\n` +
    `Incoming patient: ${patient.name} (${patient.age}yr)\n` +
    `Condition: ${diagnosis.possible_conditions[0]}\n` +
    `Actions needed: ${diagnosis.immediate_actions[0]}\n` +
    `Referred by Chp AI System`;

    await sendSMS(facility.phone, message);
}