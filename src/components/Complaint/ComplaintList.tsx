import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchWithAuth } from "../../api/fetchWithAuth";
import Pagination from "../ContentBottom/Pagination";

interface Complaint {
  id: string;
  userEmail: string;
  service: string;
  title: string;
  bookingId: string;
  description: string;
  images: string[];
  status: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface ComplaintListProps {
  searchText: string;
  statusFilter: string;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ searchText, statusFilter }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 10;
  const location = useLocation();

  const paginate = (page: number) => setCurrentPage(page);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchSearch = complaint.title.toLowerCase().includes(searchText.toLowerCase()) || complaint.userEmail.toLowerCase().includes(searchText.toLowerCase());

    const matchStatus = statusFilter === "ALL" || complaint.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth<{ content: any[] }>("/dispute/api/filtered?admin=true&size=100&page=0");
      const mappedData: Complaint[] = data.content.map((item) => ({
        id: item.id,
        userEmail: item.userEmail,
        service: item.service,
        title: item.title,
        bookingId: item.bookingId,
        description: item.description,
        images: item.images,
        status: item.status,
        createdAt: item.createdAt,
        updatedBy: item.updatedBy,
        updatedAt: item.updatedAt,
      }));

      const sortedData = mappedData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setComplaints(sortedData);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.updatedId) {
      fetchData();
    }
  }, [location.state]);

  return (
    <div className="pt-0 px-6 pb-6 bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">No</th>
              <th className="border border-gray-200 px-4 py-2">Customer Email</th>
              <th className="border border-gray-200 px-4 py-2">Title</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentComplaints.map((complaint, index) => (
              <tr key={complaint.id} className="text-center border border-gray-200">
                <td className="px-4 py-2">{index + 1 + (currentPage - 1) * complaintsPerPage}</td>
                <td className="px-4 py-2">{complaint.userEmail}</td>
                <td className="px-4 py-2">{complaint.title}</td>
                <td className="px-4 py-2">{complaint.status}</td>
                <td className="px-4 py-2">
                  <Link to={`/complaint/${complaint.id}`} state={complaint} className="text-blue-500 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
    </div>
  );
};

export default ComplaintList;
