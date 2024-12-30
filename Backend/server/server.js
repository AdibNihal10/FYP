// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const Scholar = require("../Model/scholarsModel");

// const app = express();
// const PORT = 5000;
// const cors = require("cors");
// app.use(cors());
// mongoose.connect("mongodb://127.0.0.1:27017/utm_scholars", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.get("/api/grants", async (req, res) => {
//   try {
//     // Debug: Log raw data before the aggregation
//     const rawData = await Scholar.find(
//       {},
//       { NATIONAL_GRANTS: 1, INTERNATIONAL_GRANTS: 1, INDUSTRY_GRANTS: 1 }
//     ).lean();
//     console.log("Raw data:", rawData);

//     const grantsData = await Scholar.aggregate([
//       {
//         $addFields: {
//           NATIONAL_GRANTS_INT: { $toInt: "$NATIONAL_GRANTS" },
//           INTERNATIONAL_GRANTS_INT: { $toInt: "$INTERNATIONAL_GRANTS" },
//           INDUSTRY_GRANTS_INT: { $toInt: "$INDUSTRY_GRANTS" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalNationalGrants: { $sum: "$NATIONAL_GRANTS_INT" },
//           totalInternationalGrants: { $sum: "$INTERNATIONAL_GRANTS_INT" },
//           totalIndustryGrants: { $sum: "$INDUSTRY_GRANTS_INT" },
//         },
//       },
//     ]);

//     console.log("Aggregated data:", grantsData);

//     const {
//       totalNationalGrants,
//       totalInternationalGrants,
//       totalIndustryGrants,
//     } = grantsData[0] || {
//       totalNationalGrants: 0,
//       totalInternationalGrants: 0,
//       totalIndustryGrants: 0,
//     };

//     res.json({
//       nationalGrants: totalNationalGrants,
//       internationalGrants: totalInternationalGrants,
//       industryGrants: totalIndustryGrants,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching grants data");
//   }
// });

// app.get("/api/publications", async (req, res) => {
//   try {
//     // Debug: Log raw data before the aggregation
//     const rawData = await Scholar.find(
//       {},
//       {
//         INDEXED_PUBLICATION: 1,
//         NON_INDEXED_PUBLICATION: 1,
//         OTHERS_PUBLICATION: 1,
//       }
//     ).lean();
//     console.log("Raw data:", rawData);

//     // Aggregate indexed, non-indexed, and other publications
//     const publicationData = await Scholar.aggregate([
//       {
//         $addFields: {
//           INDEXED_PUBLICATION_INT: { $toInt: "$INDEXED_PUBLICATION" },
//           NON_INDEXED_PUBLICATION_INT: { $toInt: "$NON_INDEXED_PUBLICATION" },
//           OTHERS_PUBLICATION_INT: { $toInt: "$OTHERS_PUBLICATION" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalIndexedPublications: { $sum: "$INDEXED_PUBLICATION_INT" },
//           totalNonIndexedPublications: { $sum: "$NON_INDEXED_PUBLICATION_INT" },
//           totalOtherPublications: { $sum: "$OTHERS_PUBLICATION_INT" },
//         },
//       },
//     ]);

//     console.log("Aggregated data:", publicationData);

//     const {
//       totalIndexedPublications,
//       totalNonIndexedPublications,
//       totalOtherPublications,
//     } = publicationData[0] || {
//       totalIndexedPublications: 0,
//       totalNonIndexedPublications: 0,
//       totalOtherPublications: 0,
//     };

//     res.json({
//       indexedPublications: totalIndexedPublications,
//       nonIndexedPublications: totalNonIndexedPublications,
//       otherPublications: totalOtherPublications,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching publication data");
//   }
// });
// app.get("/api/scopusData", async (req, res) => {
//   try {
//     // Debug: Log raw data before the aggregation
//     const rawData = await Scholar.find(
//       {},
//       { H_INDEXED_SCOPUS: 1, CITATIONS_SCOPUS: 1, PUBLICATIONS: 1 }
//     ).lean();
//     console.log("Raw data:", rawData);

//     // Aggregate H-Index Scopus, Citations Scopus, and Publications
//     const scopusData = await Scholar.aggregate([
//       {
//         $addFields: {
//           H_INDEXED_SCOPUS_INT: { $toInt: "$H_INDEXED_SCOPUS" },
//           CITATIONS_SCOPUS_INT: { $toInt: "$CITATIONS_SCOPUS" },
//           PUBLICATIONS_INT: { $toInt: "$PUBLICATIONS" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalHIndexedScopus: { $sum: "$H_INDEXED_SCOPUS_INT" },
//           totalCitationsScopus: { $sum: "$CITATIONS_SCOPUS_INT" },
//           totalPublications: { $sum: "$PUBLICATIONS_INT" },
//         },
//       },
//     ]);

//     console.log("Aggregated data:", scopusData);

//     const { totalHIndexedScopus, totalCitationsScopus, totalPublications } =
//       scopusData[0] || {
//         totalHIndexedScopus: 0,
//         totalCitationsScopus: 0,
//         totalPublications: 0,
//       };

//     res.json({
//       hIndexedScopus: totalHIndexedScopus,
//       citationsScopus: totalCitationsScopus,
//       publications: totalPublications,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching Scopus data");
//   }
// });

// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`)
// );

// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Scholar = require("../Model/scholarsModel"); // Model for utm_scholars
const TrainingProject = require("../Model/trainingModel"); // Model for training_2024
const Conference = require("../Model/conferenceModel"); // Import Conference model
const MouMoA = require("../Model/networking");
const app = express();
const PORT = 5000;
const { login } = require("../Controller/loginControl");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/utm_scholars", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB: utm_scholars"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Endpoints
app.post("/login", login);
// 1. Grants Data Endpoint
app.get("/api/grants", async (req, res) => {
  try {
    const grantsData = await Scholar.aggregate([
      {
        $addFields: {
          NATIONAL_GRANTS_INT: { $toInt: "$NATIONAL_GRANTS" },
          INTERNATIONAL_GRANTS_INT: { $toInt: "$INTERNATIONAL_GRANTS" },
          INDUSTRY_GRANTS_INT: { $toInt: "$INDUSTRY_GRANTS" },
        },
      },
      {
        $group: {
          _id: null,
          totalNationalGrants: { $sum: "$NATIONAL_GRANTS_INT" },
          totalInternationalGrants: { $sum: "$INTERNATIONAL_GRANTS_INT" },
          totalIndustryGrants: { $sum: "$INDUSTRY_GRANTS_INT" },
        },
      },
    ]);

    const {
      totalNationalGrants = 0,
      totalInternationalGrants = 0,
      totalIndustryGrants = 0,
    } = grantsData[0] || {};

    res.json({
      nationalGrants: totalNationalGrants,
      internationalGrants: totalInternationalGrants,
      industryGrants: totalIndustryGrants,
    });
  } catch (err) {
    console.error("Error fetching grants data:", err);
    res.status(500).send("Error fetching grants data");
  }
});

// 2. Publications Data Endpoint
app.get("/api/publications", async (req, res) => {
  try {
    const publicationData = await Scholar.aggregate([
      {
        $addFields: {
          INDEXED_PUBLICATION_INT: { $toInt: "$INDEXED_PUBLICATION" },
          NON_INDEXED_PUBLICATION_INT: { $toInt: "$NON_INDEXED_PUBLICATION" },
          OTHERS_PUBLICATION_INT: { $toInt: "$OTHERS_PUBLICATION" },
        },
      },
      {
        $group: {
          _id: null,
          totalIndexedPublications: { $sum: "$INDEXED_PUBLICATION_INT" },
          totalNonIndexedPublications: { $sum: "$NON_INDEXED_PUBLICATION_INT" },
          totalOtherPublications: { $sum: "$OTHERS_PUBLICATION_INT" },
        },
      },
    ]);

    const {
      totalIndexedPublications = 0,
      totalNonIndexedPublications = 0,
      totalOtherPublications = 0,
    } = publicationData[0] || {};

    res.json({
      indexedPublications: totalIndexedPublications,
      nonIndexedPublications: totalNonIndexedPublications,
      otherPublications: totalOtherPublications,
    });
  } catch (err) {
    console.error("Error fetching publication data:", err);
    res.status(500).send("Error fetching publication data");
  }
});

// 3. Scopus Data Endpoint
app.get("/api/scopusData", async (req, res) => {
  try {
    const scopusData = await Scholar.aggregate([
      {
        $addFields: {
          H_INDEXED_SCOPUS_INT: { $toInt: "$H_INDEXED_SCOPUS" },
          CITATIONS_SCOPUS_INT: { $toInt: "$CITATIONS_SCOPUS" },
          PUBLICATIONS_INT: { $toInt: "$PUBLICATIONS" },
        },
      },
      {
        $group: {
          _id: null,
          totalHIndexedScopus: { $sum: "$H_INDEXED_SCOPUS_INT" },
          totalCitationsScopus: { $sum: "$CITATIONS_SCOPUS_INT" },
          totalPublications: { $sum: "$PUBLICATIONS_INT" },
        },
      },
    ]);

    const {
      totalHIndexedScopus = 0,
      totalCitationsScopus = 0,
      totalPublications = 0,
    } = scopusData[0] || {};

    res.json({
      hIndexedScopus: totalHIndexedScopus,
      citationsScopus: totalCitationsScopus,
      publications: totalPublications,
    });
  } catch (err) {
    console.error("Error fetching Scopus data:", err);
    res.status(500).send("Error fetching Scopus data");
  }
});

// 4. Training Projects Endpoint (training_2024 data)
app.get("/api/trainingProjects", async (req, res) => {
  try {
    const projects = await TrainingProject.find({});
    res.json(projects);
  } catch (err) {
    console.error("Error fetching training projects:", err);
    res.status(500).send("Error fetching training projects");
  }
});
app.post("/api/trainingProjects", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug incoming data
    const newProject = new TrainingProject({
      Bil: Number(req.body.Bil),
      KetuaProjek: String(req.body.KetuaProjek),
      Vot: Number(req.body.Vot),
      TajukProjek: String(req.body.TajukProjek),
      Klien: String(req.body.Klien),
      KosProjek: Number(req.body.KosProjek),
      Year: Number(req.body.Year), // Ensure Year is a number
    });

    const savedProject = await newProject.save();
    console.log("Saved project:", savedProject); // Debug saved data
    res.status(201).json(savedProject);
  } catch (err) {
    console.error("Error saving training project:", err);
    res.status(500).send("Error saving training project");
  }
});

// 3. Update Training Project by ID (PUT)
app.put("/api/trainingProjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await TrainingProject.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );
    if (!updatedProject) return res.status(404).send("Project not found");
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating training project:", err);
    res.status(500).send("Error updating training project");
  }
});

// 4. Delete Training Project by ID (DELETE)
app.delete("/api/trainingProjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await TrainingProject.findByIdAndDelete(id);
    if (!deletedProject) return res.status(404).send("Project not found");
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting training project:", err);
    res.status(500).send("Error deleting training project");
  }
});
// Fetch all conferences
app.get("/api/conferences", async (req, res) => {
  try {
    const conferences = await Conference.find({});
    res.json(conferences);
  } catch (err) {
    console.error("Error fetching conferences:", err);
    res.status(500).send("Error fetching conferences");
  }
});

// Add a new conference
app.post("/api/conferences", async (req, res) => {
  try {
    const newConference = new Conference(req.body);
    const savedConference = await newConference.save();
    res.status(201).json(savedConference);
  } catch (err) {
    console.error("Error saving conference:", err);
    res.status(500).send("Error saving conference");
  }
});

// Update a conference by ID
app.put("/api/conferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConference = await Conference.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedConference) return res.status(404).send("Conference not found");
    res.json(updatedConference);
  } catch (err) {
    console.error("Error updating conference:", err);
    res.status(500).send("Error updating conference");
  }
});

// Delete a conference by ID
app.delete("/api/conferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConference = await Conference.findByIdAndDelete(id);
    if (!deletedConference) return res.status(404).send("Conference not found");
    res.json({ message: "Conference deleted successfully" });
  } catch (err) {
    console.error("Error deleting conference:", err);
    res.status(500).send("Error deleting conference");
  }
});
// Fetch all agreements
app.get("/api/moumoa", async (req, res) => {
  try {
    const agreements = await MouMoA.find({});
    res.json(agreements);
  } catch (err) {
    console.error("Error fetching agreements:", err);
    res.status(500).send("Error fetching agreements");
  }
});

// Add a new agreement
app.post("/api/moumoa", async (req, res) => {
  try {
    const newAgreement = new MouMoA(req.body);
    const savedAgreement = await newAgreement.save();
    res.status(201).json(savedAgreement);
  } catch (err) {
    console.error("Error saving agreement:", err);
    res.status(500).send("Error saving agreement");
  }
});

// Update an agreement by ID
app.put("/api/moumoa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAgreement = await MouMoA.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedAgreement) return res.status(404).send("Agreement not found");
    res.json(updatedAgreement);
  } catch (err) {
    console.error("Error updating agreement:", err);
    res.status(500).send("Error updating agreement");
  }
});

// Delete an agreement by ID
app.delete("/api/moumoa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAgreement = await MouMoA.findByIdAndDelete(id);
    if (!deletedAgreement) return res.status(404).send("Agreement not found");
    res.json({ message: "Agreement deleted successfully" });
  } catch (err) {
    console.error("Error deleting agreement:", err);
    res.status(500).send("Error deleting agreement");
  }
});

// app.post("/login", loginController.login);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// import React, { useEffect, useState } from "react";
// import { ResponsivePie } from "@nivo/pie";

// const HIndexCitationsPublicationsPieChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchScopusData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/scopusData");
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Prepare the data for the pie chart
//         const chartData = [
//           { id: "H-Index", value: jsonData.hIndexedScopus },
//           { id: "Citations", value: jsonData.citationsScopus },
//           { id: "Publications", value: jsonData.publications },
//         ];

//         // Calculate total for percentage labels
//         const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

//         // Add percentage labels
//         const dataWithPercentage = chartData.map((item) => ({
//           ...item,
//           label: `${((item.value / total) * 100).toFixed(1)}%`,
//         }));

//         setData(dataWithPercentage);
//       } catch (err) {
//         console.error("Error fetching Scopus data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScopusData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ height: "400px", width: "800px", margin: "auto" }}>
//       <ResponsivePie
//         data={data}
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
