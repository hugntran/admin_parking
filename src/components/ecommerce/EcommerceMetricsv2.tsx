import { GroupIcon } from "../../icons";
import { useState, useEffect } from "react";

export default function EcommerceMetricsv2() {
  const [customersCount, setCustomersCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [customersData, setCustomersData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchCustomersCount = async () => {
      if (token) {
        try {
          const response = await fetch("/app-data-service/tickets/verify-required?page=0&size=100", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setCustomersCount(data.totalElements);
          setCustomersData(data.content); // 👈 Lưu lại toàn bộ danh sách
        } catch (error) {
          console.error("Error fetching customers count:", error);
        }
      }
    };

    const fetchOrdersCount = async () => {
      if (token) {
        try {
          const response = await fetch("/app-data-service/tickets/verify-required-change-time?page=0&size=100&sort=startDateTime,desc", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setOrdersCount(data.totalElements); // 👈 Lấy đúng field
        } catch (error) {
          console.error("Error fetching orders count:", error);
        }
      }
    };

    fetchCustomersCount();
    fetchOrdersCount();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Extend requests: {customersCount !== null ? customersCount : "Loading..."}</span>

          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Location:</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{customersData.length > 0 ? customersData[0]?.parent?.locationName ?? "Unknown location" : "No data"}</p>
          </div>
        </div>
      </div>

      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Change time requests: {ordersCount !== null ? ordersCount : "Loading..."}</span>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
