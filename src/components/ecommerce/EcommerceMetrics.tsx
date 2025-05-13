import { ArrowUpIcon, BoxIconLine, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { useState, useEffect } from "react";

export default function EcommerceMetrics() {
  const [customersCount, setCustomersCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchCustomersCount = async () => {
      if (token) {
        try {
          const response = await fetch("/identity/users/get-users-admin?page=0&size=100", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setCustomersCount(data.result.numberOfElements);
        } catch (error) {
          console.error("Error fetching customers count:", error);
        }
      }
    };

    const fetchOrdersCount = async () => {
      if (token) {
        try {
          const response = await fetch("/app-data-service/api/invoices?page=0&size=1000", {
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

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{customersCount !== null ? customersCount : "Loading..."}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Bookings</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90"> {ordersCount !== null ? ordersCount : "Loading..."}</h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
