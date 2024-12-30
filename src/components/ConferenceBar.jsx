import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const ConferenceBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferencesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/conferences");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Count occurrences of each year
        const yearWiseData = jsonData.reduce((acc, conference) => {
          if (!acc[conference.Year]) {
            acc[conference.Year] = 0;
          }
          acc[conference.Year] += 1;
          return acc;
        }, {});

        // Format data for the bar chart
        const chartData = Object.keys(yearWiseData).map((year, index) => ({
          year: year,
          count: yearWiseData[year],
          color: `hsl(${(index * 90) % 360}, 70%, 50%)`, // Generate unique colors
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error fetching conferences data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferencesData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "500px", width: "700px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Conferences Count by Year</h2>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="year"
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
          legend: "Year",
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
        ariaLabel="Bar chart of conference counts by year"
        tooltip={(d) => (
          <strong style={{ color: d.data.color }}>
            {d.indexValue}: {d.value}
          </strong>
        )}
      />
    </div>
  );
};

export default ConferenceBarChart;
