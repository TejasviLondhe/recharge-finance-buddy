
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreditCard, Wallet, Phone, Bell, Home, User, Settings, ArrowRight, LogOut, History } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { ProfileEditSheet } from "@/components/ProfileEditSheet";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import RechargeDialog from "@/components/RechargeDialog";
import { BottomNavigation } from "@/components/BottomNavigation";

// Sample plan type
interface Plan {
  id: string;
  name: string;
  provider: string;
  amount: number;
  isThreeMonth: boolean;
  data: string;
  calls: string;
  sms: string;
  validity: string;
}

// Sample 3-month plans
const threeMonthPlans: Plan[] = [
  {
    id: 'jio-3month',
    provider: 'Jio',
    name: 'Jio 3-Month Special',
    amount: 900,
    isThreeMonth: true,
    data: '2GB/day',
    calls: 'Unlimited',
    sms: '100/day',
    validity: '84 days'
  },
  {
    id: 'airtel-3month',
    provider: 'Airtel',
    name: 'Airtel 3-Month Value',
    amount: 699,
    isThreeMonth: true,
    data: '1.5GB/day',
    calls: 'Unlimited',
    sms: '100/day',
    validity: '84 days'
  },
  {
    id: 'vi-3month',
    provider: 'Vi',
    name: 'Vi 3-Month Weekend',
    amount: 749,
    isThreeMonth: true,
    data: '1.5GB/day',
    calls: 'Unlimited',
    sms: '100/day',
    validity: '84 days'
  }
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
  }, [user]);
  
  const fetchWalletBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_balance')
        .select('balance')
        .eq('user_id', user?.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching wallet balance:', error);
        return;
      }
      
      if (data) {
        setWalletBalance(data.balance);
      } else {
        // Create wallet balance record if it doesn't exist
        await supabase
          .from('wallet_balance')
          .insert({
            user_id: user?.id,
            balance: 0,
            use_wallet_for_recharge: true
          });
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error handling wallet balance:', error);
    }
  };
  
  const handlePlanDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setRechargeDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-emerald-500 w-8 h-8 rounded-full -mr-2"></div>
              <div className="bg-black w-8 h-8 rounded-full z-10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h1 className="ml-2 font-semibold dark:text-white">YouPI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 dark:text-gray-300">
              <Bell size={20} />
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-emerald-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 dark:bg-gray-800 dark:border-gray-700" align="end">
                <div className="space-y-4">
                  <div className="font-medium dark:text-white">
                    {user?.email || 'Your Account'}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start dark:text-gray-200 dark:hover:bg-gray-700" onClick={() => setProfileSheetOpen(true)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                    <Link to="/settings">
                      <Button variant="ghost" size="sm" className="w-full justify-start dark:text-gray-200 dark:hover:bg-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold dark:text-white">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!</h2>
          <p className="text-gray-500 dark:text-gray-400">Your telecom recharge dashboard</p>
        </section>
        
        {/* Balance Card */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-8 shadow-lg">
          <p className="text-white/80 mb-2">Total Balance</p>
          <h3 className="text-3xl font-bold mb-4">₹ 2,500.00</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm">NBFC Wallet</p>
              <div className="flex items-center">
                <p className="font-medium">₹ {walletBalance.toFixed(2)}</p>
                <Link to="/wallet">
                  <Button variant="link" className="p-0 h-auto text-white ml-2">
                    <History size={14} className="mr-1" />
                    <span className="text-xs">History</span>
                  </Button>
                </Link>
              </div>
            </div>
            <Link to="/wallet">
              <Button variant="outline" className="border-white text-green-50 bg-emerald-400 hover:bg-emerald-300">
                View Wallet
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="font-semibold dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <Link to="/plans" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-2">
                  <Phone className="h-6 w-6 text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Recharge</span>
              </div>
            </Link>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Pay EMI</span>
            </div>
            <Link to="/wallet" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-2">
                  <Wallet className="h-6 w-6 text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Wallet</span>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Current Plans */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold dark:text-white">Current Plans</h3>
            <Button variant="ghost" className="text-emerald-600 dark:text-emerald-500 p-0 h-auto">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-3 border-l-4 border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium dark:text-white">Jio ₹349 Plan</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">2GB/day | Unlimited calls</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Exp: 20 Jun 2023</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">EMI 1/3</p>
                <p className="font-medium dark:text-white">₹310 paid</p>
                <p className="text-xs text-emerald-500">Next: ₹310 on 20 May</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium dark:text-white">Airtel ₹199 Plan</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">1GB/day | Unlimited calls</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Exp: 5 Jun 2023</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Fully paid</p>
                <p className="font-medium dark:text-white">₹199</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Special Offers */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold dark:text-white">Special Offers</h3>
            <Link to="/plans">
              <Button variant="ghost" className="text-emerald-600 dark:text-emerald-500 p-0 h-auto">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex space-x-4">
              {threeMonthPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-gradient-to-r ${
                    plan.provider === 'Jio' ? 'from-blue-500 to-indigo-600' :
                    plan.provider === 'Airtel' ? 'from-purple-500 to-pink-500' :
                    'from-amber-500 to-orange-500'
                  } rounded-xl p-4 shadow-sm min-w-[270px] text-white`}
                >
                  <p className="text-white/80 mb-1">{plan.provider} Special</p>
                  <h4 className="font-bold text-lg mb-2">3 Months @ ₹{plan.amount}</h4>
                  <p className="text-sm mb-4">
                    {plan.data} | {plan.validity} | Get cashback in wallet!
                  </p>
                  <Button 
                    className={`bg-white hover:bg-white/90 ${
                      plan.provider === 'Jio' ? 'text-indigo-600' :
                      plan.provider === 'Airtel' ? 'text-pink-600' :
                      'text-orange-600'
                    }`}
                    onClick={() => handlePlanDetails(plan)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Profile Edit Sheet */}
      <ProfileEditSheet isOpen={profileSheetOpen} onClose={() => setProfileSheetOpen(false)} />
      
      {/* Recharge Dialog */}
      <RechargeDialog 
        isOpen={rechargeDialogOpen} 
        onClose={() => setRechargeDialogOpen(false)} 
        plan={selectedPlan}
      />
    </div>
  );
};

export default Dashboard;
