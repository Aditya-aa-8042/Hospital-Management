import { useState, useEffect } from "react";
import Navbar from "../Component/Navbar";

// Change this to your backend URL (must match PORT in backend .env)
const API_URL = "http://localhost:5000";

const emptyUser = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  address: "",
  bloodGroup: "",
  emergencyContact: "",
  profileImage: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  });

  const parseResponse = async (res) => {
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.message || `Request failed (status ${res.status})`);
    }
    return data;
  };

  // Load the real logged-in user's profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: authHeader(),
        });
        const data = await parseResponse(res);
        setUser({ ...emptyUser, ...data.data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Update Profile - actually saves to the backend now
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
          bloodGroup: user.bloodGroup,
          emergencyContact: user.emergencyContact,
        }),
      });
      const data = await parseResponse(res);
      setUser({ ...emptyUser, ...data.data });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="text-center py-20 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Fields that matter for a complete hospital profile but aren't collected at signup
  const optionalFields = [
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "bloodGroup", label: "Blood Group" },
    { key: "address", label: "Address" },
    { key: "emergencyContact", label: "Emergency Contact" },
  ];
  const missingFields = optionalFields.filter((f) => !user[f.key]);
  const isProfileComplete = missingFields.length === 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* ================= PROFILE HEADER ================= */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-blue-100 mt-2">
            View and manage your personal information.
          </p>
        </div>
      </section>

      {/* ================= COMPLETE PROFILE PROMPT ================= */}
      {!isProfileComplete && !isEditing && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-yellow-800">
                Complete your profile
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Missing: {missingFields.map((f) => f.label).join(", ")}.
                {" "}This helps doctors and hospital staff assist you better, especially in emergencies.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition whitespace-nowrap"
            >
              Complete Now
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</p>
        </div>
      )}

      {/* ================= PROFILE CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* ================= LEFT PROFILE CARD ================= */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center h-fit">

            {/* Profile Image */}
            <div className="flex justify-center">
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-5">
              {user.fullName}
            </h2>

            <p className="text-gray-500 mt-1">
              Patient
            </p>

            <div className="border-t mt-6 pt-6 text-left space-y-4">

              <div>
                <p className="text-sm text-gray-400">
                  Email
                </p>

                <p className="text-gray-700 font-medium break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Phone Number
                </p>

                <p className="text-gray-700 font-medium">
                  {user.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Blood Group
                </p>

                <p className="text-gray-700 font-medium">
                  {user.bloodGroup}
                </p>
              </div>

            </div>

          </div>

          {/* ================= RIGHT DETAILS ================= */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-8">

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>

                <p className="text-gray-500 mt-1">
                  Keep your profile details up to date.
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  ✏️ Edit Profile
                </button>
              )}

            </div>

            {/* ================= PROFILE FORM ================= */}
            <form onSubmit={handleUpdate}>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={user.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Blood Group
                  </label>

                  <select
                    name="bloodGroup"
                    value={user.bloodGroup}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full border rounded-lg px-4 py-3 outline-none resize-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                {/* Emergency Contact */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Emergency Contact
                  </label>

                  <input
                    type="tel"
                    name="emergencyContact"
                    value={user.emergencyContact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

              </div>

              {/* ================= BUTTONS ================= */}

              {isEditing && (
                <div className="flex flex-wrap gap-4 mt-8">

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 text-gray-700 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                </div>
              )}

            </form>

          </div>

        </div>

        {/* ================= ACCOUNT SECTION ================= */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-2xl font-bold text-gray-800">
            Account Information
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-6">

            <div className="border rounded-xl p-5">
              <p className="text-gray-400 text-sm">
                Account Type
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                Patient
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-400 text-sm">
                Account Status
              </p>

              <p className="font-semibold text-green-600 mt-1">
                Active
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-400 text-sm">
                Profile Status
              </p>

              <p className={`font-semibold mt-1 ${isProfileComplete ? "text-blue-600" : "text-yellow-600"}`}>
                {isProfileComplete ? "Completed" : `Incomplete (${missingFields.length} field${missingFields.length > 1 ? "s" : ""} missing)`}
              </p>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
};

export default Profile;







// import { useState } from "react";
// import Navbar from "../Component/Navbar";

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);

//   const [user, setUser] = useState({
//     name: "Abhishek Aditya",
//     email: "abhishek@example.com",
//     phone: "+91 98765 43210",
//     age: "21",
//     gender: "Male",
//     address: "Dhanbad, Jharkhand, India",
//     bloodGroup: "B+",
//     emergencyContact: "+91 98765 12345",
//     image:
//       "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//   });

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   // Update Profile
//   const handleUpdate = (e) => {
//     e.preventDefault();

//     // Later you can send this data to your backend
//     console.log("Updated Profile:", user);

//     setIsEditing(false);

//     alert("Profile updated successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />

//       {/* ================= PROFILE HEADER ================= */}
//       <section className="bg-blue-600 text-white py-12">
//         <div className="max-w-6xl mx-auto px-6">
//           <h1 className="text-3xl md:text-4xl font-bold">
//             My Profile
//           </h1>

//           <p className="text-blue-100 mt-2">
//             View and manage your personal information.
//           </p>
//         </div>
//       </section>

//       {/* ================= PROFILE CONTENT ================= */}
//       <section className="max-w-6xl mx-auto px-6 py-10">
//         <div className="grid md:grid-cols-3 gap-8">

//           {/* ================= LEFT PROFILE CARD ================= */}
//           <div className="bg-white rounded-2xl shadow-md p-8 text-center h-fit">

//             {/* Profile Image */}
//             <div className="flex justify-center">
//               <img
//                 src={user.image}
//                 alt={user.name}
//                 className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
//               />
//             </div>

//             <h2 className="text-2xl font-bold text-gray-800 mt-5">
//               {user.name}
//             </h2>

//             <p className="text-gray-500 mt-1">
//               Patient
//             </p>

//             <div className="border-t mt-6 pt-6 text-left space-y-4">

//               <div>
//                 <p className="text-sm text-gray-400">
//                   Email
//                 </p>

//                 <p className="text-gray-700 font-medium break-all">
//                   {user.email}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-400">
//                   Phone Number
//                 </p>

//                 <p className="text-gray-700 font-medium">
//                   {user.phone}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-400">
//                   Blood Group
//                 </p>

//                 <p className="text-gray-700 font-medium">
//                   {user.bloodGroup}
//                 </p>
//               </div>

//             </div>

//           </div>

//           {/* ================= RIGHT DETAILS ================= */}
//           <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-8">

//             {/* Header */}
//             <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Personal Information
//                 </h2>

//                 <p className="text-gray-500 mt-1">
//                   Keep your profile details up to date.
//                 </p>
//               </div>

//               {!isEditing && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//                 >
//                   ✏️ Edit Profile
//                 </button>
//               )}

//             </div>

//             {/* ================= PROFILE FORM ================= */}
//             <form onSubmit={handleUpdate}>

//               <div className="grid md:grid-cols-2 gap-6">

//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Full Name
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     value={user.name}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Email Address
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     value={user.email}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Phone Number
//                   </label>

//                   <input
//                     type="tel"
//                     name="phone"
//                     value={user.phone}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   />
//                 </div>

//                 {/* Age */}
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Age
//                   </label>

//                   <input
//                     type="number"
//                     name="age"
//                     value={user.age}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   />
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Gender
//                   </label>

//                   <select
//                     name="gender"
//                     value={user.gender}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 {/* Blood Group */}
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Blood Group
//                   </label>

//                   <select
//                     name="bloodGroup"
//                     value={user.bloodGroup}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   >
//                     <option value="">Select Blood Group</option>
//                     <option value="A+">A+</option>
//                     <option value="A-">A-</option>
//                     <option value="B+">B+</option>
//                     <option value="B-">B-</option>
//                     <option value="AB+">AB+</option>
//                     <option value="AB-">AB-</option>
//                     <option value="O+">O+</option>
//                     <option value="O-">O-</option>
//                   </select>
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Address
//                   </label>

//                   <textarea
//                     name="address"
//                     value={user.address}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     rows="3"
//                     className={`w-full border rounded-lg px-4 py-3 outline-none resize-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   />
//                 </div>

//                 {/* Emergency Contact */}
//                 <div className="md:col-span-2">
//                   <label className="block text-gray-700 font-medium mb-2">
//                     Emergency Contact
//                   </label>

//                   <input
//                     type="tel"
//                     name="emergencyContact"
//                     value={user.emergencyContact}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={`w-full border rounded-lg px-4 py-3 outline-none transition ${
//                       isEditing
//                         ? "border-blue-400 focus:ring-2 focus:ring-blue-200"
//                         : "bg-gray-100 border-gray-200 text-gray-600"
//                     }`}
//                   />
//                 </div>

//               </div>

//               {/* ================= BUTTONS ================= */}

//               {isEditing && (
//                 <div className="flex flex-wrap gap-4 mt-8">

//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//                   >
//                     Save Changes
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setIsEditing(false)}
//                     className="border border-gray-300 text-gray-700 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
//                   >
//                     Cancel
//                   </button>

//                 </div>
//               )}

//             </form>

//           </div>

//         </div>

//         {/* ================= ACCOUNT SECTION ================= */}
//         <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

//           <h2 className="text-2xl font-bold text-gray-800">
//             Account Information
//           </h2>

//           <div className="grid md:grid-cols-3 gap-6 mt-6">

//             <div className="border rounded-xl p-5">
//               <p className="text-gray-400 text-sm">
//                 Account Type
//               </p>

//               <p className="font-semibold text-gray-800 mt-1">
//                 Patient
//               </p>
//             </div>

//             <div className="border rounded-xl p-5">
//               <p className="text-gray-400 text-sm">
//                 Account Status
//               </p>

//               <p className="font-semibold text-green-600 mt-1">
//                 Active
//               </p>
//             </div>

//             <div className="border rounded-xl p-5">
//               <p className="text-gray-400 text-sm">
//                 Profile Status
//               </p>

//               <p className="font-semibold text-blue-600 mt-1">
//                 Completed
//               </p>
//             </div>

//           </div>

//         </div>

//       </section>
//     </div>
//   );
// };

// export default Profile;
