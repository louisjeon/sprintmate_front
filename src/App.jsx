import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import ProjectDetailPage from "./pages/project/ProjectDetailPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {AppRoutes}
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route
          path="/teams/:teamId/projects/:projectId"
          element={<ProjectDetailPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
