
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { phonePeService } from '@/services/phonepeService';
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = searchParams.get('transactionId');
      
      if (!transactionId) {
        setStatus('failed');
        return;
      }

      try {
        const result = await phonePeService.verifyPayment(transactionId);
        
        if (result.success && result.data?.state === 'COMPLETED') {
          setStatus('success');
          setPaymentDetails(result.data);
          toast({
            title: "Payment Successful!",
            description: "Your recharge has been completed successfully."
          });
        } else {
          setStatus('failed');
          toast({
            title: "Payment Failed",
            description: result.message || "Payment could not be completed.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast({
          title: "Verification Failed",
          description: "Could not verify payment status.",
          variant: "destructive"
        });
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Verifying Payment</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we confirm your payment...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your recharge has been completed successfully.
              </p>
              {paymentDetails && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transaction ID: {paymentDetails.transactionId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amount: ₹{(paymentDetails.amount / 100).toFixed(2)}
                  </p>
                </div>
              )}
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </>
          )}
          
          {status === 'failed' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your payment could not be processed. Please try again.
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/plans')} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
