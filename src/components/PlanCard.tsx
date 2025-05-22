
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RechargePlan, TelecomOperator } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PlanCardProps {
  plan: RechargePlan;
  operator: TelecomOperator;
  onSelect: (plan: RechargePlan) => void;
  isMonthly?: boolean;
}

const PlanCard = ({ plan, operator, onSelect, isMonthly = true }: PlanCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{plan.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{operator.name}</p>
        </div>
        <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-center">
          {operator.logo_url ? (
            <img src={operator.logo_url} alt={operator.name} className="h-6 w-6" />
          ) : (
            <span className="font-bold text-lg">{operator.name.charAt(0)}</span>
          )}
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <div className="mb-3">
          <span className="text-2xl font-bold">{formatCurrency(plan.amount)}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
            {isMonthly ? '/ month' : '/ 3 months'}
          </span>
        </div>
        
        <div className="space-y-2 mt-3">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Data</span>
            <span className="font-medium">{plan.data}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Calls</span>
            <span className="font-medium">{plan.calls}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">SMS</span>
            <span className="font-medium">{plan.sms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Validity</span>
            <span className="font-medium">{plan.validity_days} days</span>
          </div>
        </div>
        
        {plan.description && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onSelect(plan)} className="w-full">
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
