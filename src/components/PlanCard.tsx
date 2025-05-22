
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/card";
import { RechargePlan, TelecomOperator } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Clock, MessageSquare, Wifi } from "lucide-react";

interface PlanCardProps {
  plan: RechargePlan;
  operator: TelecomOperator;
  onSelect: (plan: RechargePlan) => void;
  isMonthly?: boolean;
}

const PlanCard = ({ plan, operator, onSelect, isMonthly = true }: PlanCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const threeMonthPrice = plan.amount * 3;
  const threeMonthDiscountedPrice = Math.round(threeMonthPrice * 0.85); // 15% discount example
  
  return (
    <Card 
      className={`overflow-hidden h-full flex flex-col border-gray-100 dark:border-gray-800 transition-all ${isHovered ? 'shadow-lg dark:shadow-emerald-900/20 transform -translate-y-1' : 'hover:shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="flex items-center justify-between">
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
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="mb-3">
          <span className="text-2xl font-bold">{formatCurrency(plan.amount)}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
            {isMonthly ? '/ month' : '/ 3 months'}
          </span>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center">
            <Wifi className="h-4 w-4 text-emerald-500 mr-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Data:</span>
            <span className="ml-auto font-medium">{plan.data}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 text-emerald-500 mr-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">SMS:</span>
            <span className="ml-auto font-medium">{plan.sms}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-emerald-500 mr-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Calls:</span>
            <span className="ml-auto font-medium">{plan.calls}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-emerald-500 mr-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Validity:</span>
            <span className="ml-auto font-medium">{plan.validity_days} days</span>
          </div>
        </div>
        
        {/* 3-Month option with EMI */}
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-emerald-500 mb-2">3-Month Special Offer</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs line-through">{formatCurrency(threeMonthPrice)}</p>
              <p className="font-medium">{formatCurrency(threeMonthDiscountedPrice)}</p>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 text-xs font-medium px-2 py-1 rounded">
              Save 15%
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Available in 3 EMIs of {formatCurrency(Math.round(threeMonthDiscountedPrice / 3))}
          </p>
        </div>
        
        {plan.description && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onSelect(plan)} className="w-full bg-emerald-500 hover:bg-emerald-600">
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
