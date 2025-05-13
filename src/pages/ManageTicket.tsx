import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import TicketList from "../components/Ticket/TicketList";
import { Box, Stack } from "@mui/material";

export default function ManageTicket() {
  return (
    <>
      <PageMeta title="Ticket management" description="" />
      <PageBreadcrumb pageTitle="Ticket management" />

      <Box className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 lg:p-6">
        <Stack spacing={3}>
          {/* Filter/Search top bar */}
          <Box className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <Stack direction={{ xs: "column", md: "row" }} flexWrap="wrap" justifyContent="space-between" alignItems="center" spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}></Stack>
            </Stack>
          </Box>

          {/* Nội dung chính */}
          <Box className="rounded-lg shadow-md bg-gray-50">
            <TicketList />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
