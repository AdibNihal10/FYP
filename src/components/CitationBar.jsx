// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const HIndexCitationsBarChart = () => {
//   // Calculate totals for H-index and Citations
//   const totalHIndex = scholarData.reduce(
//     (sum, entry) => sum + (entry["H-INDEXED (SCOPUS)"] || 0),
//     0
//   );
//   const totalCitations = scholarData.reduce(
//     (sum, entry) => sum + (entry["CITATIONS (SCOPUS)"] || 0),
//     0
//   );

//   // Prepare data for the bar chart
//   const data = [
//     { type: "H-Index", count: totalHIndex },
//     { type: "Citations", count: totalCitations },
//   ];

//   return (
//     <div style={{ height: "80%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>H-Index and Citations Overview</h2>
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
//           legend: "Metric Type",
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
//         ariaLabel="Bar chart of H-index and citations"
//       />
//     </div>
//   );
// };

// export default HIndexCitationsBarChart;

// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const StackedBarChart = () => {
//   // Prepare the data for the stacked bar chart
//   const data = scholarData.map((scholar, index) => ({
//     scholar: index + 1, // Use scholar number (1 to 100)
//     hIndex: scholar["H-INDEXED (SCOPUS)"] || 0,
//     citations: scholar["CITATIONS (SCOPUS)"] || 0,
//     publications: scholar["PUBLICATIONS"] || 0,
//   }));

//   return (
//     <div style={{ height: "90%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>
//         Metrics Comparison Across Scholars
//       </h2>
//       <ResponsiveBar
//         data={data}
//         keys={["hIndex", "citations", "publications"]} // Metrics to stack
//         indexBy="scholar" // Use scholar numbers as x-axis
//         margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//         padding={0.3}
//         groupMode="stacked" // Enables stacked bars
//         colors={{ scheme: "set2" }} // Bright color scheme
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
//           legend: "Scholars (1-100)",
//           legendPosition: "middle",
//           legendOffset: 32,
//           tickValues: Array.from({ length: 20 }, (_, i) => i * 5 + 1), // Gap of 5
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Metrics",
//           legendPosition: "middle",
//           legendOffset: -40,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         tooltip={({ id, value }) => (
//           <div
//             style={{
//               padding: "5px 10px",
//               color: "white",
//               background: "#333",
//               borderRadius: "3px",
//             }}
//           >
//             <strong>{id}</strong>: {value}
//           </div>
//         )}
//         legends={[
//           {
//             dataFrom: "keys",
//             anchor: "bottom-right",
//             direction: "column",
//             justify: false,
//             translateX: 120,
//             translateY: 0,
//             itemsSpacing: 2,
//             itemWidth: 100,
//             itemHeight: 20,
//             itemDirection: "left-to-right",
//             itemOpacity: 0.85,
//             symbolSize: 20,
//             effects: [
//               {
//                 on: "hover",
//                 style: {
//                   itemOpacity: 1,
//                 },
//               },
//             ],
//           },
//         ]}
//         role="application"
//         ariaLabel="Stacked bar chart for scholar metrics"
//       />
//     </div>
//   );
// };

// export default StackedBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const StackedBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScopusData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/scopusData");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Prepare data for the bar chart
        const chartData = [
          {
            metric: "H-Index",
            count: jsonData.hIndexedScopus,
            color: "#1f77b4",
          },
          {
            metric: "Citations",
            count: jsonData.citationsScopus,
            color: "#ff7f0e",
          },
          {
            metric: "Publications",
            count: jsonData.publications,
            color: "#2ca02c",
          },
        ];

        setData(chartData);
      } catch (err) {
        console.error("Error fetching Scopus data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchScopusData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <div style={{ height: "500px", width: "80%", margin: "auto" }}>
        <h2>Metrics Overview</h2>
        <ResponsiveBar
          data={data}
          keys={["count"]}
          indexBy="metric"
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          colors={({ data }) => data.color}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          // axisBottom={{
          //   tickSize: 5,
          //   tickPadding: 5,
          //   tickRotation: 0,
          //   legend: "Metric Type",
          //   legendPosition: "middle",
          //   legendOffset: 40,
          // }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Count",
            legendPosition: "middle",
            legendOffset: -40,
            tickValues: [0, 10000, 20000, 30000, 40000, 50000, 60000],
          }}
          label={({ value }) => value}
          labelSkipWidth={16}
          labelSkipHeight={16}
          labelTextColor="black"
          tooltip={({ id, value, color }) => (
            <div
              style={{
                padding: "5px 10px",
                color: "white",
                background: color,
                borderRadius: "3px",
              }}
            >
              <strong>{id}</strong>: {value}
            </div>
          )}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 10,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
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
          role="application"
          ariaLabel="Bar chart showing metrics overview"
        />
      </div>
      {/* Add the summary below the chart */}
      <div
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <p>
          <strong>H-Index (Scopus)</strong>:{" "}
          {data.find((d) => d.metric === "H-Index")?.count || 0}
        </p>
        <p>
          <strong>Publications</strong>:{" "}
          {data.find((d) => d.metric === "Publications")?.count || 0}
        </p>
        <p>
          <strong>Citations (Scopus)</strong>:{" "}
          {data.find((d) => d.metric === "Citations")?.count || 0}
        </p>
      </div>
    </div>
  );
};

export default StackedBarChart;
