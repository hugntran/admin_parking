import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import InvoicePage from "../components/Invoice/InvoicePage";
import SearchBar from "../components/ContentTop/SearchBar";

export default function ManageInvoice() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <PageMeta title="Invoice" description="" />
      <PageBreadcrumb pageTitle="Invoice" />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4 bg-gray-50 p-3 rounded-lg shadow-sm">
            {/* Add SearchBar */}
            <SearchBar value={searchValue} onChange={handleSearchChange} placeholder="🔍 Search by Invoice ID or Location" />
          </div>
          <div className="rounded-lg shadow-md bg-gray-50">
            {/* Pass the searchValue prop to InvoicePage */}
            <InvoicePage searchQuery={searchValue} />
          </div>
        </div>
      </div>
    </>
  );
}
