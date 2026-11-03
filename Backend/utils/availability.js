// Works out doctor availability from the days and hours the doctor set in their profile.
//
// Rules:
//   - No days selected, or no valid From/To time  -> Unavailable
//   - Today is not one of the doctor's days       -> Unavailable
//   - Today's hours are already over (now >= To)  -> Unavailable
//   - Otherwise (a working day, hours not over)   -> Available
//
// "Today" and "now" are taken in the hospital's timezone, not the server's, so the
// result is the same wherever the backend is hosted. Set HOSPITAL_TIMEZONE in .env
// to change it (default: Asia/Kolkata).

const TIMEZONE = process.env.HOSPITAL_TIMEZONE || "Asia/Kolkata";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// "13:30" or "1:30 PM" -> minutes since midnight (810). Returns null if invalid/empty.
export const toMinutes = (value) => {
  if (!value || typeof value !== "string") return null;

  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
};

// "13:00" -> "1:00 PM"
const formatTime = (value) => {
  const total = toMinutes(value);
  if (total === null) return "";

  const hours24 = Math.floor(total / 60);
  const minutes = total % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

// ("10:00", "13:00") -> "10:00 AM - 1:00 PM". Empty string if either is missing.
export const formatTimeRange = (from, to) => {
  const start = formatTime(from);
  const end = formatTime(to);
  return start && end ? `${start} - ${end}` : "";
};

// A doctor only counts as scheduled if they picked days AND a valid From < To window
const hasSchedule = (doctor) => {
  const from = toMinutes(doctor.availableFrom);
  const to = toMinutes(doctor.availableTo);

  return (
    Array.isArray(doctor.availableDays) &&
    doctor.availableDays.length > 0 &&
    from !== null &&
    to !== null &&
    from < to
  );
};

// Current weekday name and minutes-since-midnight in the hospital's timezone
const getNowInHospitalTime = (now) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type) => parts.find((p) => p.type === type)?.value;

  return {
    day: get("weekday"),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
};

// Is the doctor available today, i.e. on a working day with hours not yet finished?
export const isAvailableNow = (doctor, now = new Date()) => {
  if (!hasSchedule(doctor)) return false;

  const { day, minutes } = getNowInHospitalTime(now);
  if (!doctor.availableDays.includes(day)) return false;

  return minutes < toMinutes(doctor.availableTo);
};

// Does the doctor work on this date and time? Used when auto-assigning a doctor to
// a booking: `date` is "YYYY-MM-DD" and `time` is "HH:mm" (from the booking form).
export const isAvailableAt = (doctor, date, time) => {
  if (!hasSchedule(doctor)) return false;

  // Read the weekday from the calendar date itself (UTC avoids timezone shifts)
  const weekday = DAY_NAMES[new Date(`${String(date).slice(0, 10)}T00:00:00Z`).getUTCDay()];
  if (!weekday || !doctor.availableDays.includes(weekday)) return false;

  const requested = toMinutes(time);
  if (requested === null) return false;

  return requested >= toMinutes(doctor.availableFrom) && requested < toMinutes(doctor.availableTo);
};