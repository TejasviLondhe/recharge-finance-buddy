import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Globe, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getTheme, toggleTheme } from '@/lib/utils';
const Settings = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Theme settings
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<'light' | 'dark'>('light');

  // Language settings
  const [language, setLanguage] = useState('english');

  // Notification settings
  const [rechargeReminders, setRechargeReminders] = useState(true);
  const [rechargeReminderDays, setRechargeReminderDays] = useState("3");
  const [emiAlerts, setEmiAlerts] = useState(true);
  const [emiAlertDays, setEmiAlertDays] = useState("2");

  // Initialize theme on component mount
  useEffect(() => {
    // Apply the current theme
    toggleTheme(theme);
  }, []);
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setPendingTheme(newTheme);
    setShowThemeDialog(true);
  };
  const applyThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toggleTheme(newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Enabled`,
      description: `Theme changed to ${newTheme} mode.`
    });
  };
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Language Updated",
      description: `Language changed to ${value}.`
    });
  };
  const handleRechargeRemindersChange = (checked: boolean) => {
    setRechargeReminders(checked);
    toast({
      title: checked ? "Reminders Enabled" : "Reminders Disabled",
      description: checked ? `You will receive recharge reminders ${rechargeReminderDays} days before expiry.` : "Recharge reminders have been disabled."
    });
  };
  const handleEmiAlertsChange = (checked: boolean) => {
    setEmiAlerts(checked);
    toast({
      title: checked ? "EMI Alerts Enabled" : "EMI Alerts Disabled",
      description: checked ? `You will receive EMI alerts ${emiAlertDays} days before due date.` : "EMI alerts have been disabled."
    });
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Theme Change Confirmation Dialog */}
      <AlertDialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Switch to {pendingTheme.charAt(0).toUpperCase() + pendingTheme.slice(1)} Mode?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingTheme === 'dark' ? "Would you like to change the app theme to dark mode for a better low-light experience?" : "Would you like to change the app theme to light mode?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => applyThemeChange(pendingTheme)} className="bg-emerald-500 hover:bg-emerald-600">
              Enable {pendingTheme.charAt(0).toUpperCase() + pendingTheme.slice(1)} Mode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold dark:text-white">Settings</h1>
        </div>
      </header>
      
      {/* Settings Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Appearance Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Appearance</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Theme</h3>
              <div className="flex gap-4">
                <Button onClick={() => handleThemeChange('light')} variant={theme === 'light' ? 'default' : 'outline'} className={theme === 'light' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                  <Sun className="mr-2" size={18} />
                  Light
                </Button>
                <Button onClick={() => handleThemeChange('dark')} variant={theme === 'dark' ? 'default' : 'outline'} className={theme === 'dark' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                  <Moon className="mr-2" size={18} />
                  Dark
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Language</h3>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
                  <SelectItem value="bengali">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        
        {/* Notifications Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Notifications</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recharge Reminders</h3>
                </div>
                <Switch checked={rechargeReminders} onCheckedChange={handleRechargeRemindersChange} className="bg-gray-950 hover:bg-gray-800" />
              </div>
              {rechargeReminders && <div className="ml-7 mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Remind me before plan expiry</p>
                  <Select value={rechargeReminderDays} onValueChange={setRechargeReminderDays}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">EMI Payment Alerts</h3>
                </div>
                <Switch checked={emiAlerts} onCheckedChange={handleEmiAlertsChange} />
              </div>
              {emiAlerts && <div className="ml-7 mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Remind me before EMI due date</p>
                  <Select value={emiAlertDays} onValueChange={setEmiAlertDays}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>}
            </div>
          </div>
        </section>
        
        {/* Save Button */}
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => {
        toast({
          title: "Settings Saved",
          description: "Your settings have been updated successfully."
        });
      }}>
          Save Settings
        </Button>
      </div>
    </div>;
};
export default Settings;