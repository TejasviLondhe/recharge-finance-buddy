
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [cashbackAmount, setCashbackAmount] = useState(50);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch admin settings
      const { data, error } = await supabase
        .from('admin_settings')
        .select('three_month_cashback')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setCashbackAmount(data.three_month_cashback);
      }
    } catch (error: any) {
      console.error('Error fetching admin settings:', error);
      toast({
        title: "Failed to load settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Save admin settings
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 1, // Single record for all admin settings
          three_month_cashback: cashbackAmount
        });
        
      if (error) throw error;
      
      toast({
        title: "Settings Saved",
        description: "Cashback amount updated successfully."
      });
    } catch (error: any) {
      console.error('Error saving admin settings:', error);
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive"
      });
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
