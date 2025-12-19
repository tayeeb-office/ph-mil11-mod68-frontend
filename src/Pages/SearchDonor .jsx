import React, { useEffect, useState } from "react";

const bloodOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const extractTableData = (exportJson, tableName) => {
  const tableBlock = exportJson?.find(
    (x) => x?.type === "table" && x?.name === tableName
  );
  return tableBlock?.data || [];
};

const SearchDonor = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [districts, setDistricts] = useState([]);
  const [upazilaMap, setUpazilaMap] = useState({});
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDistrictChange = (e) => {
    setDistrictId(e.target.value);
    setUpazilaId("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const districtObj = districts.find(
      (d) => String(d.id) === String(districtId)
    );
    const upazilaObj = (upazilaMap[districtId] || []).find(
      (u) => String(u.id) === String(upazilaId)
    );

    const districtName = districtObj?.name || "";
    const upazilaName = upazilaObj?.name || "";

    try {
      setLoading(true);
      setSearched(true);

      const params = new URLSearchParams();
      if (bloodGroup) params.append("bloodGroup", bloodGroup);
      if (districtName) params.append("district", districtName);
      if (upazilaName) params.append("upazila", upazilaName);

      const res = await fetch(
        `https://ph-mil11-mod68-backend.vercel.app/donor-search?${params.toString()}`
      );
      const data = await res.json();

      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf6f6] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-black">Search Donor</h1>
        <p className="mt-2 text-sm text-gray-600">
          Search donors by blood group, district and upazila.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 rounded-2xl bg-white p-6 shadow"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="h-12 rounded-lg border px-4"
              required
            >
              <option value="">Select Blood Group</option>
              {bloodOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={districtId}
              onChange={handleDistrictChange}
              className="h-12 rounded-lg border px-4"
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={upazilaId}
              onChange={(e) => setUpazilaId(e.target.value)}
              className="h-12 rounded-lg border px-4"
              disabled={!districtId}
              required
            >
              <option value="">Select Upazila</option>
              {(upazilaMap[districtId] || []).map((u) => (
                <option key={u.id} value={String(u.id)}>
                  {u.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-12 rounded-lg bg-red-500 font-semibold text-white hover:bg-red-600"
            >
              Search
            </button>
          </div>
        </form>

        {searched && (
          <div className="mt-8 rounded-2xl bg-white shadow">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-bold text-black">Donor List</h2>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading...
              </div>
            ) : donors.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No donors found.
              </div>
            ) : (
              <div>
                {donors.map((d) => (
                  <div
                    key={d._id}
                    className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {d.name || d.username || "Donor"}
                      </p>
                      <p className="text-sm text-gray-600">{d.email}</p>
                      <p className="text-sm text-gray-600">
                        {d.district} - {d.upazila}
                      </p>
                    </div>

                    <div className="font-extrabold text-red-500 text-lg">
                      {d.bloodGroup}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonor;
