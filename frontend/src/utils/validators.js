//  basically functions to check if email , password ,name, password match e.t.c

// ── Email ──────────────────────────────────────────────
export const isValidEmail = (value) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).trim().toLowerCase());
};

// ── Password ───────────────────────────────────────────
// Rules: min 8 chars, at least 1 letter, at least 1 number
export const isStrongPassword = (value) => {
  if (!value || value.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  return hasLetter && hasNumber;
};

// ── Name ───────────────────────────────────────────────
export const isValidName = (value) =>
  typeof value === "string" && value.trim().length >= 2;

// ── Confirm password ───────────────────────────────────
export const passwordsMatch = (password, confirm) => password === confirm;

// ── Full form validators (used by useForm hook) ────────

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password || password.length < 1)
    errors.password = "Password is required.";
  return errors;
};

export const validateRegister = ({
  firstName,
  lastName,
  email,
  password,
  confirm,
}) => {
  const errors = {};
  if (!isValidName(firstName))
    errors.firstName = "First name must be at least 2 characters.";
  if (!isValidName(lastName))
    errors.lastName = "Last name must be at least 2 characters.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isStrongPassword(password))
    errors.password = "Min 8 characters, at least 1 letter and 1 number.";
  if (!passwordsMatch(password, confirm))
    errors.confirm = "Passwords do not match.";
  return errors;
};

export const validateForgotPassword = ({ email }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  return errors;
};
