
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToastHelper } from "@/lib/toast-helpers";
import { Loader2, RefreshCw } from "lucide-react";
import { RechargePlan, TelecomOperator } from "@/types";
import PlanCard from "@/components/PlanCard";
import RechargeDialog from "@/components/RechargeDialog";

const Plans = () => {
  const { error } = useToastHelper();
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [operators, setOperators] = useState<TelecomOperator[]>([]);
  const [plans, setPlans] = useState<Record<string, RechargePlan[]>>({});
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(null);
  const [selectedOperatorObj, setSelectedOperatorObj] = useState<TelecomOperator | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchAttempt, setFetchAttempt] = useState(0);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: plansError } = await supabase
        .from('recharge_plans')
        .select('*')
        .eq('is_active', true)
        .order('amount');
        
      if (plansError) throw plansError;
      
      if (data) {
        // Group plans by operator
        const plansByOperator: Record<string, RechargePlan[]> = {};
        
        data.forEach(plan => {
          if (!plansByOperator[plan.operator_id]) {
            plansByOperator[plan.operator_id] = [];
          }
          plansByOperator[plan.operator_id].push(plan);
        });
        
        setPlans(plansByOperator);
        console.log('Plans fetched:', Object.keys(plansByOperator).length > 0 ? 'plans found' : 'no plans found', plansByOperator);
      }
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      error('Failed to load recharge plans', err.message);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [error]);

  useEffect(() => {
    fetchOperators();
    fetchPlans();
  }, [fetchAttempt, fetchPlans]);
  
  useEffect(() => {
    if (operators.length > 0 && !selectedOperator) {
      setSelectedOperator(operators[0]?.id || null);
      setSelectedOperatorObj(operators[0] || null);
    }
  }, [operators, selectedOperator]);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      
      const { data, error: operatorsError } = await supabase
        .from('telecom_operators')
        .select('*')
        .order('name');
        
      if (operatorsError) throw operatorsError;
      
      if (data) {
        setOperators(data);
        console.log('Operators fetched:', data);
      }
    } catch (err: any) {
      console.error('Error fetching operators:', err);
      error('Failed to load operators', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: RechargePlan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleOperatorChange = (operatorId: string) => {
    setSelectedOperator(operatorId);
    const foundOperator = operators.find(op => op.id === operatorId);
    setSelectedOperatorObj(foundOperator || null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleRetry = () => {
    setRetrying(true);
    setFetchAttempt(prev => prev + 1);
  };
  
  const renderPlanContent = () => {
    if (loading && operators.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading operators and plans...</p>
        </div>
      );
    }
    
    if (retrying) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-400">Refreshing plans...</p>
        </div>
      );
    }
    
    if (selectedOperator && plans[selectedOperator]?.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans[selectedOperator].map(plan => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              operator={operators.find(op => op.id === plan.operator_id) as TelecomOperator}
              onSelect={handlePlanSelect}
              isMonthly={true}
            />
          ))}
        </div>
      );
    }
    
    // No plans case - after loading is complete
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-4">No plans available for this operator</p>
        <Button 
          variant="outline" 
          onClick={handleRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Plans
        </Button>
      </div>
    );
  };

  return (
    <div className="container max-w-5xl py-6 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Telecom Plans</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Recharge Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {operators.length > 0 ? (
            <Tabs 
              value={selectedOperator || ''} 
              onValueChange={handleOperatorChange}
              className="w-full"
            >
              <TabsList className="mb-4 w-full justify-start overflow-auto">
                {operators.map(operator => (
                  <TabsTrigger key={operator.id} value={operator.id}>
                    {operator.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {selectedOperator && (
                <TabsContent value={selectedOperator} className="mt-0">
                  {renderPlanContent()}
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">Unable to load operators</p>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          )}
          
          {selectedPlan && selectedOperatorObj && (
            <RechargeDialog
              isOpen={isDialogOpen}
              onClose={handleCloseDialog}
              plan={selectedPlan}
              operator={selectedOperatorObj}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;
