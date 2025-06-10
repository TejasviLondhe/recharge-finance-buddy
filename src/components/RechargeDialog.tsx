
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { phonePeService } from "@/services/phonepeService";
import WalletSection from "./recharge/WalletSection";
import EMISection from "./recharge/EMISection";
import CashbackInfo from "./recharge/CashbackInfo";
import PaymentSummary from "./recharge/PaymentSummary";

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
  const { toast } = useToast();
  const [useWallet, setUseWallet] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showEMIBreakdown, setShowEMIBreakdown] = useState(false);
  const [userProfile, setUserProfile] = useState<{ phone_number?: string } | null>(null);
  
  // EMI calculation constants
  const processingFeeRate = 0.02; // 2%
  const gstRate = 0.18; // 18%
  const emiCount = 3;
  
  // Check if plan is eligible for EMI (only 84-day plans)
  const isEMIEligible = plan?.isThreeMonth && plan?.validity === "84 days";
  
  useEffect(() => {
    if (isOpen && user && plan) {
      fetchWalletData();
      fetchCashbackSettings();
      fetchUserProfile();
    }
  }, [isOpen, user, plan]);
  
  useEffect(() => {
    if (plan) {
      calculateFinalAmount();
    }
  }, [plan, useWallet, walletBalance]);
  
  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user?.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
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

  const calculateEMIDetails = () => {
    if (!plan || !isEMIEligible) return null;
    
    const totalAmount = plan.amount;
    const processingFee = totalAmount * processingFeeRate;
    const gstOnProcessingFee = processingFee * gstRate;
    const totalWithCharges = totalAmount + processingFee + gstOnProcessingFee;
    const emiAmount = Math.ceil(totalWithCharges / emiCount);
    
    return {
      totalAmount,
      processingFee,
      gstOnProcessingFee,
      totalWithCharges,
      emiAmount,
      firstPayment: emiAmount
    };
  };
  
  const handlePayment = async () => {
    if (!plan || !user) return;
    
    // Check if user has phone number
    if (!userProfile?.phone_number && !user.phone) {
      toast({
        title: "Phone Number Required",
        description: "Please update your profile with a phone number to proceed with payment.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      const walletDeduction = useWallet ? Math.min(walletBalance, plan.amount) : 0;
      const amountToPay = finalAmount;
      
      if (isEMIEligible && showEMIBreakdown) {
        // Handle EMI payment for 84-day plans
        const emiDetails = calculateEMIDetails();
        if (!emiDetails) return;
        
        const { paymentUrl, transactionId } = await phonePeService.initiatePayment(
          emiDetails.firstPayment,
          user.id,
          plan.id,
          plan.name,
          true // isRecurring
        );
        
        // Setup recurring payment schedule
        await phonePeService.setupRecurringPayment(
          plan.id,
          user.id,
          emiDetails.totalWithCharges,
          emiDetails.emiAmount,
          emiCount
        );
        
        // Redirect to PhonePe payment page
        window.location.href = paymentUrl;
        
      } else {
        // Handle regular payment (28-day plans or 84-day plans without EMI)
        const { paymentUrl, transactionId } = await phonePeService.initiatePayment(
          amountToPay,
          user.id,
          plan.id,
          plan.name,
          false
        );
        
        // If using wallet, process wallet deduction first
        if (walletDeduction > 0) {
          const { error } = await supabase.rpc('process_recharge', {
            p_user_id: user.id,
            p_plan_id: plan.id,
            p_plan_name: plan.name,
            p_plan_amount: plan.amount,
            p_wallet_amount: walletDeduction,
            p_is_three_month: plan.isThreeMonth,
            p_provider: plan.provider
          });
          
          if (error) throw error;
        }
        
        // Redirect to PhonePe payment page
        window.location.href = paymentUrl;
      }
      
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
  
  const emiDetails = calculateEMIDetails();
  
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
          
          <WalletSection
            walletBalance={walletBalance}
            useWallet={useWallet}
            onUseWalletChange={setUseWallet}
            planAmount={plan.amount}
          />

          <EMISection
            isEMIEligible={isEMIEligible}
            showEMIBreakdown={showEMIBreakdown}
            onEMIToggle={setShowEMIBreakdown}
            emiDetails={emiDetails}
            isThreeMonth={plan.isThreeMonth}
          />
          
          <CashbackInfo
            isThreeMonth={plan.isThreeMonth}
            cashbackAmount={cashbackAmount}
          />
          
          <PaymentSummary
            planAmount={plan.amount}
            useWallet={useWallet}
            walletBalance={walletBalance}
            finalAmount={finalAmount}
            showEMIBreakdown={showEMIBreakdown}
            emiDetails={emiDetails}
          />
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} disabled={processingPayment}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={processingPayment || loading}>
            {processingPayment ? "Processing..." : 
             showEMIBreakdown ? "Pay with EMI" : "Pay with PhonePe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
