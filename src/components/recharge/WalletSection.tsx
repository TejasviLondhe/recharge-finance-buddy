
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wallet } from 'lucide-react';

interface WalletSectionProps {
  walletBalance: number;
  useWallet: boolean;
  onUseWalletChange: (checked: boolean) => void;
  planAmount: number;
}

const WalletSection = ({ walletBalance, useWallet, onUseWalletChange, planAmount }: WalletSectionProps) => {
  return (
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
          onCheckedChange={onUseWalletChange}
          disabled={walletBalance <= 0}
        />
        <Label htmlFor="use-wallet" className="dark:text-gray-300">
          {walletBalance > 0 
            ? `Use wallet balance (saves ₹${Math.min(walletBalance, planAmount).toFixed(2)})` 
            : "No wallet balance available"}
        </Label>
      </div>
    </div>
  );
};

export default WalletSection;
