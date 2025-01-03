// import { ResponsivePie } from "@nivo/pie";
// import scholarData from "../data/scraped_scholar_data.json";

// const HIndexCitationsPublicationsPieChart = () => {
//   // Prepare the data for the pie chart
//   const data = [
//     {
//       id: "H-Index",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["H-INDEXED (SCOPUS)"] || 0),
//         0
//       ),
//     },
//     {
//       id: "Citations",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["CITATIONS (SCOPUS)"] || 0),
//         0
//       ),
//     },
//     {
//       id: "Publications",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["PUBLICATIONS"] || 0),
//         0
//       ),
//     },
//   ];

//   // Calculate the total for percentage calculation
//   const total = data.reduce((sum, entry) => sum + entry.value, 0);

//   // Add percentage labels
//   const dataWithPercentage = data.map((item) => ({
//     ...item,
//     label: `${((item.value / total) * 100).toFixed(1)}%`,
//   }));

//   return (
//     <div style={{ height: "400px", width: "800px", margin: "auto" }}>
//       <ResponsivePie
//         data={dataWithPercentage}
//         margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//         innerRadius={0} // Full pie chart
//         padAngle={1} // Spacing between slices
//         cornerRadius={3}
//         colors={{ scheme: "set2" }} // Bright color scheme
//         borderWidth={1}
//         borderColor={{
//           from: "color",
//           modifiers: [["darker", 0.2]],
//         }}
//         arcLinkLabelsSkipAngle={10}
//         arcLinkLabelsTextColor="#333333"
//         arcLinkLabelsThickness={2}
//         arcLinkLabelsColor={{ from: "color" }}
//         arcLabelsSkipAngle={10}
//         arcLabelsTextColor={{
//           from: "color",
//           modifiers: [["darker", 2]],
//         }}
//         tooltip={({ datum }) => (
//           <div
//             style={{
//               padding: "5px 10px",
//               color: "white",
//               background: datum.color,
//               borderRadius: "3px",
//             }}
//           >
//             <strong>{datum.id}</strong>: {datum.value} ({datum.label})
//           </div>
//         )}
//         legends={[
//           {
//             anchor: "bottom",
//             direction: "row",
//             justify: false,
//             translateX: 0,
//             translateY: 56,
//             itemsSpacing: 0,
//             itemWidth: 100,
//             itemHeight: 18,
//             itemTextColor: "#999",
//             itemDirection: "left-to-right",
//             symbolSize: 18,
//             symbolShape: "circle",
//             effects: [
//               {
//                 on: "hover",
//                 style: {
//                   itemTextColor: "#000",
//                 },
//               },
//             ],
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default HIndexCitationsPublicationsPieChart;

import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";

const HIndexCitationsPublicationsPieChart = () => {
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

  // Fetch Scopus data based on selected research group
  useEffect(() => {
    const fetchScopusData = async () => {
      try {
        setLoading(true);
        const url = selectedGroup
          ? `http://localhost:5000/api/scopusData?researchGroup=${encodeURIComponent(
              selectedGroup
            )}`
          : "http://localhost:5000/api/scopusData";

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Prepare the data for the pie chart
        const chartData = [
          { id: "H-Index", value: jsonData.hIndexedScopus },
          { id: "Citations", value: jsonData.citationsScopus },
          { id: "Publications", value: jsonData.publications },
        ];

        // Calculate total for percentage labels
        const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

        // Add percentage labels
        const dataWithPercentage = chartData.map((item) => ({
          ...item,
          label: `${((item.value / total) * 100).toFixed(1)}%`,
        }));

        setData(dataWithPercentage);
      } catch (err) {
        console.error("Error fetching Scopus data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchScopusData();
  }, [selectedGroup]);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        height: "500px",
        width: "700px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        H-Index, Citations, and Publications Overview
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="researchGroup" style={{ marginRight: "10px" }}>
          Filter by Research Group:
        </label>
        <select
          id="researchGroup"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">All Research Groups</option>
          {researchGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.6} // Doughnut-style chart
        padAngle={1} // Spacing between slices
        cornerRadius={5} // Rounded corners for slices
        colors={{ scheme: "category10" }} // Improved color scheme
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.6]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        tooltip={({ datum }) => (
          <div
            style={{
              padding: "5px 10px",
              color: "#fff",
              background: datum.color,
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            <strong>{datum.id}</strong>: {datum.value} ({datum.label})
          </div>
        )}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 120,
            itemHeight: 18,
            itemTextColor: "#333",
            itemDirection: "left-to-right",
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default HIndexCitationsPublicationsPieChart;
