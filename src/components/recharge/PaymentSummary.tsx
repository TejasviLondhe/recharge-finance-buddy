
import React from 'react';

interface EMIDetails {
  totalAmount: number;
  processingFee: number;
  gstOnProcessingFee: number;
  totalWithCharges: number;
  emiAmount: number;
  firstPayment: number;
}

interface PaymentSummaryProps {
  planAmount: number;
  useWallet: boolean;
  walletBalance: number;
  finalAmount: number;
  showEMIBreakdown: boolean;
  emiDetails: EMIDetails | null;
}

const PaymentSummary = ({ 
  planAmount, 
  useWallet, 
  walletBalance, 
  finalAmount, 
  showEMIBreakdown, 
  emiDetails 
}: PaymentSummaryProps) => {
  return (
    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
      {!showEMIBreakdown ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="dark:text-gray-300">Plan Amount:</span>
            <span className="dark:text-white">₹ {planAmount.toFixed(2)}</span>
          </div>
          
          {useWallet && walletBalance > 0 && (
            <div className="flex justify-between items-center mb-2 text-emerald-500">
              <span>Wallet Deduction:</span>
              <span>- ₹ {Math.min(walletBalance, planAmount).toFixed(2)}</span>
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
  );
};

export default PaymentSummary;
