import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../Loading";

const extractTableData = (exportJson, tableName) => {
  const tableBlock = exportJson?.find(
    (x) => x?.type === "table" && x?.name === tableName
  );
  return tableBlock?.data || [];
};

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bloodGroups, setBloodGroups] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilaMap, setUpazilaMap] = useState({});
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [form, setForm] = useState({
    recipientName: "",
    bloodGroup: "",
    districtId: "",
    upazilaId: "",
    address: "",
    hospitalName: "",
    donationDate: "",
    donationTime: "",
    message: "",
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
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/requests/${id}`);
        const r = res.data;

        const districtName = r?.district || "";
        const upazilaName = r?.upazila || "";

        setForm((prev) => ({
          ...prev,
          recipientName: r?.recipientName || "",
          bloodGroup: r?.bloodGroup || "",
          address: r?.address || "",
          hospitalName: r?.hospitalName || "",
          donationDate: r?.donationDate || "",
          donationTime: r?.donationTime || "",
          message: r?.message || "",
          districtId: "",
          upazilaId: "",
        }));

        setTempGeoNames({ districtName, upazilaName });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const [tempGeoNames, setTempGeoNames] = useState({
    districtName: "",
    upazilaName: "",
  });

  useEffect(() => {
    if (!districts.length) return;

    const { districtName, upazilaName } = tempGeoNames;
    if (!districtName) return;

    const districtObj = districts.find((d) => d.name === districtName);
    const districtId = districtObj ? String(districtObj.id) : "";

    if (districtId) {
      setSelectedDistrictId(districtId);
      setForm((prev) => ({ ...prev, districtId }));
    }

    if (districtId && upazilaName) {
      const upa = (upazilaMap[districtId] || []).find(
        (u) => u.name === upazilaName
      );
      const upazilaId = upa ? String(upa.id) : "";
      setForm((prev) => ({ ...prev, upazilaId }));
    }
  }, [districts, upazilaMap, tempGeoNames]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrictId(districtId);

    setForm((prev) => ({
      ...prev,
      districtId,
      upazilaId: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const districtObj = districts.find(
        (d) => String(d.id) === String(form.districtId)
      );
      const upazilaObj = (upazilaMap[form.districtId] || []).find(
        (u) => String(u.id) === String(form.upazilaId)
      );

      const payload = {
        recipientName: form.recipientName,
        bloodGroup: form.bloodGroup,
        district: districtObj?.name || "",
        upazila: upazilaObj?.name || "",
        address: form.address,
        hospitalName: form.hospitalName,
        donationDate: form.donationDate,
        donationTime: form.donationTime,
        message: form.message,
      };

      await axiosSecure.patch(`/requests/${id}`, payload);

      navigate("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading></Loading>

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl bg-[#F7EFF0] rounded-3xl p-8">
        <h1 className="text-4xl font-extrabold mb-6">Update Request</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient */}
           <label className="text-sm font-semibold text-black">Recipient Name</label>
          <input
            className="w-full p-3 rounded border-2"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            placeholder="Recipient Name"
            required
          />

          {/* Blood group dropdown */}
          <label className="text-sm font-semibold text-black">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full p-3 rounded border-2"
            required
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((g) => (
              <option key={g.id} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

          {/* District + Upazila */}
          <label className="text-sm font-semibold text-black">District & Upazila</label>
          <div className="grid grid-cols-2 gap-4">
            
            <select
              name="districtId"
              value={form.districtId}
              onChange={handleDistrictChange}
              className="w-full p-3 rounded border-2"
              required
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              name="upazilaId"
              value={form.upazilaId}
              onChange={handleChange}
              className="w-full p-3 rounded border-2"
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
          <label className="text-sm font-semibold text-black">Full Address</label>
          <input
            className="w-full p-3 rounded border-2"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full Address"
            required
          />

          {/* Hospital */}
          <label className="text-sm font-semibold text-black">Hospital Name</label>
          <input
            className="w-full p-3 rounded border-2"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            placeholder="Hospital Name"
            required
          />

          {/* Date + Time */}
          <label className="text-sm font-semibold text-black">Date & Time</label>
          <div className="grid grid-cols-2 gap-4">
            
            <input
              className="w-full p-3 rounded border-2"
              name="donationDate"
              value={form.donationDate}
              onChange={handleChange}
              type="date"
              required
            />

            <input
              className="w-full p-3 rounded border-2"
              name="donationTime"
              value={form.donationTime}
              onChange={handleChange}
              type="time"
              required
            />
          </div>

          {/* Message */}
          <label className="text-sm font-semibold text-black">Message</label>
          <textarea
            className="w-full p-3 rounded border-2"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            rows={4}
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              disabled={saving}
              className="px-5 py-2 rounded bg-rose-600 text-white"
              type="submit"
            >
              {saving ? "Saving..." : "Update"}
            </button>

            <button
              type="button"
              className="px-5 py-2 rounded bg-gray-800 text-white"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
