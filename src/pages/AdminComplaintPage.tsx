import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComplaintList from "../components/Complaint/ComplaintList";
import SearchBar from "../components/ContentTop/SearchBar";

export default function AdminComplaintPage() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  return (
    <>
      <PageMeta title="Complaint" description="" />
      <PageBreadcrumb pageTitle="Complaint" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 lg:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            {/* Search */}
            <div className="w-full md:w-64">
              <SearchBar value={searchText} onChange={setSearchText} placeholder="🔍 Search by title or email" />
            </div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full sm:w-48">
                {/* Label */}
                <label className="text-sm font-medium text-gray-700">Status: </label>
                {/* Select */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETE">Complete</option>
                </select>
                {/* Dropdown Icon */}
                <div className="pointer-events-none absolute right-3 top-9 text-gray-400">▼</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-md bg-gray-50">
            <ComplaintList searchText={searchText} statusFilter={statusFilter} />
          </div>
        </div>
      </div>
    </>
  );
}
