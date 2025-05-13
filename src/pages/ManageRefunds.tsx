import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import SearchBar from "../components/ContentTop/SearchBar";
import RefundListPage from "../components/Refunds/RefundListPage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ManageRefunds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateFilterChange = (filter: string) => {
    const now = new Date();
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = null;

    switch (filter) {
      case "today":
        newStartDate = now;
        newEndDate = now;
        break;
      case "thisWeek":
        newStartDate = new Date(now.setDate(now.getDate() - now.getDay())); // Set to start of the week (Sunday)
        newEndDate = new Date(now.setDate(now.getDate() + 6)); // Set to the end of the week (Saturday)
        break;
      case "thisMonth":
        newStartDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
        newEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the month
        break;
      case "thisYear":
        newStartDate = new Date(now.getFullYear(), 0, 1); // Start of the year
        newEndDate = new Date(now.getFullYear(), 11, 31); // End of the year
        break;
      case "clear":
        newStartDate = null;
        newEndDate = null;
        break;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <>
      <PageMeta title="Refund" description="" />
      <PageBreadcrumb pageTitle="Refund" />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4 bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="🔍 Search by name, Id or description" />

              {/* Amount filter */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <label className="text-sm text-gray-600" htmlFor="amountFilter">
                  Filter Amount:
                </label>
                <select id="amountFilter" className="border rounded px-3 py-2 text-sm w-full" value={amountFilter} onChange={(e) => setAmountFilter(e.target.value)}>
                  <option value="">All Amounts</option>
                  <option value="lt50">Less than $50</option>
                  <option value="50to100">$50 - $100</option>
                  <option value="gt100">Greater than $100</option>
                </select>
              </div>

              {/* Date filter */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <label className="text-sm text-gray-600" htmlFor="dateFilter">
                    Filter Date:
                  </label>
                  {/* Quick date filter */}
                  <select id="dateFilter" className="border rounded px-3 py-2 text-sm w-full" onChange={(e) => handleDateFilterChange(e.target.value)}>
                    <option value="">Select Date Range</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                    <option value="clear">Clear Filter</option>
                  </select>

                  {/* Custom date range filter */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <label className="text-sm text-gray-600">From</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="border rounded px-3 py-2 text-sm w-full"
                      placeholderText="Start date"
                      dateFormat="yyyy-MM-dd"
                    />
                    <label className="text-sm text-gray-600">To</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      className="border rounded px-3 py-2 text-sm w-full"
                      placeholderText="End date"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-md bg-gray-50">
            <RefundListPage searchTerm={searchTerm} amountFilter={amountFilter} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </>
  );
}
