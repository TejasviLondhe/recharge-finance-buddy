
import React from "react";
import AdminSettings from "@/components/AdminSettings";
import RechargeSection from "@/components/RechargeSection";
import CreatePlanForm from "@/components/CreatePlanForm";
import EMITracker from "@/components/EMITracker";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@example.com"; // Simplified admin check

  return (
    <div className="container max-w-5xl py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Telecom Recharge Dashboard</h1>
      
      {/* Admin interface */}
      {isAdmin ? (
        <Tabs defaultValue="plans">
          <TabsList className="mb-4">
            <TabsTrigger value="plans">Create Plans</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans">
            <CreatePlanForm />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RechargeSection />
          </div>
          <div className="lg:col-span-1">
            <EMITracker />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
