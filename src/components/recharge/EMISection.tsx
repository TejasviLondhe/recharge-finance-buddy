
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Calculator, AlertCircle } from 'lucide-react';

interface EMIDetails {
  totalAmount: number;
  processingFee: number;
  gstOnProcessingFee: number;
  totalWithCharges: number;
  emiAmount: number;
  firstPayment: number;
}

interface EMISectionProps {
  isEMIEligible: boolean;
  showEMIBreakdown: boolean;
  onEMIToggle: (checked: boolean) => void;
  emiDetails: EMIDetails | null;
  isThreeMonth: boolean;
}

const EMISection = ({ isEMIEligible, showEMIBreakdown, onEMIToggle, emiDetails, isThreeMonth }: EMISectionProps) => {
  if (isEMIEligible) {
    return (
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium text-blue-600 dark:text-blue-400">EMI Option Available</span>
          </div>
          <Switch 
            id="emi-option" 
            checked={showEMIBreakdown}
            onCheckedChange={onEMIToggle}
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
    );
  }

  if (!isEMIEligible && isThreeMonth) {
    return (
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50">
        <div className="flex items-center text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm">EMI option is only available for 84-day plans</span>
        </div>
      </div>
    );
  }

  return null;
};

export default EMISection;
