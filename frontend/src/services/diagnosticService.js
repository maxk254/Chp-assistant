import api from "./api";

const buildMockResult = (payload) => {
  const symptomsText = String(payload?.symptoms || "").toLowerCase();
  const age = Number(payload?.age || 0);

  if (symptomsText.includes("fever") || symptomsText.includes("chills")) {
    return {
      diagnosis: "Suspected Malaria",
      confidence: "90%",
      recommendedFacility: "Githunguri Health Centre",
      emergencyLevel: "HIGH",
      ambulanceNeeded: age < 5 || age > 65,
      recommendations: [
        "Run malaria rapid test and blood smear.",
        "Start antimalarial treatment per protocol when confirmed.",
        "Monitor hydration and fever progression.",
      ],
    };
  }

  if (symptomsText.includes("cough") || symptomsText.includes("breath")) {
    return {
      diagnosis: "Acute Respiratory Infection",
      confidence: "84%",
      recommendedFacility: "Githunguri Sub-County Hospital",
      emergencyLevel: "MEDIUM",
      ambulanceNeeded: symptomsText.includes("breath") && (age < 5 || age > 65),
      recommendations: [
        "Check oxygen saturation and respiratory rate.",
        "Assess for pneumonia danger signs.",
        "Refer urgently if oxygen saturation is low.",
      ],
    };
  }

  return {
    diagnosis: "General Clinical Review Required",
    confidence: "72%",
    recommendedFacility: "Nearest linked facility",
    emergencyLevel: "LOW",
    ambulanceNeeded: false,
    recommendations: [
      "Complete a focused physical assessment.",
      "Record vitals and monitor symptom progression.",
      "Escalate referral if red-flag symptoms appear.",
    ],
  };
};

export const runDiagnostic = async (payload) => {
  try {
    const { data } = await api.post("/ai/diagnose", payload);

    if (data?.result) {
      return data.result;
    }

    if (data?.diagnosis) {
      return data;
    }

    return buildMockResult(payload);
  } catch (error) {
    console.warn(
      "AI diagnose endpoint unavailable, using local fallback.",
      error,
    );
    return buildMockResult(payload);
  }
};
