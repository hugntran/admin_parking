import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../api/fetchWithAuth";
import { useNavigate } from "react-router-dom";
import Pagination from "../ContentBottom/Pagination";

interface Invoice {
  id: string;
  locationId: string;
  userId: string;
  ticketsCount: number;
  description: string;
  type: string;
  amount: number;
  voucherAmount: number;
  finalAmount: number;
  createdAt: string;
}

interface Location {
  id: string;
  name: string;
}

const formatUSD = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

interface InvoicePageProps {
  searchQuery: string; // Accept searchQuery prop
}

const InvoicePage = ({ searchQuery }: InvoicePageProps) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [locationMap, setLocationMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLocationMap = async () => {
    try {
      const response = await fetchWithAuth<{ content: Location[] }>("/app-data-service/locations/nearby?longitude=105.779303&latitude=21.028759&maxDistance=100&page=0&size=100");
      const map: Record<string, string> = {};
      response.content.forEach((loc) => {
        map[loc.id] = loc.name;
      });
      setLocationMap(map);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchInvoices = async (page: number) => {
    try {
      const pageSize = 25;
      // Lấy tất cả hóa đơn từ API mà không phân trang
      const response = await fetchWithAuth<{
        content: Invoice[];
        totalElements: number; // Tổng số hóa đơn có sẵn
      }>(`/app-data-service/api/invoices?size=${1000}&sort=createdAt,desc`); // Lấy tất cả dữ liệu với số lượng lớn, ví dụ 1000

      // Tính toán phân trang ở frontend
      const allInvoices = response.content.filter((invoice) => invoice.locationId) as Invoice[];

      // Nếu có giá trị tìm kiếm, lọc hóa đơn theo invoice ID hoặc location
      const filteredInvoices = allInvoices.filter(
        (invoice) => invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || (locationMap[invoice.locationId] || invoice.locationId).toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Xử lý phân trang
      const startIndex = (page - 1) * pageSize;
      const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + pageSize);

      setInvoices(paginatedInvoices);
      setTotalPages(Math.ceil(filteredInvoices.length / pageSize)); // Tính tổng số trang dựa trên dữ liệu
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchLocationMap();
    fetchInvoices(currentPage);
  }, [currentPage, searchQuery]); // Gọi lại fetchInvoices mỗi khi searchQuery thay đổi

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="pt-0 px-6 pb-6 bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">No</th>
              <th className="border border-gray-200 px-4 py-2">Invoice</th>
              <th className="border border-gray-200 px-4 py-2">Location</th>
              <th className="border border-gray-200 px-4 py-2">Total amount</th>
              <th className="border border-gray-200 px-4 py-2">Transaction type</th>
              <th className="border border-gray-200 px-4 py-2">Date & Time</th>
              <th className="border border-gray-200 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id} className="text-center border border-gray-200">
                <td className="px-4 py-2">{(currentPage - 1) * 25 + index + 1}</td>
                <td className="px-4 py-2">{invoice.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-4 py-2">{locationMap[invoice.locationId] || invoice.locationId}</td>
                <td className="px-4 py-2">{formatUSD(invoice.finalAmount)}</td>
                <td className="px-4 py-2">{invoice.type}</td>
                <td className="px-4 py-2">{new Date(invoice.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      navigate(`/invoice-detail/${invoice.id}`, {
                        state: {
                          invoice: {
                            ...invoice,
                            locationName: locationMap[invoice.locationId] || invoice.locationId,
                          },
                        },
                      })
                    }
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default InvoicePage;
