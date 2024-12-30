import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/lineTraining";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Publications from "./scenes/publications";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Pie2 from "./scenes/pie2";
import Citations from "./scenes/citations";
import CitationsBar from "./scenes/CitationsBar";
import Conferences from "./scenes/stacked";
import Agreements from "./scenes/networking";
import TrainingBar from "./scenes/trainingBar";
import ConferenceLine from "./scenes/conferenceLine";
import ConferenceBar from "./scenes/conferenceBar";
import NBar from "./scenes/networkingBar";
import NLine from "./scenes/nLine";
import Login from "./components/Login/Login";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/conferences" element={<Conferences />} />
              <Route path="/networking" element={<Agreements />} />

              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/pie2" element={<Pie2 />} />
              <Route path="/citationsPie" element={<Citations />} />
              <Route path="/citationsBar" element={<CitationsBar />} />
              <Route path="/trainingsBar" element={<TrainingBar />} />
              <Route path="/conferenceLine" element={<ConferenceLine />} />
              <Route path="/conferenceBar" element={<ConferenceBar />} />
              <Route path="/nBar" element={<NBar />} />
              <Route path="/nLine" element={<NLine />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
