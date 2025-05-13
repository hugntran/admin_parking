import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface VoucherFilterProps {
  onFilterChange?: (filters: { status: string; sortOrder: string; startDate: string; endDate: string }) => void;
}

const VoucherFilter: React.FC<VoucherFilterProps> = ({ onFilterChange = () => {} }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    onFilterChange({ status: selectedStatus, sortOrder, startDate, endDate });
  }, [selectedStatus, sortOrder, startDate, endDate, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* Dropdown Lọc Trạng Thái */}
      <div className="flex-1 min-w-[150px]">
        <label className="block font-medium mb-1">Filter by status:</label>
        <select
          className={clsx("w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300")}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Unactive">Unactive</option>
        </select>
      </div>

      {/* Bộ lọc theo khoảng thời gian - Ngày bắt đầu */}
      <div className="flex-1 min-w-[150px]">
        <label className="block font-medium mb-1">Filter from:</label>
        <input
          type="date"
          className={clsx("w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300")}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      {/* Bộ lọc theo khoảng thời gian - Ngày kết thúc */}
      <div className="flex-1 min-w-[150px]">
        <label className="block font-medium mb-1">To:</label>
        <input
          type="date"
          className={clsx("w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300")}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default VoucherFilter;