import AfricasTalking from "africastalking";

async function sendSMS(to, message) {
  try {
    const AT = AfricasTalking({
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME,
    });
    const SMS = AT.SMS;
    const phone = to.startsWith("+") ? to : `+${to}`;
    await SMS.send({ to: [phone], message, from: "AfyaAI" });
    console.log(`✅ SMS sent to ${phone}`);
  } catch (err) {
    console.error(`❌ SMS failed to ${to}:`, err.message);
  }
}

export async function sendCHPWelcomeSMS(chp) {
  await sendSMS(
    chp.phone,
    `🏥 Welcome to Afya AI ${chp.name}!\n` +
      `You are registered as a CHP in ${chp.ward}.\n` +
      `Dial *384*5321# to log patients.`,
  );
}

export async function sendCHPSummarySMS(chp, patient, diagnosis, facility) {
  const emoji = { EMERGENCY: "🚨", HIGH: "⚠️", MEDIUM: "🟡", LOW: "✅" }[
    diagnosis.severity
  ];
  let message =
    `${emoji} Afya AI Summary\n` +
    `Patient: ${patient.name} (${patient.age}${patient.gender === "male" ? "M" : "F"})\n` +
    `Severity: ${diagnosis.severity}\n` +
    `Action: ${diagnosis.chp_instructions}`;
  if (diagnosis.refer_to_facility && facility) {
    message += `\nRefer to: ${facility.name}\nCall: ${facility.phone}`;
  }
  await sendSMS(chp.phone, message);
}

export async function sendPatientReferralSMS(
  patientPhone,
  patientName,
  diagnosis,
  facility,
) {
  if (!patientPhone) return;
  const emoji = {
    EMERGENCY: "🚨 URGENT",
    HIGH: "⚠️ IMPORTANT",
    MEDIUM: "🟡 ADVISORY",
    LOW: "✅ INFO",
  }[diagnosis.severity];
  let message =
    `${emoji} - Afya AI\n` +
    `Dear ${patientName},\n` +
    `A CHP has assessed your health.\n`;
  if (diagnosis.refer_to_facility && facility) {
    message += `Please visit:\n${facility.name}\nTel: ${facility.phone}\n`;
    if (diagnosis.severity === "EMERGENCY") message += `Go IMMEDIATELY.`;
    else if (diagnosis.severity === "HIGH") message += `Please go today.`;
    else message += `Visit within 2 days.`;
  } else {
    message += `You can manage at home.\n${diagnosis.chp_instructions}`;
  }
  await sendSMS(patientPhone, message);
}

export async function sendFacilityAlertSMS(facility, patient, diagnosis) {
  const message =
    `🏥 AFYA AI ALERT [${diagnosis.severity}]\n` +
    `Incoming: ${patient.name} (${patient.age}yr)\n` +
    `Condition: ${diagnosis.possible_conditions[0]}\n` +
    `Action: ${diagnosis.immediate_actions[0]}`;
  await sendSMS(facility.phone, message);
}
