
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PaymentSummaryProps {
  isLoading: boolean;
  totalRevenue: number;
  outstandingPayments: number;
  topPackages: [string, { count: number; percentage: number }][];
}

const PaymentSummary = ({
  isLoading,
  totalRevenue,
  outstandingPayments,
  topPackages
}: PaymentSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Summary</CardTitle>
          <CardDescription>Financial overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-3xl font-bold text-blue-800">${totalRevenue}</p>
              <p className="text-sm text-green-600">+14% from last month</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">YTD Revenue</p>
              <p className="text-3xl font-bold text-blue-800">${totalRevenue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Outstanding Payments</p>
              <p className="text-3xl font-bold text-amber-600">${outstandingPayments}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Popular Packages</CardTitle>
          <CardDescription>Sales breakdown by package</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {topPackages.length > 0 ? (
                topPackages.map(([packageName, data]) => (
                  <div key={packageName} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div 
                        className="bg-blue-600 h-5 rounded-full" 
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-sm font-medium">{packageName} ({data.percentage}%)</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No package data available
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSummary;
