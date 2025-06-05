
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Wallet, ArrowUp, ArrowDown, History, CreditCard, Home, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Transaction type definition
interface Transaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  created_at: string;
  reference?: string;
}

const WalletPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWalletForRecharge, setUseWalletForRecharge] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);
  
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_balance')
        .select('balance, use_wallet_for_recharge')
        .eq('user_id', user?.uid)
        .single();
        
      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      }
      
      if (walletData) {
        setWalletBalance(walletData.balance);
        setUseWalletForRecharge(walletData.use_wallet_for_recharge);
      }
      
      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user?.uid)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (transactionsError) {
        throw transactionsError;
      }
      
      // Ensure the type property matches our Transaction type
      if (transactionsData) {
        const typedTransactions = transactionsData.map(tx => ({
          ...tx,
          type: tx.type as 'credit' | 'debit'
        }));
        setTransactions(typedTransactions);
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
  
  const handleApplyWalletToggle = async (checked: boolean) => {
    try {
      setUseWalletForRecharge(checked);
      
      // Update wallet settings in database
      const { error } = await supabase
        .from('wallet_balance')
        .update({
          use_wallet_for_recharge: checked
        })
        .eq('user_id', user?.uid);
        
      if (error) throw error;
      
      toast({
        title: checked ? "Wallet Applied" : "Wallet Removed",
        description: checked 
          ? "Your NBFC wallet balance will be used for recharges" 
          : "Your NBFC wallet balance will not be used for recharges",
      });
    } catch (error: any) {
      console.error('Error updating wallet setting:', error);
      toast({
        title: "Failed to update setting",
        description: error.message,
        variant: "destructive"
      });
      // Revert UI state if operation failed
      setUseWalletForRecharge(!checked);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => navigate('/dashboard')} className="mr-2">
              <ArrowRight className="rotate-180 h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="font-semibold dark:text-white">NBFC Wallet</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Wallet Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Wallet className="mr-2 h-5 w-5" />
              NBFC Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold">₹ {walletBalance.toFixed(2)}</h3>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-wallet" 
                checked={useWalletForRecharge}
                onCheckedChange={handleApplyWalletToggle} 
              />
              <Label htmlFor="use-wallet" className="text-white">Use for recharges</Label>
            </div>
          </CardFooter>
        </Card>
        
        {/* Transaction History */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <History className="mr-2 h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold dark:text-white">Transaction History</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center dark:text-gray-400">Loading transactions...</div>
              ) : transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{formatDate(tx.created_at)}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell className={tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}>
                          <span className="flex items-center">
                            {tx.type === 'credit' ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                            ₹ {tx.amount.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center dark:text-gray-400">
                  No transactions yet. Complete a recharge to earn cashback!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* How it works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">How NBFC Wallet Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="dark:text-gray-300">
              • Receive ₹40-50 cashback when you purchase a 3-month recharge plan
            </p>
            <p className="dark:text-gray-300">
              • Use your wallet balance for future recharges
            </p>
            <p className="dark:text-gray-300">
              • Track all your wallet transactions in one place
            </p>
          </CardContent>
        </Card>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 py-2 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center">
          <Link to="/dashboard" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <div className="flex flex-col items-center p-2 text-emerald-500">
            <Wallet size={20} />
            <span className="text-xs mt-1">Wallet</span>
          </div>
          <Link to="/plans" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
            <CreditCard size={20} />
            <span className="text-xs mt-1">Plans</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default WalletPage;
