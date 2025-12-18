import { useContext, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/Provider";

const User = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [axiosSecure]);

  const handelStatus = async (email, status) => {
    try {
      await axiosSecure.patch(`/update/user/status?email=${email}&status=${status}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handelrole = async (email, role) => {
    try {
      await axiosSecure.patch(`/update/user/role?email=${email}&role=${role}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = useMemo(() => {
    if (statusFilter === "all") return users;

    return users.filter((u) => {
      const st = String(u?.status || "").trim().toLowerCase(); 
      return st === statusFilter; // active / blocked
    });
  }, [users, statusFilter]);

  return (
    <div>
      <title>Dashboard</title>

      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-5xl font-extrabold">All Users</h1>

            {/* ✅ Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border-2 bg-white px-3 text-black font-semibold"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="mt-10 rounded-3xl bg-[#F7EFF0]">
            <div className="overflow-x-auto">
              <div className="min-w-[1400px]">
                <div
                  className="grid text-center px-8 py-5 font-extrabold text-black bg-white border-t"
                  style={{
                    gridTemplateColumns:
                      "100px 280px 240px 160px 160px 300px",
                  }}
                >
                  <div>Avatar</div>
                  <div>Email</div>
                  <div>Name</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {filteredUsers.map((item) => (
                  <div
                    key={item._id}
                    className="grid text-black text-center px-8 py-6 border-t"
                    style={{
                      gridTemplateColumns:
                        "100px 280px 240px 160px 160px 400px",
                    }}
                  >
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          src={
                            item?.imageUrl ||
                            "https://i.ibb.co/2yZ3bVP/default-avatar.png"
                          }
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div>{item.email}</div>
                    <div>{item.username}</div>
                    <div>{item.role}</div>
                    <div>{item.status}</div>

                    <div className="flex gap-1 justify-center flex-wrap">
                      <button
                        onClick={() => handelStatus(item.email, "blocked")}
                        className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                      >
                        Block
                      </button>
                      <button
                        onClick={() => handelStatus(item.email, "active")}
                        className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                      >
                        Unblock
                      </button>
                      <button
                        onClick={() => handelrole(item.email, "volunteer")}
                        className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                      >
                        Volunteer
                      </button>
                      <button
                        onClick={() => handelrole(item.email, "admin")}
                        className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => handelrole(item.email, "donor")}
                        className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                      >
                        Donor
                      </button>
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="p-10 text-center text-gray-600 font-semibold">
                    No users found for this status.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
