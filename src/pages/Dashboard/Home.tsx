import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import RecentTransactions from "../../components/ecommerce/RecentTransactions";
import TicketTable from "../../components/ecommerce/TicketTable";
import EcommerceMetricsv2 from "../../components/ecommerce/EcommerceMetricsv2";
// import MonthlySalesChartv2 from "../../components/ecommerce/MonthlySalesChartv2";

export default function Home() {
  // Lấy userRole từ localStorage
  const userRole = localStorage.getItem("userRole");

  return (
    <>
      <PageMeta title="Home" description="" />
      {userRole === "ADMIN" ? (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <EcommerceMetrics />
            <MonthlySalesChart />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <MonthlyTarget />
          </div>

          <div className="col-span-12 xl:col-span-12">
            <RecentTransactions />
          </div>
        </div>
      ) : userRole === "STAFF" ? (
        <div className="p-4 max-w-full overflow-x-auto">
          <TicketTable />
          <div className="p-4 col-span-12 space-y-6 xl:col-span-7">
            <EcommerceMetricsv2 />
          </div>
        </div>
      ) : (
        <div className="text-center">You do not have the required role to view this page.</div>
      )}
    </>
  );
}
