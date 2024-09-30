import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyDashboard from "./pages/CompanyDashboard";
import VoterTask from "./pages/VoterTask";

import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import ErrorBoundary from "./pages/ErrorBoundary";
import RegistrationPage from "./pages/RegistrationPage";
import PostQuestionPage from "./pages/PostQuestionPage";
import VoterDashboard from "./pages/VoterDashboard";
import CompanyAnalytics from "./pages/Analytics";
import VoterQuestions from "./pages/VoterQuestions";


function App() {
  return (
    <>

        <Toaster />
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegistrationPage />} />

              {/* Company */}
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/post" element={<PostQuestionPage />} />
              <Route path="/company/analytics" element={<CompanyAnalytics />} />


              {/* Voter */}
              <Route path="/voter/dashboard" element={<VoterDashboard />} />
              {/* <Route path="/voter/task" element={<VoterTask />} /> */}
              <Route path="/voter/task" element={<VoterQuestions />} />
            </Routes>
          </Router>
        </ErrorBoundary>
    </>
  );
}

export default App;
