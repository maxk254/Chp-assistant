import api from "./api";

export const runDiagnostic = async (payload) => {
  try {
    // ✅ Calls your real AI service through backend
    const { data } = await api.post("/api/diagnose", {
      patient_age: payload.age,
      patient_gender: payload.gender || "unknown",
      symptoms: Array.isArray(payload.symptoms)
        ? payload.symptoms
        : String(payload.symptoms || "")
            .split(",")
            .map((s) => s.trim()),
    });

    // Map backend response to what frontend expects
    return {
      diagnosis: data.possible_conditions?.[0] || "Assessment complete",
      confidence: "AI Assessed",
      recommendedFacility: data.facility_type || "health_centre",
      emergencyLevel: data.severity || "MEDIUM",
      ambulanceNeeded: data.severity === "EMERGENCY",
      recommendations: data.immediate_actions || [],
      chpInstructions: data.chp_instructions || "",
      referToFacility: data.refer_to_facility || false,
      rawDiagnosis: data,
    };
  } catch (error) {
    console.error("Diagnostic failed:", error);

    // Only use fallback if AI service is completely down
    return {
      diagnosis: "AI service unavailable — refer to facility",
      confidence: "N/A",
      recommendedFacility: "Nearest health centre",
      emergencyLevel: "HIGH",
      ambulanceNeeded: false,
      recommendations: [
        "Refer patient to nearest health centre immediately.",
        "Monitor vital signs.",
        "Contact supervisor if condition worsens.",
      ],
      chpInstructions: "AI unavailable. Refer to nearest health centre.",
      referToFacility: true,
    };
  }
};
