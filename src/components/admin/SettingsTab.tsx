
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Save, 
  CreditCard as CardIcon, 
  Wallet, 
  Apple, 
  Smartphone 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const SettingsTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSaveChanges = (section: string) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings Saved",
        description: `${section} settings have been successfully updated.`,
      });
    }, 800);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className={isMobile ? "text-lg" : "text-xl"}>School Information</CardTitle>
              <CardDescription>Update your school details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">School Name</label>
              <Input placeholder="Driving Excellence" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address
              </label>
              <Input placeholder="contact@drivingexcellence.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Number
              </label>
              <Input placeholder="(123) 456-7890" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Address
              </label>
              <Input placeholder="123 Main Street, City" />
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 w-full" 
              onClick={() => handleSaveChanges("School information")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Payment Settings</CardTitle>
              <CardDescription>Configure payment options</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <CardIcon className="h-4 w-4 text-gray-500" />
                Stripe API Key
              </label>
              <Input type="password" placeholder="•••• •••• •••• ••••" />
              <p className="text-xs text-gray-500">This is your Stripe secret key. Keep it secure.</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Currency
              </label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Payment Methods</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardIcon className="h-4 w-4 text-gray-500" />
                    <label htmlFor="credit-card">Credit/Debit Cards</label>
                  </div>
                  <Switch id="credit-card" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Apple className="h-4 w-4 text-gray-500" />
                    <label htmlFor="apple-pay">Apple Pay</label>
                  </div>
                  <Switch id="apple-pay" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-gray-500" />
                    <label htmlFor="google-pay">Google Pay</label>
                  </div>
                  <Switch id="google-pay" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <label htmlFor="mobile-pay">Mobile Payment</label>
                  </div>
                  <Switch id="mobile-pay" />
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 w-full"
              onClick={() => handleSaveChanges("Payment")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
