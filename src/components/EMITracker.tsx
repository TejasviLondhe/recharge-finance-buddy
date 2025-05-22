import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { EMITransaction, RechargePlan } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToastHelper } from '@/lib/toast-helpers';
import { formatCurrency } from '@/lib/utils';
import { format, isPast, addDays } from 'date-fns';

interface EMITrackerProps {
  showAllEMIs?: boolean;
}

// Extend the EMITransaction type to include the user_recharges property
interface ExtendedEMITransaction extends EMITransaction {
  user_recharges?: {
    plan_id: string;
    phone_number: string;
  };
}

const EMITracker = ({ showAllEMIs = false }: EMITrackerProps) => {
  const { user } = useAuth();
  const { success, error } = useToastHelper();
  const [loading, setLoading] = useState(false);
  const [emiTransactions, setEmiTransactions] = useState<ExtendedEMITransaction[]>([]);
  const [plans, setPlans] = useState<Record<string, RechargePlan>>({});
  
  useEffect(() => {
    if (user) {
      fetchEMIs();
    }
  }, [user, showAllEMIs]);
  
  const fetchEMIs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Query to get EMIs with status 'pending' or all if showAllEMIs is true
      let query = supabase
        .from('emi_transactions')
        .select(`
          *,
          user_recharges!inner(
            plan_id,
            phone_number
          )
        `)
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      
      // If not showing all EMIs, only show pending ones
      if (!showAllEMIs) {
        query = query.eq('payment_status', 'pending');
      }
      
      // Limit to 5 if not showing all
      if (!showAllEMIs) {
        query = query.limit(3);
      }
      
      const { data: emiData, error } = await query;
      
      if (error) throw error;
      
      if (emiData && emiData.length > 0) {
        setEmiTransactions(emiData as unknown as ExtendedEMITransaction[]);
        
        // Get all plan ids
        const planIds = [...new Set(emiData.map(emi => emi.user_recharges?.plan_id))].filter(Boolean);
        
        if (planIds.length > 0) {
          // Fetch plans data
          const { data: plansData, error: plansError } = await supabase
            .from('recharge_plans')
            .select('*')
            .in('id', planIds);
            
          if (plansError) throw plansError;
          
          // Create plans lookup map
          const plansMap: Record<string, RechargePlan> = {};
          plansData?.forEach(plan => {
            plansMap[plan.id] = plan;
          });
          
          setPlans(plansMap);
        }
      } else {
        setEmiTransactions([]);
      }
    } catch (error: any) {
      console.error('Error fetching EMIs:', error);
      error('Failed to load EMI data', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePayEMI = async (emiId: string, amount: number) => {
    // This would integrate with a payment gateway in a real app
    try {
      // Simulate successful payment
      const transactionId = 'PAYMENT-' + Math.floor(Math.random() * 1000000);
      
      // Update EMI status
      const { error: updateError } = await supabase
        .from('emi_transactions')
        .update({
          payment_status: 'paid',
          payment_date: new Date().toISOString(),
          transaction_id: transactionId
        })
        .eq('id', emiId);
        
      if (updateError) throw updateError;
      
      success('EMI Payment Successful', `Payment of ${formatCurrency(amount)} completed`);
      
      // Refresh EMIs
      fetchEMIs();
    } catch (err: any) {
      console.error('Error paying EMI:', err);
      error('Payment Failed', err.message);
    }
  };
  
  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'paid') {
      return 'bg-green-500';
    } else if (isPast(new Date(dueDate))) {
      return 'bg-red-500';
    } else if (isPast(addDays(new Date(dueDate), -3))) {
      return 'bg-yellow-500';
    }
    return 'bg-blue-500';
  };
  
  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'paid') {
      return 'Paid';
    } else if (isPast(new Date(dueDate))) {
      return 'Overdue';
    } else if (isPast(addDays(new Date(dueDate), -3))) {
      return 'Due Soon';
    }
    return 'Upcoming';
  };
  
  const getStatusIcon = (status: string, dueDate: string) => {
    if (status === 'paid') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (isPast(new Date(dueDate))) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (isPast(addDays(new Date(dueDate), -3))) {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
    return <Calendar className="h-5 w-5 text-blue-500" />;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>EMI Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-gray-500">Loading EMI data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (emiTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>EMI Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <Calendar className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No pending EMIs</p>
            <p className="text-sm text-gray-400 mt-1">
              EMIs from your recharges will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>EMI Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {emiTransactions.map((emi) => {
          const plan = emi.user_recharges?.plan_id ? plans[emi.user_recharges.plan_id] : undefined;
          return (
            <div 
              key={emi.id} 
              className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(emi.payment_status, emi.due_date)}
                    <span className="font-medium">
                      {plan?.name || 'Recharge Plan'} - EMI {emi.emi_number}
                    </span>
                  </div>
                  {emi.user_recharges?.phone_number && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Phone number: {emi.user_recharges.phone_number}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">
                    {formatCurrency(emi.amount)}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {format(new Date(emi.due_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span 
                    className={`h-2.5 w-2.5 rounded-full ${getStatusColor(emi.payment_status, emi.due_date)}`}
                  ></span>
                  <span className="text-sm">
                    {getStatusText(emi.payment_status, emi.due_date)}
                  </span>
                </div>
                
                {emi.payment_status === 'pending' && (
                  <Button 
                    size="sm" 
                    onClick={() => handlePayEMI(emi.id, emi.amount)}
                    variant={isPast(new Date(emi.due_date)) ? "destructive" : "default"}
                  >
                    Pay Now
                  </Button>
                )}
                
                {emi.payment_status === 'paid' && (
                  <span className="text-sm text-green-500 font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Paid on {format(new Date(emi.payment_date || ''), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {!showAllEMIs && emiTransactions.length > 0 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/wallet">View All EMIs</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMITracker;
