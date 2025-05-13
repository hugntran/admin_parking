import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Định nghĩa interface cho Role và User
interface Role {
  name: string;
  description: string;
  permissions: string[];
}

interface User {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  dob: string | null;
  roles: Role[];
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
}

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Điều hướng khi nhấn nút "Back"

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`/identity/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUser(data.result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        {/* Nút Back */}
        <button
          onClick={() => navigate(-1)} // Điều hướng trở lại trang trước
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
      </div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Details</h1>
      {user ? (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            {/* Hiển thị ảnh avatar */}
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mr-6" />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full mr-6 flex items-center justify-center">
                <span className="text-white text-lg">No Image</span>
              </div>
            )}
            <div>
              <p className="text-xl text-gray-700">
                <strong>Username:</strong> {user.username ? user.username.split("@")[0] : "N/A"}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                <strong>Phone:</strong> {user.phone ?? "N/A"}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                <strong>Date of Birth:</strong> {user.dob ?? "N/A"}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                <strong>Email Verified:</strong> {user.emailVerified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default UserDetailPage;
