import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../ContentBottom/Pagination";

interface Refund {
  id: string;
  bookingId: string;
  ticketIds: string[];
  userId: string;
  userName: string | null;
  email: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface RefundListPageProps {
  searchTerm: string;
  amountFilter: string;
  startDate: Date | null; // Chuyển thành Date
  endDate: Date | null; // Chuyển thành Date
}

const RefundListPage: React.FC<RefundListPageProps> = ({ searchTerm, amountFilter, startDate, endDate }) => {
  const [allRefunds, setAllRefunds] = useState<Refund[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 20;

  const fetchRefunds = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/app-data-service/api/refunds/get-refunds?size=${pageSize}&page=${page - 1}&sortBy=createdAt&direction=DESC`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch refunds");
      }

      const data = await response.json();
      setAllRefunds(data.content);
      setRefunds(data.content);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = allRefunds.filter((refund) => {
      const createdAt = new Date(refund.createdAt);

      // Search
      const matchesSearch = refund.userName?.toLowerCase().includes(term) || refund.id.toLowerCase().includes(term) || refund.description.toLowerCase().includes(term);

      // Amount filter
      let matchesAmount = true;
      if (amountFilter === "lt50") matchesAmount = refund.amount < 50;
      else if (amountFilter === "50to100") matchesAmount = refund.amount >= 50 && refund.amount <= 100;
      else if (amountFilter === "gt100") matchesAmount = refund.amount > 100;

      // Time range filter
      let matchesDate = true;
      if (startDate) {
        matchesDate = createdAt >= startDate;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Đảm bảo kết thúc ngày được tính đúng
        matchesDate = matchesDate && createdAt <= end;
      }

      return matchesSearch && matchesAmount && matchesDate;
    });

    setRefunds(filtered);
  }, [searchTerm, amountFilter, startDate, endDate, allRefunds]);

  if (loading) return <p>Loading refunds...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pt-0 px-6 pb-6 bg-white rounded-lg shadow text-center">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Id</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Transaction Time</th>
              <th className="border px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund, index) => (
              <tr key={refund.id}>
                <td className="border px-4 py-2">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="border px-4 py-2">{refund.id.slice(0, 8).toUpperCase()}</td>
                <td className="border px-4 py-2">{refund.userName ?? "N/A"}</td>
                <td className="border px-4 py-2">{refund.description}</td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(refund.amount)}
                </td>
                <td className="border px-4 py-2">{new Date(refund.createdAt).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <Link to={`/refund-list/${refund.id}`} state={refund} className="text-blue-500 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </div>
  );
};

export default RefundListPage;
