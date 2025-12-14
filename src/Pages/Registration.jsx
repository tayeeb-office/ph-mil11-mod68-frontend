import React, { useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Provider/Provider";
import { updateProfile } from "firebase/auth";
import auth from "../Firebase/firebase.config";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import axios, { isCancel, AxiosError } from "axios";
import { fillOffset } from "motion";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const { register, setUser, google } = useContext(AuthContext);

  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const pass = e.target.pass.value;
    const username = e.target.username.value;
    const bloodGroup = e.target.bloodGroup.value;
    const district = e.target.district.value;
    const upazila = e.target.upazila.value;
    const photo = e.target.imageLink.files[0];
    setError("");

    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;

    if (pass.length < 6)
      return setError("Password should be at least 6 characters");
    if (!uppercase.test(pass))
      return setError("Password should have at least one uppercase");
    if (!lowercase.test(pass))
      return setError("Password should have at least one lowercase");
    if (!photo) return setError("Please select an image");

    try {
      const formData = new FormData();
      formData.append("image", photo);

      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=36f1131d464584a0940eec4d57324ba4",
        formData
      );

      const imageUrl = res.data.data.display_url;

      const data = {
        email,
        pass,
        username,
        imageUrl,
        bloodGroup,
        district,
        upazila,
      };

      //   console.log(data);

      if (res.data.success == true) {
        await register(email, pass);

        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: imageUrl,
        });

        setUser({ ...auth.currentUser });
        navigate("/");
      }

      Swal.fire({
        title: "Registration Completed",
        icon: "success",
        draggable: true,
      });
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const [bloodGroups, setBloodGroups] = useState([]);
  useEffect(() => {
    fetch("/bloodGroups.json")
      .then((res) => res.json())
      .then((data) => setBloodGroups(data))
      .catch((err) => console.error(err));
  }, []);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));

    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data));
  }, []);

  return (
    <div>
      <div className="bg-[#F7EFF0]">
        <title>Registration</title>
        <section className=" w-full flex items-center justify-center px-4 py-30">
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
                <label className="text-sm font-semibold text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4 "
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Full Name
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Write Full Name here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4 "
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Blood Group
                </label>
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

              {/* District */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  District
                </label>
                <select
                  name="district"
                  className="w-full h-12 rounded-lg border-2 text-black px-4"
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  required
                >
                  <option value="">Select district</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Upazila
                </label>
                <select
                  name="upazila"
                  className="w-full h-12 rounded-lg border-2 text-black px-4"
                  disabled={!selectedDistrict}
                  required
                >
                  <option value="">Select upazila</option>
                  {selectedDistrict &&
                    upazilas[selectedDistrict]?.map((u, index) => (
                      <option key={index} value={u}>
                        {u}
                      </option>
                    ))}
                </select>
              </div>

              {/* Passoward */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Write passoward here"
                    className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4 pr-12 "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(() => !showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="imageLink"
                  placeholder="Write image link here"
                  className="w-full font-bold py-2.5 h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4 "
                />
              </div>

              {/* Pass Validation*/}
              <p className="text-[14px] text-red-500">{error}</p>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#EE2B34] hover:bg-[#EE2B34] text-white font-semibold "
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-800">
              Already have an account?
              <Link to="/login">
                <span className="text-[#EE2B34] hover:text-[#EE2B34] cursor-pointer font-semibold">
                  Log In
                </span>
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Registration;
