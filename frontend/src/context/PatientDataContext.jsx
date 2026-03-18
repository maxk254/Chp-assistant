import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PATIENTS_STORAGE_KEY = "chp.patients";
const STATUSES_STORAGE_KEY = "chp.patientStatuses";

const PatientDataContext = createContext(null);

const readFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to parse local storage key: ${key}`, error);
    return fallback;
  }
};

export const PatientDataProvider = ({ children }) => {
  const [patients, setPatients] = useState(() =>
    readFromStorage(PATIENTS_STORAGE_KEY, []),
  );
  const [patientStatuses, setPatientStatuses] = useState(() =>
    readFromStorage(STATUSES_STORAGE_KEY, {}),
  );

  useEffect(() => {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STATUSES_STORAGE_KEY, JSON.stringify(patientStatuses));
  }, [patientStatuses]);

  const addPatient = (patientRecord) => {
    if (!patientRecord) {
      return;
    }
    setPatients((prev) => [patientRecord, ...prev]);
  };

  const updatePatientStatus = (patientId, status) => {
    if (!patientId || !status) {
      return;
    }
    setPatientStatuses((prev) => ({
      ...prev,
      [patientId]: status,
    }));
  };

  const markAllPatientsStatus = (status) => {
    if (!status) {
      return;
    }

    setPatientStatuses((prev) => {
      const updated = { ...prev };
      patients.forEach((patient) => {
        if (patient?.id) {
          updated[patient.id] = status;
        }
      });
      return updated;
    });
  };

  const value = useMemo(
    () => ({
      patients,
      patientStatuses,
      addPatient,
      updatePatientStatus,
      markAllPatientsStatus,
    }),
    [patients, patientStatuses],
  );

  return (
    <PatientDataContext.Provider value={value}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const context = useContext(PatientDataContext);
  if (!context) {
    throw new Error("usePatientData must be used within PatientDataProvider");
  }
  return context;
};
