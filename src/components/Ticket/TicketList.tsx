import { useState, useEffect } from "react";
import { Container, Paper, Tabs, Tab, Stack, CircularProgress, Select, MenuItem, FormControl, InputLabel, Typography, Badge } from "@mui/material";
import CheckinTab from "./TikTab/CheckinTab.tsx";
import UpComingTab from "./TikTab/UpComingTab.tsx";
import OverdueTab from "./TikTab/OverdueTab";
import CheckoutTab from "./TikTab/CheckoutTab";
import { useFetchData } from "../../hooks/useFetchData";
import { useTicketGroups } from "../../hooks/useTicketGroups.ts";
import OnServiceTab from "./TikTab/OnService.tsx";
import { fetchWithAuth } from "../../api/fetchWithAuth.ts";
import ExtendTab from "./TikTab/ExtendTab";
import ChangeTimeTab from "./TikTab/ChangeTimeTab.tsx";

interface Location {
  id: string;
  name: string;
}

function TicketList() {
  const [tab, setTab] = useState(0);

  const [locationId, setLocationId] = useState<string>("");

  const [allTickets, setAllTickets] = useState<any[]>([]);

  const [checkinRefreshKey, setCheckinRefreshKey] = useState(0);
  const [checkoutRefreshKey, setCheckoutRefreshKey] = useState(0);
  const [verifyRefreshKey, setVerifyRefreshKey] = useState(0);
  const [verifyRequiredTickets, setVerifyRequiredTickets] = useState<any[]>([]);
  const [changeTimeTickets, setChangeTimeTickets] = useState<any[]>([]);
  const [changeTimeRefreshKey, setChangeTimeRefreshKey] = useState(0);

  const {
    data: locations,
    loading: locationsLoading,
    error: locationsError,
  } = useFetchData<Location>({
    url: `/app-data-service/locations/nearby?longitude=105.779303&latitude=21.028759&maxDistance=100&page=0&size=100`,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      if (locationId) {
        try {
          const page0 = fetchWithAuth(`/app-data-service/tickets/pageable/find?locationId=${locationId}&page=0&size=100`);
          const page1 = fetchWithAuth(`/app-data-service/tickets/pageable/find?locationId=${locationId}&page=1&size=100`);

          const [resPage0, resPage1] = await Promise.all([page0, page1]);

          const allTickets = [...resPage0.content, ...resPage1.content];
          setAllTickets(allTickets);
        } catch (err) {
          console.error("Error fetching tickets:", err);
        }
      }
    };

    fetchTickets();
  }, [locationId]);

  const tickets = allTickets.map((item) => item.ticket);

  const { data: checkoutTickets = [] } = useFetchData<any>({
    url: `/app-data-service/tickets/checkout-requests?page=0&size=100`,
    filterFn: (list) => list.filter((t: any) => (t.slot?.locationId === locationId || t.ticket?.locationId === locationId) && t.ticket?.isCheckOut === true),
    trigger: `${locationId}-${checkoutRefreshKey}`,
  });

  const { data: CheckinTickets = [] } = useFetchData<any>({
    url: `/app-data-service/tickets/checkin-requests?page=0&size=100`,
    filterFn: (list) => list.filter((t: any) => (t.slot?.locationId === locationId || t.ticket?.locationId === locationId) && t.ticket?.isCheckIn === true),
    trigger: `${locationId}-${checkinRefreshKey}`,
  });

  useEffect(() => {
    const fetchVerifyRequired = async () => {
      if (locationId) {
        try {
          const res = await fetchWithAuth(`/app-data-service/tickets/verify-required?locationId=${locationId}&page=0&size=100`);
          const filtered = (res.content || []).filter((item: any) => item.parent?.ticket?.locationId === locationId);
          setVerifyRequiredTickets(filtered);
        } catch (err) {
          console.error("Error fetching verify-required tickets:", err);
        }
      }
    };

    fetchVerifyRequired();
  }, [locationId, verifyRefreshKey]);

  useEffect(() => {
    const fetchChangeTimeTickets = async () => {
      if (locationId) {
        try {
          const res = await fetchWithAuth(`/app-data-service/tickets/verify-required-change-time?page=0&size=100&sort=startDateTime,desc`);
          const filtered = (res.content || []).filter((item: any) => item.ticket.locationId === locationId);
          setChangeTimeTickets(filtered);
        } catch (err) {
          console.error("Error fetching change-time tickets:", err);
        }
      }
    };

    fetchChangeTimeTickets();
  }, [locationId, changeTimeRefreshKey]);

  const { upComing, overdue, onService } = useTicketGroups(tickets);

  const isLoading = locationsLoading || !allTickets.length;

  const tabs = [
    {
      label: "Up Coming",
      component: <UpComingTab tickets={upComing} locationId={locationId} />,
      count: upComing.length,
    },
    {
      label: "Check in",
      component: (
        <CheckinTab
          tickets={CheckinTickets}
          onRefresh={() => {
            console.log("==> onRefresh Checkin");
            setCheckinRefreshKey((prev) => prev + 1);
          }}
        />
      ),
      count: CheckinTickets.length,
    },
    {
      label: "On Service",
      component: <OnServiceTab tickets={onService} locationId={locationId} />,
      count: onService.length,
    },
    {
      label: "Extend",
      component: <ExtendTab tickets={verifyRequiredTickets} onReassignSuccess={() => setVerifyRefreshKey((prev) => prev + 1)} />,
      count: verifyRequiredTickets.length,
    },
    {
      label: "Change Time",
      component: <ChangeTimeTab tickets={changeTimeTickets} locationId={locationId} isLoading={isLoading} onReassignSuccess={() => setChangeTimeRefreshKey((prev) => prev + 1)} />,
      count: changeTimeTickets.length,
    },
    {
      label: "Overdue",
      component: <OverdueTab tickets={overdue} locationId={locationId} />,
      count: overdue.length,
    },
    {
      label: "Check out",
      component: (
        <CheckoutTab
          tickets={checkoutTickets}
          onRefresh={() => {
            console.log("==> onRefresh Checkout");
            setCheckoutRefreshKey((prev) => prev + 1);
          }}
        />
      ),
      count: checkoutTickets.length,
    },
  ];

  if (locationsError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Lỗi: {locationsError}
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            {locationsLoading ? (
              <Stack alignItems="center" sx={{ py: 5 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <Select value={locationId} onChange={(e) => setLocationId(e.target.value)} label="Location">
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>

          {!isLoading && locationId && (
            <>
              <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} aria-label="Ticket tabs" variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary">
                {tabs.map((tabItem, idx) => (
                  <Tab
                    key={idx}
                    label={
                      <Badge color="error" badgeContent={tabItem.count} max={99}>
                        {tabItem.label}
                      </Badge>
                    }
                  />
                ))}
              </Tabs>

              {tabs[tab]?.component}
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default TicketList;
