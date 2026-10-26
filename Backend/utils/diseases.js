// SINGLE SOURCE OF TRUTH for diseases and which specialist treats them.
// The frontend gets this list from GET /api/diseases, so edit it only here.
//
//   name       - shown in the booking form dropdown and the doctor filters
//   specialist - the "recommended specialist" label shown to patients
//   keywords   - lowercase fragments matched against a doctor's `specialization`
//                (fragments, not full words, so "Cardiologist" and "Cardiology"
//                both match "cardio")
export const DISEASES = [
  { name: "Heart Disease", specialist: "Cardiologist", keywords: ["cardio", "heart"] },
  { name: "Skin Problem", specialist: "Dermatologist", keywords: ["dermat", "skin"] },
  { name: "Bone/Joint Problem", specialist: "Orthopedic", keywords: ["orthop", "bone", "joint"] },
  { name: "Child Health", specialist: "Pediatrician", keywords: ["pediatric", "paediatric", "child"] },
  { name: "Cancer", specialist: "Oncologist", keywords: ["oncolog", "cancer"] },
  { name: "Neurological Disorder", specialist: "Neurologist", keywords: ["neuro", "brain"] },
  { name: "Diabetes", specialist: "Endocrinologist", keywords: ["endocrin", "diabet"] },
  { name: "Respiratory Issue", specialist: "Pulmonologist", keywords: ["pulmon", "respirat", "chest"] },
  { name: "Eye Problem", specialist: "Ophthalmologist", keywords: ["ophthalm", "eye"] },
  { name: "Dental Problem", specialist: "Dentist", keywords: ["dent"] },
  { name: "Other", specialist: null, keywords: [] },
];

// Returns [] for unknown/custom diseases (e.g. whatever was typed under "Other")
export const getSpecializationKeywords = (diseaseName) =>
  DISEASES.find((d) => d.name === diseaseName)?.keywords || [];

// Escapes characters like ( ) / . so user-typed text can't break the regex query
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");