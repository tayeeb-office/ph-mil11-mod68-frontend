import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router";
import Swal from "sweetalert2";

const AllReq = () => {
  const { role } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [totalRequest, setTotalRequest] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const size = 10;

  const [statusFilter, setStatusFilter] = useState("all"); 

  const totalPages = Math.ceil(totalRequest / size);
  const pages = useMemo(() => [...Array(totalPages).keys()], [totalPages]);

  useEffect(() => {
    const load = async () => {
      try {
        const url = `/all-request?page=${currentPage}&size=${size}`;
        const res = await axiosSecure.get(url);

        setRequests(res.data.request);
        setTotalRequest(res.data.totalRequest);
      } catch (err) {
        console.error(err);
      }
    };

    if (role) load();
  }, [role, currentPage, axiosSecure]);

  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") return requests;

    return requests.filter((r) => {
      const st = String(r?.status || "").trim().toLowerCase();
      return st === statusFilter;
    });
  }, [requests, statusFilter]);

  const handelStatus = async (id, status) => {
    setRequests((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );

    try {
      await axiosSecure.patch(`/update/request/status?id=${id}&status=${status}`);
    } catch (err) {
      console.error(err);
      // reload current page if failed
      try {
        const res = await axiosSecure.get(`/all-request?page=${currentPage}&size=${size}`);
        setRequests(res.data.request);
        setTotalRequest(res.data.totalRequest);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This request will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EE2B34",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/requests/${id}`);

      setRequests((prev) => prev.filter((item) => item._id !== id));
      setTotalRequest((prev) => Math.max(prev - 1, 0));

      Swal.fire("Deleted!", "Request has been deleted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to delete request.", "error");
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-5xl font-extrabold">All Requests</h1>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border-2 bg-white px-4 text-black font-semibold"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div className="mt-10 rounded-3xl bg-[#F7EFF0]">
          <div className="overflow-x-auto">
            <div className="min-w-[2000px]">
              <div
                className="grid text-center px-8 py-5 font-extrabold text-black bg-white border-t"
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

              {filteredRequests.map((item) => (
                <div
                  key={item._id}
                  className="grid text-black text-center px-8 py-6 border-t"
                  style={{
                    gridTemplateColumns:
                      "180px 140px 140px 160px 160px 140px 120px 160px 260px 450px",
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
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => handelStatus(item._id, "done")}
                          className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                        >
                          Status Done
                        </button>
                        <button
                          onClick={() => handelStatus(item._id, "canceled")}
                          className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                        >
                          Status Canceled
                        </button>
                      </>
                    )}

                    {role === "admin" && (
                      <>
                        <Link to={`/dashboard/my-donation-requests/view/${item._id}`}>
                          <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                            View
                          </button>
                        </Link>

                        <Link to={`/dashboard/my-donation-requests/update/${item._id}`}>
                          <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                            Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="p-10 text-center text-gray-600 font-semibold">
                  No requests found for this status.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination (still works) */}
        <div className="flex justify-center mt-12 gap-4">
          <button onClick={handlePrev} className="btn" disabled={currentPage === 0}>
            Prev
          </button>

          {pages.map((page) => (
            <button
              key={page}
              className={`btn ${page === currentPage ? "bg-[#435585] text-white" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page + 1}
            </button>
          ))}

          <button
            onClick={handleNext}
            className="btn"
            disabled={currentPage === totalPages - 1 || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllReq;
