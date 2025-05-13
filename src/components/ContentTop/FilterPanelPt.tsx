import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface FilterPanelPtProps {
  onFilterChange?: (filters: { status: string; sortOrder: string }) => void;
}

const FilterPanelPt: React.FC<FilterPanelPtProps> = ({ onFilterChange = () => {} }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    onFilterChange({ status: selectedStatus, sortOrder });
  }, [selectedStatus, sortOrder, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* Dropdown Lọc Trạng Thái */}
      <div className="flex-1 min-w-[150px]">
        <label className="block font-medium mb-1">Filter by status:</label>
        <select
          className={clsx(
            "w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          )}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Processed">Processed</option>
          <option value="Reject">Reject</option>
          <option value="In progress">In progress</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanelPt;
