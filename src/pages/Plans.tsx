
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard, Wallet, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PlanCard from "@/components/PlanCard";
import RechargeDialog from "@/components/RechargeDialog";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Enhanced Plan type definition with OTT subscriptions
export interface Plan {
  id: string;
  name: string;
  provider: string;
  amount: number;
  isThreeMonth: boolean;
  data: string;
  calls: string;
  sms: string;
  validity: string;
  ottSubscriptions?: string[];
}

const Plans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("jio");
  const [showThreeMonth, setShowThreeMonth] = useState(false);
  const [plans, setPlans] = useState<Record<string, Plan[]>>({
    jio: [],
    airtel: [],
    vi: [],
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({
    jio: true,
    airtel: true,
    vi: true,
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    fetchPlans();
  }, [user, navigate]);

  // Add useEffect to refetch plans when showThreeMonth changes
  useEffect(() => {
    fetchPlans();
  }, [showThreeMonth]);

  const fetchPlans = async () => {
    setLoading({
      jio: true,
      airtel: true,
      vi: true,
    });

    try {
      // Use the current state value directly in plan generation
      const jioPlans = getRealPlans("Jio", showThreeMonth);
      const airtelPlans = getRealPlans("Airtel", showThreeMonth);
      const viPlans = getRealPlans("Vi", showThreeMonth);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));

      setPlans({
        jio: jioPlans,
        airtel: airtelPlans,
        vi: viPlans,
      });

    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Failed to load plans",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading({
        jio: false,
        airtel: false,
        vi: false,
      });
    }
  };

  // Real prepaid plans data based on current market offerings
  const getRealPlans = (provider: string, isThreeMonth: boolean): Plan[] => {
    console.log(`Generating plans for ${provider}, isThreeMonth: ${isThreeMonth}`);
    
    if (isThreeMonth) {
      // 84-day (3-Month) plans
      switch (provider) {
        case "Jio":
          return [
            {
              id: "jio-84-719",
              provider: "Jio",
              name: "Jio 3-Month Basic",
              amount: 719,
              isThreeMonth: true,
              data: "1.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["JioCinema Premium", "JioSaavn Pro"]
            },
            {
              id: "jio-84-859",
              provider: "Jio",
              name: "Jio 3-Month Standard",
              amount: 859,
              isThreeMonth: true,
              data: "2GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["JioCinema Premium", "JioSaavn Pro", "JioNews"]
            },
            {
              id: "jio-84-1028",
              provider: "Jio",
              name: "Jio 3-Month Premium",
              amount: 1028,
              isThreeMonth: true,
              data: "2.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["JioCinema Premium", "JioSaavn Pro", "JioNews", "Sony LIV"]
            }
          ];
        
        case "Airtel":
          return [
            {
              id: "airtel-84-839",
              provider: "Airtel",
              name: "Airtel 3-Month Smart",
              amount: 839,
              isThreeMonth: true,
              data: "2GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["Disney+ Hotstar Mobile", "Airtel Xstream"]
            },
            {
              id: "airtel-84-999",
              provider: "Airtel",
              name: "Airtel 3-Month Entertainment",
              amount: 999,
              isThreeMonth: true,
              data: "2.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["Disney+ Hotstar Mobile", "Amazon Prime Video Mobile", "Airtel Xstream"]
            },
            {
              id: "airtel-84-1199",
              provider: "Airtel",
              name: "Airtel 3-Month Ultimate",
              amount: 1199,
              isThreeMonth: true,
              data: "3GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["Disney+ Hotstar Mobile", "Amazon Prime Video Mobile", "Netflix Mobile", "Airtel Xstream"]
            }
          ];
        
        case "Vi":
          return [
            {
              id: "vi-84-719",
              provider: "Vi",
              name: "Vi 3-Month Hero",
              amount: 719,
              isThreeMonth: true,
              data: "1.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["Vi Movies & TV"]
            },
            {
              id: "vi-84-839",
              provider: "Vi",
              name: "Vi 3-Month Super",
              amount: 839,
              isThreeMonth: true,
              data: "2GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["Vi Movies & TV", "SonyLIV"]
            },
            {
              id: "vi-84-999",
              provider: "Vi",
              name: "Vi 3-Month Champion",
              amount: 999,
              isThreeMonth: true,
              data: "2.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "84 days",
              ottSubscriptions: ["Vi Movies & TV", "SonyLIV", "Zee5"]
            }
          ];
        
        default:
          return [];
      }
    } else {
      // 28-day (Monthly) plans
      switch (provider) {
        case "Jio":
          return [
            {
              id: "jio-28-239",
              provider: "Jio",
              name: "Jio Basic",
              amount: 239,
              isThreeMonth: false,
              data: "1.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["JioCinema Premium"]
            },
            {
              id: "jio-28-299",
              provider: "Jio",
              name: "Jio Standard",
              amount: 299,
              isThreeMonth: false,
              data: "2GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["JioCinema Premium", "JioSaavn Pro"]
            },
            {
              id: "jio-28-349",
              provider: "Jio",
              name: "Jio Premium",
              amount: 349,
              isThreeMonth: false,
              data: "2.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["JioCinema Premium", "JioSaavn Pro", "JioNews"]
            },
            {
              id: "jio-28-399",
              provider: "Jio",
              name: "Jio Max",
              amount: 399,
              isThreeMonth: false,
              data: "3GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["JioCinema Premium", "JioSaavn Pro", "JioNews", "Sony LIV"]
            }
          ];
        
        case "Airtel":
          return [
            {
              id: "airtel-28-265",
              provider: "Airtel",
              name: "Airtel Smart",
              amount: 265,
              isThreeMonth: false,
              data: "1.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Airtel Xstream"]
            },
            {
              id: "airtel-28-299",
              provider: "Airtel",
              name: "Airtel Popular",
              amount: 299,
              isThreeMonth: false,
              data: "2GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Disney+ Hotstar Mobile", "Airtel Xstream"]
            },
            {
              id: "airtel-28-359",
              provider: "Airtel",
              name: "Airtel Entertainment",
              amount: 359,
              isThreeMonth: false,
              data: "2.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Disney+ Hotstar Mobile", "Amazon Prime Video Mobile", "Airtel Xstream"]
            },
            {
              id: "airtel-28-449",
              provider: "Airtel",
              name: "Airtel Ultimate",
              amount: 449,
              isThreeMonth: false,
              data: "3GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Disney+ Hotstar Mobile", "Amazon Prime Video Mobile", "Netflix Mobile", "Airtel Xstream"]
            }
          ];
        
        case "Vi":
          return [
            {
              id: "vi-28-249",
              provider: "Vi",
              name: "Vi Hero",
              amount: 249,
              isThreeMonth: false,
              data: "1.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Vi Movies & TV"]
            },
            {
              id: "vi-28-299",
              provider: "Vi",
              name: "Vi Super",
              amount: 299,
              isThreeMonth: false,
              data: "2GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Vi Movies & TV", "SonyLIV"]
            },
            {
              id: "vi-28-359",
              provider: "Vi",
              name: "Vi Champion",
              amount: 359,
              isThreeMonth: false,
              data: "2.5GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Vi Movies & TV", "SonyLIV", "Zee5"]
            },
            {
              id: "vi-28-399",
              provider: "Vi",
              name: "Vi Winner",
              amount: 399,
              isThreeMonth: false,
              data: "3GB/day",
              calls: "Unlimited",
              sms: "100/day",
              validity: "28 days",
              ottSubscriptions: ["Vi Movies & TV", "SonyLIV", "Zee5", "Voot Select"]
            }
          ];
        
        default:
          return [];
      }
    }
  };

  const handlePlanSelected = (plan: Plan) => {
    setSelectedPlan(plan);
    setRechargeDialogOpen(true);
  };

  const handleThreeMonthToggle = (checked: boolean) => {
    console.log(`Toggle changed to: ${checked}`);
    setShowThreeMonth(checked);
    // The useEffect will handle refetching plans automatically
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold dark:text-white">Recharge</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-500 dark:text-gray-400"
          >
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Plan Type Toggle */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <h2 className="text-base font-medium mb-4 dark:text-white">Select Plan Type</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm dark:text-gray-300">Monthly Plans</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Regular recharge plans</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="plan-type" 
                  checked={showThreeMonth}
                  onCheckedChange={handleThreeMonthToggle}
                />
                <Label htmlFor="plan-type" className="cursor-pointer">
                  <div>
                    <p className="text-sm dark:text-gray-300">3-Month Plans</p>
                    <p className="text-xs text-emerald-500">EMI available</p>
                  </div>
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Operator Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
          <div className="p-4">
            <h2 className="text-base font-medium mb-4 dark:text-white">Select Operator</h2>
            <Tabs 
              defaultValue="jio" 
              value={activeTab}
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger 
                  value="jio" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Jio
                </TabsTrigger>
                <TabsTrigger 
                  value="airtel" 
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  Airtel
                </TabsTrigger>
                <TabsTrigger 
                  value="vi" 
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Vi
                </TabsTrigger>
              </TabsList>

              {["jio", "airtel", "vi"].map((operator) => (
                <TabsContent 
                  key={operator} 
                  value={operator} 
                  className="mt-0 pt-2"
                >
                  <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                    {showThreeMonth ? "3-Month Plans" : "Monthly Plans"}
                  </h3>
                  
                  {loading[operator as keyof typeof loading] ? (
                    // Loading placeholder
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      ))}
                    </div>
                  ) : plans[operator as keyof typeof plans].length > 0 ? (
                    // Plan cards
                    <div className="space-y-4">
                      {plans[operator as keyof typeof plans].map((plan) => (
                        <PlanCard 
                          key={plan.id} 
                          plan={plan}
                          onSelect={handlePlanSelected}
                        />
                      ))}
                    </div>
                  ) : (
                    // No plans state
                    <div className="py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No plans available</p>
                      <Button 
                        variant="outline" 
                        onClick={fetchPlans}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* PhonePe NBFC Info Card */}
        {showThreeMonth && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 border border-blue-100 dark:border-blue-900">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1 dark:text-white">EMI with PhonePe NBFC</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Get instant financing for your 3-month plans with minimal interest.
                  Pay in convenient EMIs with low processing fees.
                </p>
                <div className="flex space-x-4 text-xs">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Processing Fee</p>
                    <p className="font-medium dark:text-white">0.5% - 2%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Interest Rate</p>
                    <p className="font-medium dark:text-white">~1% monthly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3 dark:text-white">How It Works</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <ol className="space-y-3">
              <li className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-sm">1</span>
                </div>
                <p className="text-sm dark:text-gray-300">Select your preferred operator and plan</p>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-sm">2</span>
                </div>
                <p className="text-sm dark:text-gray-300">
                  {showThreeMonth 
                    ? "Choose EMI option or pay in full" 
                    : "Add to cart and proceed to checkout"}
                </p>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-sm">3</span>
                </div>
                <p className="text-sm dark:text-gray-300">
                  {showThreeMonth 
                    ? "Pay first installment and enjoy 3-month validity" 
                    : "Complete payment to activate your plan"}
                </p>
              </li>
            </ol>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Recharge Dialog */}
      <RechargeDialog 
        isOpen={rechargeDialogOpen} 
        onClose={() => setRechargeDialogOpen(false)} 
        plan={selectedPlan}
      />
    </div>
  );
};

export default Plans;
