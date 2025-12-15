
import React, { useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Provider/Provider";
import { updateProfile } from "firebase/auth";
import auth from "../Firebase/firebase.config";
import Swal from "sweetalert2";
import axios from "axios";

const extractTableData = (exportJson, tableName) => {
  const tableBlock = exportJson?.find(
    (x) => x?.type === "table" && x?.name === tableName
  );
  return tableBlock?.data || [];
};

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bloodGroups, setBloodGroups] = useState([]);

  
  const [districts, setDistricts] = useState([]);
  const [upazilaMap, setUpazilaMap] = useState({});
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  
  useEffect(() => {
    fetch("/bloodGroups.json")
      .then((res) => res.json())
      .then((data) => setBloodGroups(data))
      .catch(console.error);
  }, []);

  
  useEffect(() => {
    const loadGeo = async () => {
      const dRes = await fetch("/districts.json");
      const uRes = await fetch("/upazilas.json");

      const dJson = await dRes.json();
      const uJson = await uRes.json();

      const dList = extractTableData(dJson, "districts");
      const uList = extractTableData(uJson, "upazilas");

      
      const grouped = uList.reduce((acc, item) => {
        const key = String(item.district_id);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      setDistricts(dList);
      setUpazilaMap(grouped);
    };

    loadGeo().catch(console.error);
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const pass = e.target.pass.value;
    const username = e.target.username.value.trim();
    const bloodGroup = e.target.bloodGroup.value;

    const districtId = e.target.district.value;
    const upazilaId = e.target.upazila.value;

    const photo = e.target.imageLink.files?.[0];

    setError("");

    
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;

    if (pass.length < 6) return setError("Password should be at least 6 characters");
    if (!uppercase.test(pass)) return setError("Password should have at least one uppercase");
    if (!lowercase.test(pass)) return setError("Password should have at least one lowercase");
    if (!photo) return setError("Please select an image");

    
    const districtObj = districts.find((d) => String(d.id) === String(districtId));
    const upazilaObj = (upazilaMap[districtId] || []).find(
      (u) => String(u.id) === String(upazilaId)
    );

    const districtNameEn = districtObj?.name || "";
    const upazilaNameEn = upazilaObj?.name || "";

    if (!districtNameEn) return setError("Invalid district selected");
    if (!upazilaNameEn) return setError("Invalid upazila selected");

    try {
      
      const formData = new FormData();
      formData.append("image", photo);

      const imgRes = await axios.post(
        "https://api.imgbb.com/1/upload?key=36f1131d464584a0940eec4d57324ba4",
        formData
      );

      if (imgRes.data?.success !== true) {
        return setError("Image upload failed. Please try again.");
      }

      const imageUrl = imgRes.data.data.display_url;

      // Firebase register
      await register(email, pass);

      // Update profile
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: imageUrl,
      });

      setUser({ ...auth.currentUser });

      
      const userPayload = {
        email,
        pass,
        username,
        imageUrl,
        bloodGroup,
        district: districtNameEn,
        upazila: upazilaNameEn,
        role: "donor",
      };

      await axios.post("http://localhost:5000/users", userPayload);

      Swal.fire({
        title: "Registration Completed",
        icon: "success",
        draggable: true,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#F7EFF0]">
      <title>Registration</title>

      <section className="w-full flex items-center justify-center px-4 py-30">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl px-6 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">
              Create Your BloodLink Profile
            </h1>
            <p className="text-[14px] mt-2 text-slate-800">
              Please enter your details to create an account.
            </p>
          </div>

          <form onSubmit={handelSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Full Name</label>
              <input
                name="username"
                type="text"
                placeholder="Write Full Name here"
                className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                required
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Blood Group</label>
              <select
                name="bloodGroup"
                className="w-full h-12 rounded-lg border-2 text-black px-4"
                required
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group.id} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            {/* District (ENGLISH ONLY) */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">District</label>
              <select
                name="district"
                className="w-full h-12 rounded-lg border-2 text-black px-4"
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                required
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila (ENGLISH ONLY) */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Upazila</label>
              <select
                name="upazila"
                className="w-full h-12 rounded-lg border-2 text-black px-4"
                disabled={!selectedDistrictId}
                required
              >
                <option value="">Select upazila</option>
                {(upazilaMap[selectedDistrictId] || []).map((u) => (
                  <option key={u.id} value={String(u.id)}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Password</label>
              <div className="relative">
                <input
                  name="pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Write password here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Upload Image</label>
              <input
                type="file"
                name="imageLink"
                className="w-full font-bold py-2.5 h-12 rounded-lg border-2 text-black px-4"
                required
              />
            </div>

            {error && <p className="text-[14px] text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#EE2B34] hover:bg-[#d9252c] text-white font-semibold"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-800">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-[#EE2B34] hover:text-[#d9252c] cursor-pointer font-semibold">
                Log In
              </span>
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Registration;
