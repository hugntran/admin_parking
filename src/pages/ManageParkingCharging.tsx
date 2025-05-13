import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import FloatingAddButton from "../components/SomeButton/FloatingAddButton";
import ParkingChargingDashboard from "../components/Station/ParkingChargingDashboard";

import { Box, Stack, Fade } from "@mui/material";

export default function ManageParkingCharging() {
  return (
    <>
      <PageMeta title="Parking & Charging station" description="" />
      <PageBreadcrumb pageTitle="Parking & Charging station" />

      <Box className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 lg:p-6">
        <Stack spacing={3}>
          {/* Thanh tìm kiếm và lọc */}
          <Box className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <Stack direction={{ xs: "column", md: "row" }} flexWrap="wrap" justifyContent="space-between" alignItems="center" spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}></Stack>
              <FloatingAddButton to="/add-facility-form" />
            </Stack>
          </Box>

          {/* Nội dung chính có hiệu ứng Fade */}
          <Fade in timeout={400}>
            <Box className="rounded-lg shadow-md bg-gray-50">
              <ParkingChargingDashboard />
            </Box>
          </Fade>
        </Stack>
      </Box>
    </>
  );
}
