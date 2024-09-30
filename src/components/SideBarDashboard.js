import { Button } from "../ui/Button";
import {
  Home,
  PlusCircle,
  FileText,
  BarChart2,
  DollarSign,
  Users,
  Settings,
  HelpCircle,
  Zap,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("none");

  const [currentTab, setCurrentTab] = useState("dashboard");

  const getAccountType = () => {
    // Get account type from local storage
    const accountType = localStorage.getItem("accountType");
    setAccountType(accountType);
  };

  useEffect(() => {
    getAccountType();
  }, []);

  return (
    <aside className="w-64 min-w-60  bg-slate-800 p-6 space-y-6">
      <Link to="/">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.svg" className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Crowdsourced
          </span>
        </div>
      </Link>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start bg-gray-800"
          onClick={() =>
            accountType === "company"
              ? navigate("/company/dashboard")
              : navigate("/voter/dashboard")
          }
        >
          <Home className="mr-2 h-4 w-4" /> Dashboard
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            accountType === "company"
              ? navigate("/company/post")
              : navigate("/voter/task/")
          }
        >
          {accountType === "company" ? (
            <>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Task
            </>
          ) : (
            <>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Complete Task
            </>
          )}
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" /> My Projects
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            accountType === "company"
              ? navigate("/company/analytics")
              : navigate("/voter/analytics")
          }
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Analytics
        </Button>
        {/* <Button variant="ghost" className="w-full justify-start">
          <DollarSign className="mr-2 h-4 w-4" /> Billing
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" /> Voter Pool
        </Button> */}
      </nav>
      <div className="pt-6 border-t border-white">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" /> Help
        </Button>
      </div>
    </aside>
  );
};
