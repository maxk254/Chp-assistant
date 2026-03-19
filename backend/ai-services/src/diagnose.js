// claude api + KEPH PROMPT
// ai-services/src/diagnose.js
import Groq from "groq-sdk";



export default async (req, res) => {
  const { patient_age, patient_gender, symptoms } = req.body;
    // initializing grok
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
  if (!patient_age || !patient_gender || !symptoms?.length) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  console.log(
    `🔍 Diagnosing: ${patient_age}yr ${patient_gender} — ${symptoms.join(", ")}`,
  );

  const prompt = `You are a clinical decision support system for Community Health Workers in Kenya.
Assess the patient and respond in JSON ONLY. No extra text, no markdown.

Patient: ${patient_age} year old ${patient_gender}
Symptoms: ${symptoms.join(", ")}
Context: Rural Kenya. CHW with basic training. Kenya KEPH protocols.

Respond with EXACTLY this JSON:
{
  "severity": "LOW or MEDIUM or HIGH or EMERGENCY",
  "possible_conditions": ["condition1", "condition2"],
  "immediate_actions": ["action1", "action2", "action3"],
  "refer_to_facility": true or false,
  "facility_type": "dispensary or health_centre or hospital",
  "chp_instructions": "One clear sentence for the CHP"
}

Severity rules:
- EMERGENCY = immediate life threat (unconscious, severe chest pain, heavy bleeding)
- HIGH = needs facility today (high fever, persistent vomiting)
- MEDIUM = needs facility within 2 days
- LOW = manage at home
- Always escalate when in doubt
- Follow Kenya KEPH protocols`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const diagnosis = JSON.parse(completion.choices[0].message.content);

    if (!diagnosis.severity || !diagnosis.chp_instructions) {
      throw new Error("Invalid response structure");
    }

    console.log(`✅ Severity: ${diagnosis.severity}`);
    res.json(diagnosis);
  } catch (err) {
    console.error("❌ Groq error:", err.message);

    res.status(200).json({
      severity: "HIGH",
      possible_conditions: ["Unable to assess — manual review needed"],
      immediate_actions: [
        "Check patient vital signs",
        "Keep patient calm",
        "Refer to nearest facility immediately",
      ],
      refer_to_facility: true,
      facility_type: "health_centre",
      chp_instructions:
        "AI assessment failed. Refer patient to nearest health centre immediately.",
    });
  }
};
// import { GoogleGenerativeAI } from '@google/generative-ai';

// export default async (req, res) => {
//   const { patient_age, patient_gender, symptoms } = req.body;

//   // Validate input
//   if (!patient_age || !patient_gender || !symptoms) {
//     return res.status(400).json({
//       success: false,
//       error: 'Missing required fields: patient_age, patient_gender, symptoms'
//     });
//   }

//   const prompt = `You are a clinical decision support system for Community Health Workers in Kenya.
// Assess this patient and respond in JSON only. No other text.

// Patient: ${patient_age} year old ${patient_gender}
// Symptoms: ${symptoms.join(', ')}
// Context: Rural Kenya, CHW with basic training, following Kenya KEPH protocols

// Respond ONLY with this exact JSON structure:
// {
//   "severity": "LOW or MEDIUM or HIGH or EMERGENCY",
//   "possible_conditions": ["condition1", "condition2"],
//   "immediate_actions": ["action1", "action2"],
//   "refer_to_facility": true or false,
//   "facility_type": "dispensary or health_centre or hospital",
//   "chw_instructions": "One clear sentence for the CHW"
// }

// Rules:
// - EMERGENCY = immediate danger to life
// - HIGH = needs facility care today
// - MEDIUM = needs facility care within 2 days
// - LOW = can manage at home
// - If in doubt always escalate
// - Base decisions on Kenya KEPH protocols`;

//   try {
//     // Initialize Gemini
//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

//     // Call Gemini API
//     const result = await model.generateContent(prompt);
//     const text   = result.response.text();

//     // Clean response — remove markdown if present
//     const clean = text
//       .replace(/```json/g, '')
//       .replace(/```/g, '')
//       .trim();

//     // Parse JSON
//     const diagnosis = JSON.parse(clean);

//     // Validate required fields exist
//     if (!diagnosis.severity || !diagnosis.chw_instructions) {
//       throw new Error('Invalid diagnosis format from AI');
//     }

//     console.log(`✅ Diagnosis: ${diagnosis.severity} — ${patient_age}yr ${patient_gender}`);
//     res.json(diagnosis);

//   } catch (err) {
//     console.error('Gemini API error:', err.message);

//     // Safe fallback — never leave CHW without guidance
//     res.status(200).json({
//       severity:            'HIGH',
//       possible_conditions: ['Unable to assess — manual review needed'],
//       immediate_actions:   ['Refer to nearest facility immediately'],
//       refer_to_facility:   true,
//       facility_type:       'health_centre',
//       chw_instructions:    'AI assessment failed. Refer patient to nearest health centre immediately.'
//     });
//   }
// };