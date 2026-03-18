import React from "react";
import Supervisor from "./ui/Supervisor";

const SupervisorDashboard = ({
  patients = [],
  supervisorName = "Supervisor",
}) => {
  const chwMap = new Map();

  patients.forEach((patient) => {
    const chwName = patient?.chwName || "CHW";
    const existing = chwMap.get(chwName) || {
      id: chwMap.size + 1,
      name: chwName,
      zone: patient?.ward || "Unknown Ward",
      sessions: 0,
      patients: 0,
      referrals: 0,
      lastSeen: patient?.timestamp || "Recently",
      status: "active",
    };

    existing.sessions += 1;
    existing.patients += 1;
    existing.referrals += 1;
    existing.zone = patient?.ward || existing.zone;
    existing.lastSeen = patient?.timestamp || existing.lastSeen;

    chwMap.set(chwName, existing);
  });

  const chws = Array.from(chwMap.values());

  return (
    <Supervisor
      patients={patients}
      chws={chws}
      supervisorName={supervisorName}
    />
  );
};

export default SupervisorDashboard;
