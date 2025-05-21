
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

interface RechargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const RechargeDialog = ({ isOpen, onClose, plan }: RechargeDialogProps) => {
  const { user } = useAuth();
  const [useWallet, setUseWallet] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  useEffect(() => {
    if (isOpen && user && plan) {
      fetchWalletData();
      fetchCashbackSettings();
    }
  }, [isOpen, user, plan]);
  
  useEffect(() => {
    if (plan) {
      calculateFinalAmount();
    }
  }, [plan, useWallet, walletBalance]);
  
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_balance')
        .select('balance, use_wallet_for_recharge')
        .eq('user_id', user?.id)
        .single();
        
      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      }
      
      if (walletData) {
        setWalletBalance(walletData.balance);
        setUseWallet(walletData.use_wallet_for_recharge);
      }
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Failed to load wallet data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCashbackSettings = async () => {
    try {
      // Fetch cashback settings for 3-month plans
      if (plan?.isThreeMonth) {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('three_month_cashback')
          .single();
          
        if (error) throw error;
        
        if (data) {
          setCashbackAmount(data.three_month_cashback);
        }
      } else {
        setCashbackAmount(0);
      }
    } catch (error: any) {
      console.error('Error fetching cashback settings:', error);
      // Default cashback amount if unable to fetch
      setCashbackAmount(plan?.isThreeMonth ? 50 : 0);
    }
  };
  
  const calculateFinalAmount = () => {
    if (!plan) return;
    
    let amount = plan.amount;
    
    if (useWallet && walletBalance > 0) {
      const deduction = Math.min(walletBalance, plan.amount);
      amount -= deduction;
    }
    
    setFinalAmount(amount);
  };
  
  const handlePayment = async () => {
    if (!plan || !user) return;
    
    try {
      setProcessingPayment(true);
      
      // Calculate wallet deduction
      const walletDeduction = useWallet ? Math.min(walletBalance, plan.amount) : 0;
      const amountToPay = plan.amount - walletDeduction;
      
      // Start a Supabase transaction using RPC (stored procedure)
      const { data, error } = await supabase.rpc('process_recharge', {
        p_user_id: user.id,
        p_plan_id: plan.id,
        p_plan_name: plan.name,
        p_plan_amount: plan.amount,
        p_wallet_amount: walletDeduction,
        p_is_three_month: plan.isThreeMonth,
        p_provider: plan.provider
      });
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Recharge Successful!",
        description: `${plan.name} has been activated on your number.`
      });
      
      // Show cashback toast if applicable
      if (plan.isThreeMonth && cashbackAmount > 0) {
        toast({
          title: "Cashback Credited!",
          description: `₹${cashbackAmount} has been added to your NBFC Wallet.`,
          variant: "default"
        });
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (!plan) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recharge: {plan.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="dark:text-gray-300">Plan Amount:</span>
            <span className="font-semibold dark:text-white">₹ {plan.amount.toFixed(2)}</span>
          </div>
          
          {/* Wallet Section */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="dark:text-white font-medium">NBFC Wallet</span>
              </div>
              <span className="text-emerald-500 font-medium">₹ {walletBalance.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-wallet" 
                checked={useWallet}
                onCheckedChange={setUseWallet}
                disabled={walletBalance <= 0}
              />
              <Label htmlFor="use-wallet" className="dark:text-gray-300">
                {walletBalance > 0 
                  ? `Use wallet balance (saves ₹${Math.min(walletBalance, plan.amount).toFixed(2)})` 
                  : "No wallet balance available"}
              </Label>
            </div>
          </div>
          
          {/* Cashback Info */}
          {plan.isThreeMonth && cashbackAmount > 0 && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50">
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <CreditCard className="h-5 w-5 mr-2" />
                <span className="font-medium">Get ₹{cashbackAmount} cashback in your wallet!</span>
              </div>
              <p className="text-sm text-emerald-500 dark:text-emerald-300 mt-1">
                Automatically credited after successful recharge
              </p>
            </div>
          )}
          
          {/* Payment Summary */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="dark:text-gray-300">Plan Amount:</span>
              <span className="dark:text-white">₹ {plan.amount.toFixed(2)}</span>
            </div>
            
            {useWallet && walletBalance > 0 && (
              <div className="flex justify-between items-center mb-2 text-emerald-500">
                <span>Wallet Deduction:</span>
                <span>- ₹ {Math.min(walletBalance, plan.amount).toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 font-semibold">
              <span className="dark:text-white">Amount to Pay:</span>
              <span className="dark:text-white text-lg">₹ {finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} disabled={processingPayment}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={processingPayment || loading}>
            {processingPayment ? "Processing..." : "Proceed to Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
