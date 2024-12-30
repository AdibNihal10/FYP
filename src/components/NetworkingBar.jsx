import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const NetworkingBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/moumoa");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Aggregate data by Type
        const typeCounts = jsonData.reduce((acc, item) => {
          acc[item.Type] = (acc[item.Type] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(typeCounts).map((type, index) => ({
          type,
          count: typeCounts[type],
          color: `hsl(${(index * 90) % 360}, 70%, 80%)`, // Generate light colors
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error fetching networking data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: 500, width: 700, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Count of Agreements by Type</h2>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="type"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={(d) => d.data.color} // Assign unique colors to each bar
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
          legend: "Type",
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
        tooltip={(d) => (
          <strong style={{ color: d.data.color }}>
            {d.indexValue}: {d.value}
          </strong>
        )}
      />
    </div>
  );
};

export default NetworkingBarChart;
