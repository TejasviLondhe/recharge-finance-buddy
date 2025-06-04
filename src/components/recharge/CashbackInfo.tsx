
import React from 'react';
import { CreditCard } from 'lucide-react';

interface CashbackInfoProps {
  isThreeMonth: boolean;
  cashbackAmount: number;
}

const CashbackInfo = ({ isThreeMonth, cashbackAmount }: CashbackInfoProps) => {
  if (!isThreeMonth || cashbackAmount <= 0) {
    return null;
  }

  return (
    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50">
      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
        <CreditCard className="h-5 w-5 mr-2" />
        <span className="font-medium">Get ₹{cashbackAmount} cashback in your wallet!</span>
      </div>
      <p className="text-sm text-emerald-500 dark:text-emerald-300 mt-1">
        Automatically credited after successful recharge
      </p>
    </div>
  );
};

export default CashbackInfo;
