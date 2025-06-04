
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, AlertCircle, Calculator } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { phonePeService } from "@/services/phonepeService";

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
    if (!userProfile?.phone_number) {
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

          {/* EMI Option - Only for 84-day plans */}
          {isEMIEligible && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-600 dark:text-blue-400">EMI Option Available</span>
                </div>
                <Switch 
                  id="emi-option" 
                  checked={showEMIBreakdown}
                  onCheckedChange={setShowEMIBreakdown}
                />
              </div>
              
              {showEMIBreakdown && emiDetails && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Plan Amount:</span>
                    <span>₹{emiDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Processing Fee (2%):</span>
                    <span>₹{emiDetails.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">GST (18%):</span>
                    <span>₹{emiDetails.gstOnProcessingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span className="text-blue-600 dark:text-blue-400">Total Amount:</span>
                    <span>₹{emiDetails.totalWithCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-blue-600 dark:text-blue-400">Pay Today:</span>
                    <span>₹{emiDetails.firstPayment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Remaining EMIs:</span>
                    <span>2 × ₹{emiDetails.emiAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Note for 28-day plans */}
          {!isEMIEligible && plan.isThreeMonth && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50">
              <div className="flex items-center text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">EMI option is only available for 84-day plans</span>
              </div>
            </div>
          )}
          
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
            {!showEMIBreakdown ? (
              <>
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
              </>
            ) : (
              emiDetails && (
                <div className="flex justify-between items-center font-semibold">
                  <span className="dark:text-white">Pay Today:</span>
                  <span className="dark:text-white text-lg">₹ {emiDetails.firstPayment.toFixed(2)}</span>
                </div>
              )
            )}
          </div>
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
