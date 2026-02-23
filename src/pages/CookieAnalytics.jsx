import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Label,
  Select,
  Button,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Pagination,
  Badge,
} from "@windmill/react-ui";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PageTitle from "../components/Typography/PageTitle";
import CookieConsentServices from "../services/CookieConsentServices";
import { notifySuccess, notifyError } from "../utils/toast";
import dayjs from "dayjs";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CookieAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [consentType, setConsentType] = useState("all");
  const [device, setDevice] = useState("all");
  const [country, setCountry] = useState("all");
  const [search, setSearch] = useState("");

  // Data states
  const [consents, setConsents] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalDoc, setTotalDoc] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const response = await CookieConsentServices.getCookieConsentStats({
        startDate,
        endDate,
      });
      setStats(response);
    } catch (error) {
      notifyError(error?.response?.data?.message || error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch consents list
  const fetchConsents = async () => {
    try {
      setLoading(true);
      const response = await CookieConsentServices.getAllCookieConsents({
        page,
        limit,
        consentType,
        device,
        country,
        startDate,
        endDate,
        search,
      });
      setConsents(response.consents);
      setTotalDoc(response.totalDoc);
      setTotalPages(response.totalPages);
    } catch (error) {
      notifyError(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Export data
  const handleExport = async () => {
    try {
      const response = await CookieConsentServices.exportCookieConsents({
        startDate,
        endDate,
        consentType,
      });

      // Convert to CSV
      const csvContent = convertToCSV(response.data);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cookie-consents-${dayjs().format("YYYY-MM-DD")}.csv`;
      a.click();

      notifySuccess("Data exported successfully!");
    } catch (error) {
      notifyError(error?.response?.data?.message || error.message);
    }
  };

  // Convert data to CSV
  const convertToCSV = (data) => {
    const headers = [
      "Date",
      "Consent Type",
      "Device",
      "Browser",
      "OS",
      "Country",
      "IP Address",
      "Session ID",
    ];
    const rows = data.map((item) => [
      dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      item.consentType,
      item.device,
      item.browser,
      item.os,
      item.country || "N/A",
      item.ipAddress || "N/A",
      item.sessionId,
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPage(1);
    fetchStatistics();
    fetchConsents();
  };

  // Reset filters
  const handleResetFilters = () => {
    setStartDate(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
    setEndDate(dayjs().format("YYYY-MM-DD"));
    setConsentType("all");
    setDevice("all");
    setCountry("all");
    setSearch("");
    setPage(1);
  };

  useEffect(() => {
    fetchStatistics();
    fetchConsents();
  }, [page]);

  // Prepare chart data
  const getConsentTypeChartData = () => {
    if (!stats) return null;

    return {
      labels: ["Accepted", "Rejected", "Customized"],
      datasets: [
        {
          label: "Consent Responses",
          data: [
            stats.consentTypeStats.accepted || 0,
            stats.consentTypeStats.rejected || 0,
            stats.consentTypeStats.customized || 0,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(59, 130, 246, 0.8)",
          ],
        },
      ],
    };
  };

  const getDeviceChartData = () => {
    if (!stats) return null;

    return {
      labels: ["Desktop", "Mobile", "Tablet"],
      datasets: [
        {
          label: "Device Distribution",
          data: [
            stats.deviceStats.desktop || 0,
            stats.deviceStats.mobile || 0,
            stats.deviceStats.tablet || 0,
          ],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
        },
      ],
    };
  };

  const getTrendChartData = () => {
    if (!stats || !stats.trendStats) return null;

    const dates = [...new Set(stats.trendStats.map((item) => item._id.date))];
    const acceptedData = dates.map((date) => {
      const found = stats.trendStats.find(
        (item) => item._id.date === date && item._id.consentType === "accepted"
      );
      return found ? found.count : 0;
    });
    const rejectedData = dates.map((date) => {
      const found = stats.trendStats.find(
        (item) => item._id.date === date && item._id.consentType === "rejected"
      );
      return found ? found.count : 0;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: "Accepted",
          data: acceptedData,
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          tension: 0.4,
        },
        {
          label: "Rejected",
          data: rejectedData,
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          tension: 0.4,
        },
      ],
    };
  };

  const getCountryChartData = () => {
    if (!stats || !stats.countryStats) return null;

    return {
      labels: stats.countryStats.map((item) => item._id || "Unknown"),
      datasets: [
        {
          label: "Responses by Country",
          data: stats.countryStats.map((item) => item.count),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
        },
      ],
    };
  };

  const getConsentBadge = (type) => {
    switch (type) {
      case "accepted":
        return <Badge type="success">Accepted</Badge>;
      case "rejected":
        return <Badge type="danger">Rejected</Badge>;
      case "customized":
        return <Badge type="primary">Customized</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <>
      <PageTitle>Cookie Consent Analytics</PageTitle>

      {/* Filters Section */}
      <Card className="mb-8">
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <Label>
                <span>Start Date</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </Label>
            </div>
            <div>
              <Label>
                <span>End Date</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </Label>
            </div>
            <div>
              <Label>
                <span>Consent Type</span>
                <Select
                  value={consentType}
                  onChange={(e) => setConsentType(e.target.value)}
                  className="mt-1"
                >
                  <option value="all">All Types</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="customized">Customized</option>
                </Select>
              </Label>
            </div>
            <div>
              <Label>
                <span>Device</span>
                <Select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  className="mt-1"
                >
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </Select>
              </Label>
            </div>
            <div>
              <Label>
                <span>Search</span>
                <Input
                  type="text"
                  placeholder="Session ID or IP"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-1"
                />
              </Label>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleApplyFilters} className="w-full">
                Apply
              </Button>
              <Button
                onClick={handleResetFilters}
                layout="outline"
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="text-center py-8">Loading statistics...</div>
      ) : (
        stats && (
          <>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardBody className="flex items-center">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Responses
                    </p>
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                      {stats.totalConsents}
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="flex items-center">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Acceptance Rate
                    </p>
                    <p className="text-2xl font-semibold text-green-600">
                      {stats.totalConsents > 0
                        ? (
                            ((stats.consentTypeStats.accepted || 0) /
                              stats.totalConsents) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="flex items-center">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Rejection Rate
                    </p>
                    <p className="text-2xl font-semibold text-red-600">
                      {stats.totalConsents > 0
                        ? (
                            ((stats.consentTypeStats.rejected || 0) /
                              stats.totalConsents) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="flex items-center">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Analytics Opt-in
                    </p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {stats.preferencesStats.analyticsAccepted || 0}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <Card>
                <CardBody>
                  <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Consent Type Distribution
                  </h2>
                  {getConsentTypeChartData() && (
                    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                      <Pie data={getConsentTypeChartData()} />
                    </div>
                  )}
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Device Distribution
                  </h2>
                  {getDeviceChartData() && (
                    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                      <Pie data={getDeviceChartData()} />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <Card className="mb-8">
              <CardBody>
                <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Consent Trend Over Time
                </h2>
                {getTrendChartData() && (
                  <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Line
                      data={getTrendChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </CardBody>
            </Card>

            <Card className="mb-8">
              <CardBody>
                <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Top Countries
                </h2>
                {getCountryChartData() && (
                  <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Bar
                      data={getCountryChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        )
      )}

      {/* Consents Table */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Recent Consent Responses ({totalDoc})
            </h2>
            <Button onClick={handleExport} size="small">
              Export CSV
            </Button>
          </div>
          <TableContainer className="mb-4">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Browser</TableCell>
                  <TableCell>OS</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Session ID</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : consents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center">
                      No consent data found
                    </TableCell>
                  </TableRow>
                ) : (
                  consents.map((consent) => (
                    <TableRow key={consent._id}>
                      <TableCell>
                        <span className="text-sm">
                          {dayjs(consent.createdAt).format(
                            "MMM DD, YYYY HH:mm"
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getConsentBadge(consent.consentType)}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{consent.device}</span>
                      </TableCell>
                      <TableCell>{consent.browser}</TableCell>
                      <TableCell>{consent.os}</TableCell>
                      <TableCell>{consent.country || "N/A"}</TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">
                          {consent.sessionId.substring(0, 12)}...
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter>
            <Pagination
              totalResults={totalDoc}
              resultsPerPage={limit}
              onChange={(p) => setPage(p)}
              label="Table navigation"
            />
          </TableFooter>
        </CardBody>
      </Card>
    </>
  );
};

export default CookieAnalytics;
