import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/Provider";

const User = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);

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
      const res = await axiosSecure.patch(
        `/update/user/status?email=${email}&status=${status}`
      );

      console.log(res.data);
      fetchUsers(); 
    } catch (error) {
      console.error(error);
    }
  };

  console.log(users);
  return (
    <div>
      <title>Dashboard</title>
      <div className="min-h-screen  px-4 py-10 ">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-5xl font-extrabold">All Users</h1>
          </div>

          <div className="mt-10 rounded-3xl bg-[#F7EFF0]">
            <div className="overflow-x-auto">
              <div className="min-w-[1350px]">
                <div
                  className="grid text-center px-8 py-5 font-extrabold text-black bg-white border-t "
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

                {/* Rows */}
                {users.map((item) => (
                  <div
                    key={item._id}
                    className="grid text-black text-center px-8 py-6 border-t "
                    style={{
                      gridTemplateColumns:
                        "100px 280px 240px 160px 160px 300px",
                    }}
                  >
                      <div className="w-10 rounded-full">
                        <img
                          alt="Avatar"
                          src={
                            item?.imageUrl ||
                            "https://i.ibb.co/2yZ3bVP/default-avatar.png"
                          }
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    <div>{item.email}</div>
                    <div>{item.username}</div>
                    <div>{item.role}</div>
                    <div>{item.status}</div>
                    <div className="flex gap-1">
                      <button onClick={()=>handelStatus(item.email, 'blocked')} className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                        Block
                      </button>
                      <button onClick={()=>handelStatus(item.email, 'active')} className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                        Unblock
                      </button>
                      <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                        Volunteer
                      </button>
                      <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">
                        Admin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default User;
