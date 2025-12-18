import React, { useContext, useEffect, useState } from "react";
import {useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../Provider/Provider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const extractTableData = (exportJson, tableName) => {
  const tableBlock = exportJson?.find(
    (x) => x?.type === "table" && x?.name === tableName
  );
  return tableBlock?.data || [];
};

const CreateReq = () => {
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bloodGroups, setBloodGroups] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [upazilaMap, setUpazilaMap] = useState({});
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const axiosSecure = useAxiosSecure();

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

    const requesterName = user?.displayName || "";
    const requesterEmail = user?.email || "";

    const recipientName = e.target.recipientname.value.trim();
    const bloodGroup = e.target.bloodGroup.value;

    const districtId = e.target.district.value;
    const upazilaId = e.target.upazila.value;

    const address = e.target.fulladdress.value.trim();

    const hospitalName = e.target.hospitalname.value.trim(); 
    const donationDate = e.target.donationDate.value; 
    const donationTime = e.target.donationTime.value; 
    const message = e.target.message.value.trim();

    setError("");

    const districtObj = districts.find(
      (d) => String(d.id) === String(districtId)
    );
    const upazilaObj = (upazilaMap[districtId] || []).find(
      (u) => String(u.id) === String(upazilaId)
    );

    const districtNameEn = districtObj?.name || "";
    const upazilaNameEn = upazilaObj?.name || "";

    if (!districtNameEn) return setError("Invalid district selected");
    if (!upazilaNameEn) return setError("Invalid upazila selected");

    try {
      const requestPayload = {
        requesterName,
        requesterEmail,
        recipientName,
        bloodGroup,
        district: districtNameEn,
        upazila: upazilaNameEn,
        address,
        hospitalName,
        donationDate,
        donationTime,
        message,
      };

      await axiosSecure.post("/requests", requestPayload);

      Swal.fire({ title: "Request Created", icon: "success" });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  console.log(error);

  return (
    <div>
      <title>Create Request</title>
      <div>
        <section className="w-full flex items-center justify-center px-4 py-30">
          <div className="w-full max-w-md rounded-2xl bg-[#F7EFF0] shadow-2xl px-6 py-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black">
                Create Your Request
              </h1>
              <p className="text-[14px] mt-2 text-slate-800">
                Please enter your details to create a request.
              </p>
            </div>

            <form onSubmit={handelSubmit} className="mt-8 space-y-5">
              {/* Full Name */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Requester Name
                </label>
                <input
                  disabled
                  defaultValue={user?.displayName}
                  name="requestername"
                  type="text"
                  placeholder="Write Full Name here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Requester Address
                </label>
                <input
                  disabled
                  defaultValue={user?.email}
                  type="email"
                  name="requesteremail"
                  placeholder="you@example.com"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
                />
              </div>

              {/* Recipient Name */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Recipient Name
                </label>
                <input
                  name="recipientname"
                  type="text"
                  placeholder="Write Full Name here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
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

              {/* District*/}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  District
                </label>
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

              {/* Upazila*/}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Upazila
                </label>
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

              {/* Full Address */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Full Address
                </label>
                <input
                  name="fulladdress"
                  type="text"
                  placeholder="Write Full Address here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
                />
              </div>

              {/* Hospital Name */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Hospital Name
                </label>
                <input
                  name="hospitalname"
                  type="text"
                  placeholder="Write Hospital Name here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
                />
              </div>

              {/* Donation Date */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Donation Date
                </label>
                <input
                  name="donationDate"
                  type="date"
                  placeholder="Write Hospital Name here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
                />
              </div>

              {/* Donation Time */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Donation Time
                </label>
                <input
                  name="donationTime"
                  type="time"
                  placeholder="Write Hospital Name here"
                  className="w-full h-12 rounded-lg border-2 text-black placeholder:text-slate-500 px-4"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  Message
                </label>
                <textarea
                rows="4"
                name="message"
                placeholder="Write Message here"
                className="w-full rounded-lg border-2 text-black placeholder:text-slate-500 p-4"
                >
                </textarea>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#EE2B34] hover:bg-[#d9252c] text-white font-semibold"
              >
                Create Request
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateReq;
