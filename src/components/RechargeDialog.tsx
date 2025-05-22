
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wallet, CreditCard, AlertCircle, Calendar, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import FinancingSummary from './FinancingSummary';
import { FinancingOption, RechargePlan, TelecomOperator } from '@/types';
import { formatCurrency } from '@/lib/utils';

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
  plan: RechargePlan | null;
  operator: TelecomOperator | null;
}

const RechargeDialog = ({ isOpen, onClose, plan, operator }: RechargeDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [useWallet, setUseWallet] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeTab, setActiveTab] = useState('monthly');
  
  // Financing related states
  const [financingOption, setFinancingOption] = useState<FinancingOption | null>(null);
  const [loadingFinancing, setLoadingFinancing] = useState(false);
  
  useEffect(() => {
    if (isOpen && user && plan) {
      fetchWalletData();
      fetchCashbackSettings();
      fetchFinancingOptions();
    }
  }, [isOpen, user, plan]);
  
  useEffect(() => {
    if (plan) {
      calculateFinalAmount();
    }
  }, [plan, useWallet, walletBalance, activeTab, financingOption]);
  
  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_balance')
        .select('balance, use_wallet_for_recharge')
        .eq('user_id', user.id)
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
      toast.error('Failed to load wallet data', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCashbackSettings = async () => {
    try {
      // Fetch cashback settings for 3-month plans
      const { data, error } = await supabase
        .from('finance_settings')
        .select('cashback_amount')
        .single();
          
      if (error) throw error;
        
      if (data) {
        setCashbackAmount(data.cashback_amount);
      }
    } catch (error: any) {
      console.error('Error fetching cashback settings:', error);
      // Default cashback amount if unable to fetch
      setCashbackAmount(50);
    }
  };
  
  const fetchFinancingOptions = async () => {
    if (!plan) return;
    
    try {
      setLoadingFinancing(true);
      
      // Fetch financing options for this plan
      const { data, error } = await supabase
        .from('financing_options')
        .select('*')
        .eq('plan_id', plan.id)
        .eq('is_active', true)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching financing options:', error);
        return;
      }
      
      setFinancingOption(data || null);
    } catch (error: any) {
      console.error('Error fetching financing options:', error);
    } finally {
      setLoadingFinancing(false);
    }
  };
  
  const calculateFinalAmount = () => {
    if (!plan) return;
    
    let amount = 0;
    
    // Calculate base amount based on selected plan type
    if (activeTab === 'financing' && financingOption) {
      // For financing option, use initial payment
      amount = financingOption.initial_payment;
    } else {
      // For regular plan, use plan amount
      amount = plan.amount;
    }
    
    // Apply wallet deduction if enabled
    if (useWallet && walletBalance > 0) {
      const deduction = Math.min(walletBalance, amount);
      amount -= deduction;
    }
    
    setFinalAmount(amount);
  };
  
  const handlePayment = async () => {
    if (!plan || !user || !operator) return;
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      // Calculate wallet deduction
      const walletDeduction = useWallet ? Math.min(walletBalance, activeTab === 'financing' && financingOption ? financingOption.initial_payment : plan.amount) : 0;
      
      // Prepare parameters for the API call
      const isFinancing = activeTab === 'financing' && financingOption !== null;
      const financingId = isFinancing ? financingOption?.id : null;
      
      // Process the recharge using the stored procedure
      const { data, error } = await supabase.rpc('process_financed_recharge', {
        p_user_id: user.id,
        p_plan_id: plan.id,
        p_phone_number: phoneNumber,
        p_is_financing: isFinancing,
        p_financing_id: financingId,
        p_wallet_amount: walletDeduction,
        p_transaction_id: 'PAYMENT-' + Math.floor(Math.random() * 1000000) // Simulate a payment gateway transaction ID
      });
      
      if (error) throw error;
      
      // Show success toast
      toast.success(
        "Recharge Successful!",
        `${plan.name} by ${operator.name} has been activated on ${phoneNumber}`
      );
      
      // Show cashback toast if applicable
      if (isFinancing && cashbackAmount > 0) {
        toast.success(
          "Cashback Credited!",
          `₹${cashbackAmount} has been added to your NBFC Wallet`
        );
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error("Payment Failed", error.message);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (!plan || !operator) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Recharge: {plan.name} ({operator.name})</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input 
              id="phone-number" 
              placeholder="Enter phone number" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
              <TabsTrigger value="financing" disabled={!financingOption}>3-Month Financing</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="pt-4 space-y-4">
              <Card className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.validity_days} days validity
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-xl">{formatCurrency(plan.amount)}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total cost</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-center">
                    <p className="font-medium">{plan.data}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Data</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{plan.calls}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{plan.sms}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SMS</p>
                  </div>
                </div>
              </Card>
              
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
            </TabsContent>
            
            <TabsContent value="financing" className="pt-4 space-y-4">
              {loadingFinancing ? (
                <p className="text-center py-4">Loading financing options...</p>
              ) : financingOption ? (
                <>
                  <FinancingSummary plan={plan} financingOption={financingOption} />
                  
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
                        id="use-wallet-financing" 
                        checked={useWallet}
                        onCheckedChange={setUseWallet}
                        disabled={walletBalance <= 0}
                      />
                      <Label htmlFor="use-wallet-financing" className="dark:text-gray-300">
                        {walletBalance > 0 
                          ? `Use wallet balance (saves ₹${Math.min(walletBalance, financingOption.initial_payment).toFixed(2)})` 
                          : "No wallet balance available"}
                      </Label>
                    </div>
                  </div>
                  
                  {/* Cashback Info */}
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50">
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span className="font-medium">Get ₹{cashbackAmount} cashback in your wallet!</span>
                    </div>
                    <p className="text-sm text-emerald-500 dark:text-emerald-300 mt-1">
                      Automatically credited after successful payment
                    </p>
                  </div>
                  
                  {/* EMI Reminders */}
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="font-medium">EMI Reminder</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <p className="text-sm text-blue-500 dark:text-blue-300">
                        We'll remind you before each EMI due date
                      </p>
                    </div>
                  </div>
                  
                  {/* Payment Summary */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="dark:text-gray-300">First Payment:</span>
                      <span className="dark:text-white">₹ {financingOption.initial_payment.toFixed(2)}</span>
                    </div>
                    
                    {useWallet && walletBalance > 0 && (
                      <div className="flex justify-between items-center mb-2 text-emerald-500">
                        <span>Wallet Deduction:</span>
                        <span>- ₹ {Math.min(walletBalance, financingOption.initial_payment).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 font-semibold">
                      <span className="dark:text-white">Amount to Pay:</span>
                      <span className="dark:text-white text-lg">₹ {finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No financing options available for this plan</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} disabled={processingPayment}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={processingPayment || loading}>
            {processingPayment ? "Processing..." : `Pay ${formatCurrency(finalAmount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
