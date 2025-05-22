
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancingOption, RechargePlan } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, ArrowRight, Check } from "lucide-react";

interface FinancingSummaryProps {
  plan: RechargePlan;
  financingOption: FinancingOption;
}

const FinancingSummary = ({ plan, financingOption }: FinancingSummaryProps) => {
  // Calculate GST amount on processing fee
  const gstAmount = (financingOption.processing_fee * financingOption.gst_percentage) / 100;
  const totalProcessingFee = financingOption.processing_fee + gstAmount;
  
  // Calculate total savings
  const regularPrice = plan.amount * 3;
  const savings = regularPrice - financingOption.discounted_price;
  const savingsPercentage = (savings / regularPrice) * 100;
  
  return (
    <Card className="border-green-100 dark:border-green-900">
      <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800/50 pb-3">
        <CardTitle className="text-xl flex items-center text-green-800 dark:text-green-300">
          <Check className="mr-2 h-5 w-5" /> 3-Month Financing Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Regular 3-month price</p>
            <p className="font-medium">{formatCurrency(regularPrice)}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Discounted price</p>
            <p className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(financingOption.discounted_price)}
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
          <p className="text-green-700 dark:text-green-300 font-medium">
            Save {formatCurrency(savings)} ({savingsPercentage.toFixed(0)}%)
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Payment Schedule</h4>
          
          <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-3">
            <p className="font-medium text-blue-700 dark:text-blue-300 flex items-start">
              <span className="bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              Pay {formatCurrency(financingOption.initial_payment)} today
            </p>
          </div>
          
          {Array.from({ length: financingOption.emi_count }, (_, i) => (
            <div key={i} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <p className="font-medium text-gray-700 dark:text-gray-300 flex items-start">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">{i+2}</span>
                Pay {formatCurrency(financingOption.emi_amount)} in {(i+1)*30} days
              </p>
            </div>
          ))}
        </div>
        
        {totalProcessingFee > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
              <span>{formatCurrency(financingOption.processing_fee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">GST ({financingOption.gst_percentage}%)</span>
              <span>{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between font-medium mt-1 pt-1 border-t border-gray-100 dark:border-gray-800">
              <span>Total Charges</span>
              <span>{formatCurrency(totalProcessingFee)}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            By proceeding, you agree to pay the remaining EMIs on their scheduled due dates. Failure to pay may affect your financing eligibility.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancingSummary;
