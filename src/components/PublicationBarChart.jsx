// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const PublicationsBarChart = () => {
//   // Calculate totals for Indexed, Non-Indexed, and Others Publications
//   const totalIndexed = scholarData.reduce(
//     (sum, entry) => sum + (entry["INDEXED PUBLICATION"] || 0),
//     0
//   );
//   const totalNonIndexed = scholarData.reduce(
//     (sum, entry) => sum + (entry["NON-INDEXED PUBLICATION"] || 0),
//     0
//   );
//   const totalOthers = scholarData.reduce(
//     (sum, entry) => sum + (entry["OTHERS PUBLICATION"] || 0),
//     0
//   );

//   // Prepare data for the bar chart
//   const data = [
//     { type: "Indexed Publications", count: totalIndexed },
//     { type: "Non-Indexed Publications", count: totalNonIndexed },
//     { type: "Others Publications", count: totalOthers },
//   ];

//   return (
//     <div style={{ height: "100%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Publications Overview</h2>
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
//           legend: "Publication Type",
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
//         ariaLabel="Bar chart of publications"
//       />
//     </div>
//   );
// };

// export default PublicationsBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const PublicationsBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicationsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/publications");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();
        // Map API response to chart data format
        const chartData = [
          { type: "Indexed Publications", count: jsonData.indexedPublications },
          {
            type: "Non-Indexed Publications",
            count: jsonData.nonIndexedPublications,
          },
          { type: "Others Publications", count: jsonData.otherPublications },
        ];
        setData(chartData);
      } catch (err) {
        console.error("Error fetching publications data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicationsData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "500px", width: "700px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Publications Overview</h2>
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
          legend: "Publication Type",
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
        ariaLabel="Bar chart of publications"
      />
    </div>
  );
};

export default PublicationsBarChart;
