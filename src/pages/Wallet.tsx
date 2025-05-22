import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Wallet as WalletIcon, CreditCard, ArrowDown, ArrowUp, HistoryIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToastHelper } from "@/lib/toast-helpers";
import { formatCurrency } from "@/lib/utils";
import { format } from 'date-fns';
import { Transaction } from '@/types';
import EMITracker from '@/components/EMITracker';

const WalletPage = () => {
  const { user } = useAuth();
  const { success, error } = useToastHelper();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [useWalletForRecharge, setUseWalletForRecharge] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);
  
  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get wallet balance
      const { data, error } = await supabase
        .from('wallet_balance')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setBalance(data.balance);
        setUseWalletForRecharge(data.use_wallet_for_recharge);
      } else {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from('wallet_balance')
          .insert([
            { 
              user_id: user.id,
              balance: 0,
              use_wallet_for_recharge: true
            }
          ])
          .select()
          .single();
          
        if (createError) throw createError;
        
        if (newWallet) {
          setBalance(newWallet.balance);
          setUseWalletForRecharge(newWallet.use_wallet_for_recharge);
        }
      }
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      error('Failed to load wallet data', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      // Get wallet transactions
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      if (data) {
        setTransactions(data as Transaction[]);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      error('Failed to load transactions', error.message);
    }
  };
  
  const toggleWalletUsage = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update wallet settings
      const { error } = await supabase
        .from('wallet_balance')
        .update({ 
          use_wallet_for_recharge: !useWalletForRecharge,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setUseWalletForRecharge(!useWalletForRecharge);
      
      success(
        'Wallet Setting Updated', 
        `Wallet will ${!useWalletForRecharge ? 'now' : 'no longer'} be used for recharges`
      );
    } catch (error: any) {
      console.error('Error updating wallet settings:', error);
      error('Failed to update settings', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-2xl font-bold mb-6">Wallet & EMIs</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Wallet Card */}
        <Card className="md:col-span-1">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <WalletIcon className="mr-2 h-6 w-6" />
              NBFC Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
              <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-wallet" 
                    checked={useWalletForRecharge}
                    onCheckedChange={toggleWalletUsage}
                    disabled={loading}
                  />
                  <Label htmlFor="use-wallet">Use wallet for recharges</Label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                When enabled, your wallet balance will be automatically used for recharges
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <Button className="flex-1" variant="outline">Add Money</Button>
              <Button className="flex-1">Recharge Now</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* EMI Tracker */}
        <Card className="md:col-span-1">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-6 w-6" />
              EMI Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <EMITracker showAllEMIs={false} />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto mb-6">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="emis">EMI Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <HistoryIcon className="mr-2 h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <HistoryIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No transaction history</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Recharge cashbacks and payments will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'credit' 
                            ? <ArrowDown className="h-5 w-5" /> 
                            : <ArrowUp className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.created_at 
                              ? format(new Date(transaction.created_at), 'MMM dd, yyyy • HH:mm')
                              : 'Date not available'}
                          </p>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        transaction.type === 'credit' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emis">
          <EMITracker showAllEMIs={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletPage;
