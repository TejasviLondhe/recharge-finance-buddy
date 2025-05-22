
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToastHelper } from "@/lib/toast-helpers";

const AdminSettings = () => {
  const [cashbackAmount, setCashbackAmount] = useState(50);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToastHelper();
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch admin settings
      const { data, error: fetchError } = await supabase
        .from('finance_settings')
        .select('cashback_amount')
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data) {
        setCashbackAmount(data.cashback_amount);
      }
    } catch (err: any) {
      console.error('Error fetching admin settings:', err);
      error('Failed to load settings', err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Save admin settings
      const { error: saveError } = await supabase
        .from('finance_settings')
        .upsert({
          id: 1, // Single record for all admin settings
          cashback_amount: cashbackAmount
        });
        
      if (saveError) throw saveError;
      
      success('Settings Saved', 'Cashback amount updated successfully.');
    } catch (err: any) {
      console.error('Error saving admin settings:', err);
      error('Failed to save settings', err.message);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Settings className="mr-2 h-5 w-5" />
          NBFC Wallet Admin Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading settings...</p>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="cashback-amount">3-Month Plan Cashback (₹)</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="cashback-amount"
                  type="number" 
                  value={cashbackAmount}
                  onChange={(e) => setCashbackAmount(parseInt(e.target.value) || 0)}
                  min="0"
                  max="200"
                  className="w-24"
                />
                <p className="text-sm text-gray-500">
                  Amount credited to user's wallet on purchase of any 3-month plan
                </p>
              </div>
            </div>
            
            <Button 
              className="mt-4"
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
