import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const DashHome = () => {
  const [myrequests, setMyrequests] = useState([]);

  const [requests, setRequests] = useState([]);

  const { user, role } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`http://localhost:5000/dashboard/requests?email=${user.email}`)
      .then((res) => {
        setMyrequests(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user?.email]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard/requests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [role]);

  const axiosSecure = useAxiosSecure();

  const [id, setId] = useState([]);

  const fetchid = async () => {
    try {
      const res = await axiosSecure.get("/requests");
      setId(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchid();
  }, [axiosSecure]);

  const handelStatus = async (id, status) => {
    setRequests((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );

    setMyrequests((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );

    try {
      await axiosSecure.patch(
        `/update/request/status?id=${id}&status=${status}`
      );
    } catch (error) {
      console.error(error);

      const res = await axios.get("http://localhost:5000/dashboard/requests");
      setRequests(res.data);
    }
  };

  console.log(id);

  return (
    <div>
      <title>Dashboard</title>
      <div className="min-h-screen  px-4 py-10 ">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-5xl font-extrabold">Recent Requests</h1>
          </div>

          {/* Admin & Volunteer Recent Requests */}
          {(role === "admin" || role === "volunteer") && (
            <div className="mt-10 rounded-3xl bg-[#F7EFF0]">
              <div className="overflow-x-auto">
                <div className="min-w-[2000px]">
                  <div
                    className="grid text-center px-8 py-5 font-extrabold text-black bg-white border-t "
                    style={{
                      gridTemplateColumns:
                        "180px 140px 140px 160px 160px 140px 120px 160px 260px 400px",
                    }}
                  >
                    <div>Recipient Name</div>
                    <div>District</div>
                    <div>Upazila</div>
                    <div>Donation Date</div>
                    <div>Donation Time</div>
                    <div>Blood Group</div>
                    <div>Status</div>
                    <div>Donor Name</div>
                    <div>Donor Email</div>
                    <div>Actions</div>
                  </div>

                  {/* Rows */}
                  {requests.map((item) => (
                    <div
                      key={item._id}
                      className="grid text-black text-center px-8 py-6 border-t "
                      style={{
                        gridTemplateColumns:
                          "180px 140px 140px 160px 160px 140px 120px 160px 260px 400px",
                      }}
                    >
                      <div>{item.recipientName}</div>
                      <div>{item.district}</div>
                      <div>{item.upazila}</div>
                      <div>{item.donationDate}</div>
                      <div>{item.donationTime}</div>
                      <div>{item.bloodGroup}</div>
                      <div className="font-semibold">{item.status}</div>
                      <div>{item.requesterName}</div>
                      <div>{item.requesterEmail}</div>
                      <div className="flex gap-1">
                        {item.status == "pending" && (
                          <>
                            <button
                              onClick={() => handelStatus(item._id, "done")}
                              className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                            >
                              Status Done
                            </button>
                            <button
                              onClick={() => handelStatus(item._id, "cancel")}
                              className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                            >
                              Status Cancel
                            </button>
                          </>
                        )}

                        <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                          View
                        </button>
                        <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                          Edit
                        </button>
                        <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Donor Recent Requests */}
          {role === "donor" && (
            <div className="mt-10 rounded-3xl bg-[#F7EFF0]">
              <div className="overflow-x-auto">
                <div className="min-w-[2000px]">
                  <div
                    className="grid text-center px-8 py-5 font-extrabold text-black bg-white border-t "
                    style={{
                      gridTemplateColumns:
                        "180px 140px 140px 160px 160px 140px 120px 160px 260px 400px",
                    }}
                  >
                    <div>Recipient Name</div>
                    <div>District</div>
                    <div>Upazila</div>
                    <div>Donation Date</div>
                    <div>Donation Time</div>
                    <div>Blood Group</div>
                    <div>Status</div>
                    <div>Donor Name</div>
                    <div>Donor Email</div>
                    <div>Actions</div>
                  </div>

                  {/* Rows */}
                  {myrequests.slice(-3).map((item) => (
                    <div
                      key={item._id}
                      className="grid text-black text-center px-8 py-6 border-t "
                      style={{
                        gridTemplateColumns:
                          "180px 140px 140px 160px 160px 140px 120px 160px 260px 400px",
                      }}
                    >
                      <div>{item.recipientName}</div>
                      <div>{item.district}</div>
                      <div>{item.upazila}</div>
                      <div>{item.donationDate}</div>
                      <div>{item.donationTime}</div>
                      <div>{item.bloodGroup}</div>
                      <div className="font-semibold">{item.status}</div>
                      <div>{item.requesterName}</div>
                      <div>{item.requesterEmail}</div>
                      <div className="flex gap-1">
                         {item.status == "pending" && (
                          <>
                            <button
                              onClick={() => handelStatus(item._id, "done")}
                              className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                            >
                              Status Done
                            </button>
                            <button
                              onClick={() => handelStatus(item._id, "cancel")}
                              className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                            >
                              Status Cancel
                            </button>
                          </>
                        )}
                        <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                          View
                        </button>
                        <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                          Edit
                        </button>
                        <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button className="mt-6 px-3 py-1 rounded bg-rose-600 text-white text-sm">
            View All Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
