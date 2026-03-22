import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

// const PATIENTS_STORAGE_KEY = "chp.patients";
// const STATUSES_STORAGE_KEY = "chp.patientStatuses";

const PatientDataContext = createContext(null);

export const PatientDataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [patientStatuses, setPatientStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all data from backend ─────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sessionsRes, alertsRes, statsRes] = await Promise.all([
        api.get("/api/sessions"),
        api.get("/api/alerts"),
        api.get("/api/stats"),
      ]);

      setSessions(sessionsRes.data.sessions || []);
      setAlerts(alertsRes.data.alerts || []);
      setStats(statsRes.data || null);

      // Build patients list from sessions
      // Each session has a populated patient object
      const patientList = (sessionsRes.data.sessions || []).map((s) => ({
        id: s._id,
        fullName: s.patient?.name || "Unknown",
        age: s.patient?.age,
        ward: s.patient?.ward || s.chp?.ward,
        county: s.patient?.county,
        symptoms: s.symptoms?.join(", "),
        diagnosis: s.possibleConditions?.[0] || "Pending",
        status: s.severity?.toLowerCase(),
        facility: s.alert?.facility?.name || "Not referred",
        chwName: s.chp?.name || "Unknown CHP",
        referToFacility: s.referToFacility,
        facilityType: s.facilityType,
        instructions: s.chpInstructions,
        timestamp: s.createdAt,
        // Keep full session for detail views
        session: s,
      }));

      setPatients(patientList);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch on mount + auto refresh every 30 seconds ──
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Add patient locally after CHP submits ────────
  // This is an optimistic update — adds to local state
  // while backend saves via USSD
  const addPatient = (patientRecord) => {
    if (!patientRecord) return;
    setPatients((prev) => [patientRecord, ...prev]);
  };

  // ── Update patient status (facility use) ─────────
  const updatePatientStatus = async (patientId, status) => {
    if (!patientId || !status) return;

    // Update local state immediately
    setPatientStatuses((prev) => ({ ...prev, [patientId]: status }));

    // Sync to backend
    try {
      await api.patch(`/api/sessions/${patientId}/status`, { status });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ── Mark all patients with a status ──────────────
  const markAllPatientsStatus = (status) => {
    if (!status) return;
    setPatientStatuses((prev) => {
      const updated = { ...prev };
      patients.forEach((p) => {
        if (p?.id) updated[p.id] = status;
      });
      return updated;
    });
  };

  // ── Fetch sessions for a specific CHP ────────────
  const fetchMySessions = async () => {
    try {
      const res = await api.get("/api/sessions/my/today");
      return res.data.sessions || [];
    } catch (err) {
      console.error("Failed to fetch my sessions:", err);
      return [];
    }
  };

  // ── Fetch CHP weekly summary ──────────────────────
  const fetchMySummary = async () => {
    try {
      const res = await api.get("/api/sessions/my/summary");
      return res.data.summary || null;
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      return null;
    }
  };

  const value = useMemo(
    () => ({
      patients,
      sessions,
      alerts,
      stats,
      patientStatuses,
      loading,
      error,
      addPatient,
      updatePatientStatus,
      markAllPatientsStatus,
      fetchAll,
      fetchMySessions,
      fetchMySummary,
    }),
    [patients, sessions, alerts, stats, patientStatuses, loading, error],
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