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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScopusData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/scopusData");
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
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "400px", width: "800px", margin: "auto" }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0} // Full pie chart
        padAngle={1} // Spacing between slices
        cornerRadius={3}
        colors={{ scheme: "set2" }} // Bright color scheme
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
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
              color: "white",
              background: datum.color,
              borderRadius: "3px",
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
      />
    </div>
  );
};

export default HIndexCitationsPublicationsPieChart;
