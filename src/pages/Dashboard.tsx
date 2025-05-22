import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, CreditCard, Wallet, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import RechargeSection from "@/components/RechargeSection";
import EMITracker from "@/components/EMITracker";
import CreatePlanForm from "@/components/CreatePlanForm";
import AdminSettings from "@/components/AdminSettings";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(2500.00); // Example default
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchWalletBalance();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserName(data.full_name || user.email?.split('@')[0] || 'User');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('wallet_balance')
        .select('balance')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setWalletBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    switch(action) {
      case 'recharge':
        // Scroll to recharge section
        document.getElementById('recharge-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'pay-emi':
        // Scroll to EMI section
        document.getElementById('emi-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'wallet':
        navigate('/wallet');
        break;
      default:
        break;
    }
  };

  // Check if user is admin
  const isAdmin = user?.email === "admin@example.com"; // Simplified admin check

  if (isAdmin) {
    return (
      <div className="container max-w-5xl py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Telecom Recharge Dashboard</h1>
        
        {/* Admin interface */}
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
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6 px-4">
      {/* User Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {userName}!</h1>
        <p className="text-gray-400">Your telecom recharge dashboard</p>
      </div>
      
      {/* Balance Card */}
      <Card className="mb-6 bg-emerald-500 border-none shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div>
            <p className="text-white text-sm mb-2">Total Balance</p>
            <h2 className="text-3xl font-bold text-white mb-4">{formatCurrency(totalBalance)}</h2>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-sm">NBFC Wallet</p>
                <p className="text-white font-bold">{formatCurrency(walletBalance)}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent text-white border-white hover:bg-white hover:text-emerald-500"
                onClick={() => navigate('/wallet')}
              >
                Top up
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card 
            className="bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors border-gray-700"
            onClick={() => handleAction('recharge')}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                <Phone className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-white text-sm">Recharge</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors border-gray-700"
            onClick={() => handleAction('pay-emi')}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                <CreditCard className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-white text-sm">Pay EMI</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors border-gray-700"
            onClick={() => handleAction('wallet')}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                <Wallet className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-white text-sm">Wallet</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Current Plans */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Current Plans</h2>
          <Button 
            variant="link" 
            className="text-emerald-500 font-medium p-0 flex items-center"
            onClick={() => navigate('/wallet')}
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {/* Recharge Section */}
        <div id="recharge-section">
          <RechargeSection />
        </div>
        
        {/* EMI Section */}
        <div id="emi-section" className="mt-8">
          <EMITracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
