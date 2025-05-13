import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CustomerManagementList from "../components/Lamb/CustomerManagementList";
import SearchBar from "../components/ContentTop/SearchBar";

export default function CustomerManagement() {
  const [searchText, setSearchText] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [roles, setRoles] = useState<string[]>([]); // Store roles options

  // Fetch available roles for the dropdown
  useEffect(() => {
    // Mock roles
    setRoles(["ADMIN", "STAFF", "USER"]);
  }, []);

  return (
    <>
      <PageMeta title="Customer" description="" />
      <PageBreadcrumb pageTitle="Customer" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 lg:p-6">
        <div className="flex flex-col gap-6">
          {/* Top filter bar */}
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4 bg-gray-50 p-3 rounded-lg shadow-sm">
            <SearchBar value={searchText} onChange={setSearchText} placeholder="🔍 Search by user name or id" />

            {/* Role filter dropdown */}
            <div className="flex items-center">
              <label htmlFor="roleFilter" className="mr-2">
                Role:
              </label>
              <select id="roleFilter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-2 border rounded-lg">
                <option value="">All Roles</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter dropdown */}
            <div className="flex items-center">
              <label htmlFor="statusFilter" className="mr-2">
                Status:
              </label>
              <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg">
                <option value="">All Status</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Main content */}
          <div className="rounded-lg shadow-md bg-gray-50">
            <CustomerManagementList searchText={searchText} roleFilter={roleFilter} statusFilter={statusFilter} />
          </div>
        </div>
      </div>
    </>
  );
}
