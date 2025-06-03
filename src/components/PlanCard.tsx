
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plan } from "@/pages/Plans";
import { CreditCard, Play } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

const PlanCard = ({ plan, onSelect }: PlanCardProps) => {
  const monthlyEquivalent = plan.isThreeMonth 
    ? Math.round(plan.amount / 3) 
    : plan.amount;
  
  const emiAmount = plan.isThreeMonth 
    ? Math.round(plan.amount / 3) + Math.round(plan.amount * 0.005) // First EMI + processing fee
    : 0;

  // Generate color scheme based on provider
  const getColorScheme = () => {
    switch (plan.provider.toLowerCase()) {
      case 'jio':
        return {
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
          border: "border-blue-200 dark:border-blue-800",
          highlight: "text-blue-600 dark:text-blue-400",
          button: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        };
      case 'airtel':
        return {
          bg: "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30",
          border: "border-red-200 dark:border-red-800",
          highlight: "text-red-600 dark:text-red-400",
          button: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
        };
      case 'vi':
        return {
          bg: "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30",
          border: "border-amber-200 dark:border-amber-800",
          highlight: "text-amber-600 dark:text-amber-400",
          button: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
          border: "border-gray-200 dark:border-gray-700",
          highlight: "text-gray-600 dark:text-gray-400",
          button: "bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        };
    }
  };

  const colors = getColorScheme();

  return (
    <Card className={`${colors.bg} border ${colors.border} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium dark:text-white">{plan.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{plan.validity}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg dark:text-white">₹{plan.amount}</div>
            {plan.isThreeMonth && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                (₹{monthlyEquivalent}/month normally)
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className={`text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border ${colors.border} ${colors.highlight}`}>
            {plan.data}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border ${colors.border} ${colors.highlight}`}>
            {plan.calls} calls
          </div>
          <div className={`text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border ${colors.border} ${colors.highlight}`}>
            {plan.sms}
          </div>
        </div>

        {/* OTT Subscriptions */}
        {plan.ottSubscriptions && plan.ottSubscriptions.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <Play className={`h-3 w-3 ${colors.highlight} mr-1`} />
              <span className="text-xs font-medium dark:text-gray-200">OTT Included:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {plan.ottSubscriptions.map((ott, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400`}
                >
                  {ott}
                </span>
              ))}
            </div>
          </div>
        )}

        {plan.isThreeMonth && (
          <div className={`mb-3 p-2 rounded-md bg-opacity-50 flex items-start ${colors.bg} border ${colors.border}`}>
            <CreditCard className={`h-4 w-4 ${colors.highlight} mr-2 mt-0.5`} />
            <div className="text-xs">
              <p className="font-medium dark:text-gray-200">EMI Available</p>
              <p className="dark:text-gray-300">
                Pay ₹{emiAmount} now, rest in 2 EMIs
              </p>
            </div>
          </div>
        )}

        <Button 
          className={`w-full text-white ${colors.button}`}
          onClick={() => onSelect(plan)}
        >
          {plan.isThreeMonth ? "View EMI Options" : "Recharge Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
