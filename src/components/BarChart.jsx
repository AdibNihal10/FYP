// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const BarChart = () => {
//   // Calculate totals for National Grants and Industry Grants
//   const totalNationalGrants = scholarData.reduce(
//     (sum, entry) => sum + (entry["NATIONAL GRANTS"] || 0),
//     0
//   );
//   const totalInterNationalGrants = scholarData.reduce(
//     (sum, entry) => sum + (entry["INTERNATIONAL GRANTS"] || 0),
//     0
//   );
//   const totalIndustryGrants = scholarData.reduce(
//     (sum, entry) => sum + (entry["INDUSTRY GRANTS"] || 0),
//     0
//   );

//   // Prepare data for the bar chart
//   const data = [
//     { type: "National Grants", count: totalNationalGrants },
//     { type: "Industry Grants", count: totalIndustryGrants },
//     { type: "International Grants", count: totalInterNationalGrants },
//   ];

//   return (
//     <div style={{ height: "100%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Grants Overview</h2>
//       <ResponsiveBar
//         data={data}
//         keys={["count"]}
//         indexBy="type"
//         margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//         padding={0.3}
//         colors={{ scheme: "set2" }}
//         borderColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Grant Type",
//           legendPosition: "middle",
//           legendOffset: 32,
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Count",
//           legendPosition: "middle",
//           legendOffset: -40,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         role="application"
//         ariaLabel="Bar chart of grants"
//       />
//     </div>
//   );
// };

// export default BarChart;
import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = () => {
  const [data, setData] = useState([]);
  const [researchGroups, setResearchGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch research groups on component mount
  useEffect(() => {
    const fetchResearchGroups = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/research-groups"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const groups = await response.json();
        setResearchGroups(groups);
      } catch (err) {
        console.error("Error fetching research groups:", err);
        setError("Failed to load research groups.");
      }
    };

    fetchResearchGroups();
  }, []);

  // Fetch grants data based on selected research group
  useEffect(() => {
    const fetchGrantsData = async () => {
      try {
        setLoading(true);
        const url = selectedGroup
          ? `http://localhost:5000/api/grants?researchGroup=${encodeURIComponent(
              selectedGroup
            )}`
          : "http://localhost:5000/api/grants";

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        const chartData = [
          { type: "National Grants", count: jsonData.nationalGrants || 0 },
          {
            type: "International Grants",
            count: jsonData.internationalGrants || 0,
          },
          { type: "Industry Grants", count: jsonData.industryGrants || 0 },
        ];
        setData(chartData);
      } catch (err) {
        console.error("Error fetching grants data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsData();
  }, [selectedGroup]);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "600px", width: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Grants Overview</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="researchGroup">Filter by Research Group: </label>
        <select
          id="researchGroup"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">All Research Groups</option>
          {researchGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="type"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "set2" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Grant Type",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        role="application"
        ariaLabel="Bar chart of grants"
      />
    </div>
  );
};

export default BarChart;
