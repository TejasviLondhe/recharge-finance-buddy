
import { supabase } from "@/integrations/supabase/client";

export interface PhonePePaymentRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: string;
    targetApp?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: any;
  };
}

class PhonePeService {
  private merchantId = 'PHONEPE_MERCHANT_ID'; // This should be configured in admin settings
  private apiKey = 'PHONEPE_API_KEY'; // This should be stored securely
  private baseUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox'; // Use production URL for live

  generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  async initiatePayment(
    amount: number,
    userId: string,
    planId: string,
    planName: string,
    isRecurring: boolean = false
  ): Promise<{ paymentUrl: string; transactionId: string }> {
    try {
      const transactionId = this.generateTransactionId();
      
      // Call our edge function to initiate PhonePe payment
      const { data, error } = await supabase.functions.invoke('phonepe-payment', {
        body: {
          amount: amount * 100, // Convert to paise
          transactionId,
          userId,
          planId,
          planName,
          isRecurring,
          redirectUrl: `${window.location.origin}/payment-success`,
          callbackUrl: `${window.location.origin}/api/phonepe-callback`
        }
      });

      if (error) throw error;

      return {
        paymentUrl: data.paymentUrl,
        transactionId
      };
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('phonepe-verify', {
        body: { transactionId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw new Error('Failed to verify payment');
    }
  }

  async setupRecurringPayment(
    planId: string,
    userId: string,
    totalAmount: number,
    emiAmount: number,
    emiCount: number
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('setup-recurring-payment', {
        body: {
          planId,
          userId,
          totalAmount,
          emiAmount,
          emiCount
        }
      });

      if (error) throw error;
      return data.recurringId;
    } catch (error) {
      console.error('Recurring payment setup failed:', error);
      throw new Error('Failed to setup recurring payment');
    }
  }
}

export const phonePeService = new PhonePeService();
