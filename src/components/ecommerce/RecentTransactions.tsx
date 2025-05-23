import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../api/fetchWithAuth";

type Invoice = {
  id: string;
  createdAt: string;
  userId: string;
  amount: number;
  finalAmount: number;
  type: string;
};

const RecentTransactions: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetchWithAuth<{ content: Invoice[] }>("/app-data-service/api/invoices?size=1000&sort=createdAt,desc");
        setInvoices(res.content.slice(0, 5));
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p>Loading recent transactions...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">🧾 Recent Transactions</h2>
      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Invoice ID</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Transactions type</th>
            <th className="px-4 py-2">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv: Invoice) => (
            <tr key={inv.id} className="border-t">
              <td className="px-4 py-2">{inv.id.slice(0, 8).toUpperCase()}</td>
              <td className="px-4 py-2">${inv.finalAmount.toFixed(2)}</td>
              <td className="px-4 py-2">{inv.type}</td>
              <td className="px-4 py-2">{new Date(inv.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
