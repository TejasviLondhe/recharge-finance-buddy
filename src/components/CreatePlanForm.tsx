import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToastHelper } from "@/lib/toast-helpers";
import { TelecomOperator } from '@/types';
import { Switch } from '@/components/ui/switch';

const CreatePlanForm = () => {
  const { success, error } = useToastHelper();
  
  const [operators, setOperators] = useState<TelecomOperator[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [name, setName] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [amount, setAmount] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [data, setData] = useState('');
  const [calls, setCalls] = useState('');
  const [sms, setSms] = useState('');
  const [description, setDescription] = useState('');
  const [createFinancingOption, setCreateFinancingOption] = useState(true);
  
  // Financing options
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [initialPayment, setInitialPayment] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [emiCount, setEmiCount] = useState('2');
  
  useEffect(() => {
    fetchOperators();
  }, []);
  
  useEffect(() => {
    if (amount) {
      // Auto-calculate financing options based on regular amount
      const regularAmount = parseFloat(amount);
      const threeMonthAmount = regularAmount * 3;
      const calculatedDiscount = threeMonthAmount * 0.15; // 15% discount
      const calculatedDiscountedPrice = Math.round(threeMonthAmount - calculatedDiscount);
      
      setDiscountedPrice(calculatedDiscountedPrice.toString());
      
      // First EMI is usually higher
      const firstEmi = Math.round(calculatedDiscountedPrice * 0.34); 
      setInitialPayment(firstEmi.toString());
      
      // Remaining amount divided by emi count
      const remainingAmount = calculatedDiscountedPrice - firstEmi;
      const calculatedEmiAmount = Math.round(remainingAmount / parseInt(emiCount));
      setEmiAmount(calculatedEmiAmount.toString());
    }
  }, [amount, emiCount]);
  
  const fetchOperators = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('telecom_operators')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setOperators(data);
        if (data.length > 0) {
          setOperatorId(data[0].id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching operators:', error);
      error('Failed to load operators', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePlan = async () => {
    if (!name || !operatorId || !amount || !validityDays || !data || !calls || !sms) {
      error('Validation Error', 'Please fill all required fields');
      return;
    }
    
    try {
      setCreating(true);
      
      // Create recharge plan
      const { data: planData, error: planError } = await supabase
        .from('recharge_plans')
        .insert([
          {
            name,
            operator_id: operatorId,
            amount: parseFloat(amount),
            validity_days: parseInt(validityDays),
            data,
            calls,
            sms,
            description: description || null,
            is_active: true,
            is_featured: false
          }
        ])
        .select()
        .single();
        
      if (planError) throw planError;
      
      // Create financing option if enabled
      if (createFinancingOption && planData) {
        if (!discountedPrice || !initialPayment || !emiAmount || !emiCount) {
          error('Validation Error', 'Please fill all financing fields');
          return;
        }
        
        const { error: financingError } = await supabase
          .from('financing_options')
          .insert([
            {
              plan_id: planData.id,
              discounted_price: parseFloat(discountedPrice),
              initial_payment: parseFloat(initialPayment),
              emi_amount: parseFloat(emiAmount),
              emi_count: parseInt(emiCount),
              is_active: true
            }
          ]);
          
        if (financingError) throw financingError;
      }
      
      success('Plan Created', 'Recharge plan and financing option created successfully');
      
      // Reset form
      setName('');
      setAmount('');
      setValidityDays('30');
      setData('');
      setCalls('');
      setSms('');
      setDescription('');
      setDiscountedPrice('');
      setInitialPayment('');
      setEmiAmount('');
      setEmiCount('2');
    } catch (error: any) {
      console.error('Error creating plan:', error);
      error('Failed to create plan', error.message);
    } finally {
      setCreating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Recharge Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rs. 349 Plan"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operator">Operator</Label>
            <Select value={operatorId} onValueChange={setOperatorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map(op => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input 
              id="amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              placeholder="e.g. 349"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="validity">Validity (days)</Label>
            <Input 
              id="validity" 
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              type="number"
              min="1"
              placeholder="e.g. 28"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input 
              id="data" 
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="e.g. 1.5GB/day"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calls">Calls</Label>
            <Input 
              id="calls" 
              value={calls}
              onChange={(e) => setCalls(e.target.value)}
              placeholder="e.g. Unlimited"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sms">SMS</Label>
            <Input 
              id="sms" 
              value={sms}
              onChange={(e) => setSms(e.target.value)}
              placeholder="e.g. 100/day"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="create-financing" 
                checked={createFinancingOption}
                onCheckedChange={setCreateFinancingOption}
              />
              <Label htmlFor="create-financing">Create 3-month financing option</Label>
            </div>
          </div>
          
          {createFinancingOption && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="discounted-price">3-Month Discounted Price (₹)</Label>
                <Input 
                  id="discounted-price" 
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="Total 3-month price"
                />
                <p className="text-xs text-gray-500">
                  Regular 3-month price would be ₹{(parseFloat(amount || '0') * 3).toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initial-payment">Initial Payment (₹)</Label>
                <Input 
                  id="initial-payment" 
                  value={initialPayment}
                  onChange={(e) => setInitialPayment(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="First payment amount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emi-amount">EMI Amount (₹)</Label>
                <Input 
                  id="emi-amount" 
                  value={emiAmount}
                  onChange={(e) => setEmiAmount(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="Monthly EMI amount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emi-count">Number of EMIs</Label>
                <Input 
                  id="emi-count" 
                  value={emiCount}
                  onChange={(e) => setEmiCount(e.target.value)}
                  type="number"
                  min="1"
                  max="12"
                  placeholder="e.g. 2"
                />
              </div>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleCreatePlan}
          disabled={creating || loading}
          className="mt-4"
        >
          {creating ? 'Creating Plan...' : 'Create Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreatePlanForm;
