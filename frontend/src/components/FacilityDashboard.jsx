import React from "react";
import Facility from "./ui/Facility";

const FacilityDashboard = ({
  patients = [],
  patientStatuses = {},
  onUpdatePatientStatus,
  onAcceptAllPending,
}) => {
  return (
    <Facility
      patients={patients}
      patientStatuses={patientStatuses}
      onUpdatePatientStatus={onUpdatePatientStatus}
      onAcceptAllPending={onAcceptAllPending}
    />
  );
};

export default FacilityDashboard;
