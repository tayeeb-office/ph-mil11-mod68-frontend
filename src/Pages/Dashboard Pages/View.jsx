import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/requests/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id, axiosSecure]);

  if (loading) return <div className="p-6">Loading request...</div>;
  if (!data) return <div className="p-6">Request not found</div>;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl bg-[#F7EFF0] rounded-3xl p-8">
        <h1 className="text-4xl font-extrabold mb-6">View Request</h1>

        <div className="space-y-4">
          <LabelInput label="Recipient Name" value={data.recipientName} />
          <LabelInput label="Blood Group" value={data.bloodGroup} />
          <LabelInput label="District" value={data.district} />
          <LabelInput label="Upazila" value={data.upazila} />
          <LabelInput label="Full Address" value={data.address} />
          <LabelInput label="Hospital Name" value={data.hospitalName} />

          <div className="grid grid-cols-2 gap-4">
            <LabelInput label="Donation Date" value={data.donationDate} />
            <LabelInput label="Donation Time" value={data.donationTime} />
          </div>

          <div>
            <label className="text-sm font-semibold text-black">Message</label>
            <textarea
              className="w-full p-3 rounded border-2 bg-gray-100"
              value={data.message || ""}
              disabled
              rows={4}
            />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 rounded bg-rose-600 text-white"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

const LabelInput = ({ label, value }) => (
  <div>
    <label className="text-sm font-semibold text-black">{label}</label>
    <input
      className="w-full p-3 rounded border-2 bg-gray-100"
      value={value || ""}
      disabled
      readOnly
    />
  </div>
);

export default View;