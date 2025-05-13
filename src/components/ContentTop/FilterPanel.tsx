import React, { useState, useEffect } from "react";

interface FilterPanelProps {
  onFilterChange?: (filters: { status: string; sortOrder: string }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange = () => {} }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    onFilterChange({ status: selectedStatus, sortOrder });
  }, [selectedStatus, sortOrder, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex-1 min-w-[150px]">
        <label className="block font-medium mb-1">Filter by status:</label>
        <select
          className="w-full p-2 border rounded text-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Close">Closed</option>
          <option value="Full">Full</option>
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block font-medium mb-1">Filter by facility:</label>
        <select
          className="w-full p-2 border rounded text-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
