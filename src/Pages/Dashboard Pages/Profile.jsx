import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import { Link } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const extractTableData = (exportJson, tableName) => {
  const tableBlock = exportJson?.find(
    (x) => x?.type === "table" && x?.name === tableName
  );
  return tableBlock?.data || [];
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bloodGroups, setBloodGroups] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilaMap, setUpazilaMap] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    username: "",
    bloodGroup: "",
    districtId: "",
    upazilaId: "",
    districtName: "",
    upazilaName: "",
  });

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

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/users/${user.email}`);
        const data = await res.json();

        setDbUser(data);

        setForm((prev) => ({
          ...prev,
          username: data?.username || "",
          bloodGroup: data?.bloodGroup || "",
          districtName: data?.district || "",
          upazilaName: data?.upazila || "",
          districtId: "",
          upazilaId: "",
        }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user?.email]);

  useEffect(() => {
    if (!districts.length || !dbUser) return;

    const districtObj = districts.find((d) => d.name === dbUser?.district);
    const districtId = districtObj ? String(districtObj.id) : "";

    if (districtId) {
      const upazilaObj = (upazilaMap[districtId] || []).find(
        (u) => u.name === dbUser?.upazila
      );
      const upazilaId = upazilaObj ? String(upazilaObj.id) : "";

      setForm((prev) => ({
        ...prev,
        districtId,
        upazilaId,
      }));
    }
  }, [districts, upazilaMap, dbUser]);

  const isFormDisabled = !isEditing;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setForm((prev) => ({
      ...prev,
      districtId,
      upazilaId: "",
    }));
  };

  const resetToDb = () => {
    if (!dbUser) return;

    const districtObj = districts.find((d) => d.name === dbUser?.district);
    const districtId = districtObj ? String(districtObj.id) : "";
    const upazilaObj = (upazilaMap[districtId] || []).find(
      (u) => u.name === dbUser?.upazila
    );
    const upazilaId = upazilaObj ? String(upazilaObj.id) : "";

    setForm({
      username: dbUser?.username || "",
      bloodGroup: dbUser?.bloodGroup || "",
      districtId,
      upazilaId,
      districtName: dbUser?.district || "",
      upazilaName: dbUser?.upazila || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user?.email) return;

    const districtObj = districts.find(
      (d) => String(d.id) === String(form.districtId)
    );
    const upazilaObj = (upazilaMap[form.districtId] || []).find(
      (u) => String(u.id) === String(form.upazilaId)
    );

    const payload = {
      username: form.username,
      bloodGroup: form.bloodGroup,
      district: districtObj?.name || "",
      upazila: upazilaObj?.name || "",
    };

    if (!payload.district || !payload.upazila) {
      return Swal.fire("Error", "Please select district & upazila", "error");
    }

    try {
      await axiosSecure.patch(`/users/${user.email}`, payload);

      Swal.fire("Updated!", "Profile updated successfully.", "success");

      setDbUser((prev) => ({ ...prev, ...payload }));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#fbf6f6] px-4 py-10">
      <title>Profile</title>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Profile Card */}
        <div className="rounded-2xl bg-[#F7EFF0] shadow-2xl p-8 flex flex-col items-center">
          <div className="w-36 h-36 rounded-full ring-[6px] ring-[#D9252C] overflow-hidden">
            <img
              src={dbUser?.imageUrl || user?.photoURL}
              alt="profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-black">
            Full Name : {dbUser?.username || user?.displayName || "N/A"}
          </h2>
          <p className="text-sm text-black font-semibold">
            Mail Address : {dbUser?.email || user?.email}
          </p>
          <p className="text-sm text-black font-semibold">
            Blood Group : {dbUser?.bloodGroup || "N/A"}
          </p>
          <p className="text-sm text-black font-semibold">
            Location : {dbUser?.district || "N/A"} , {dbUser?.upazila || "N/A"}
          </p>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-5 w-full rounded-lg bg-[#D9252C] text-white font-semibold py-2.5"
            >
              Update Information
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                resetToDb();
              }}
              className="mt-5 w-full rounded-lg bg-gray-800 text-white font-semibold py-2.5"
            >
              Cancel Update
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-white shadow-2xl px-6 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">Profile Information</h1>
            <p className="text-[14px] mt-2 text-slate-800">
              Click “Update Information” to edit your profile.
            </p>
          </div>

          <form onSubmit={handleSave} className="mt-8 space-y-5">
            {/* Email */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Email</label>
              <input
                disabled
                value={dbUser?.email || user?.email || ""}
                className="w-full h-12 rounded-lg border-2 text-black px-4 bg-gray-100"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Full Name</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={isFormDisabled}
                className={`w-full h-12 rounded-lg border-2 text-black px-4 ${
                  isFormDisabled ? "bg-gray-100" : ""
                }`}
                required
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Blood Group</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                disabled={isFormDisabled}
                className={`w-full h-12 rounded-lg border-2 text-black px-4 ${
                  isFormDisabled ? "bg-gray-100" : ""
                }`}
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
              <label className="text-sm font-semibold text-black">District</label>
              <select
                name="districtId"
                value={form.districtId}
                onChange={handleDistrictChange}
                disabled={isFormDisabled}
                className={`w-full h-12 rounded-lg border-2 text-black px-4 ${
                  isFormDisabled ? "bg-gray-100" : ""
                }`}
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

            {/* Upazila */}
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Upazila</label>
              <select
                name="upazilaId"
                value={form.upazilaId}
                onChange={handleChange}
                disabled={isFormDisabled || !form.districtId}
                className={`w-full h-12 rounded-lg border-2 text-black px-4 ${
                  isFormDisabled ? "bg-gray-100" : ""
                }`}
                required
              >
                <option value="">Select upazila</option>
                {(upazilaMap[form.districtId] || []).map((u) => (
                  <option key={u.id} value={String(u.id)}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isFormDisabled}
              className={`w-full h-11 rounded-lg font-semibold text-white ${
                isFormDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#EE2B34] hover:bg-[#d9252c]"
              }`}
            >
              Save Changes
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-800">
            Go back to <Link to="/"><span className="text-[#EE2B34] font-semibold">Home</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
