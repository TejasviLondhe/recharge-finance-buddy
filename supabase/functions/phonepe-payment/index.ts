
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      amount, 
      transactionId, 
      userId, 
      planId, 
      planName, 
      isRecurring,
      redirectUrl,
      callbackUrl 
    } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's phone number from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('phone_number')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.phone_number) {
      throw new Error('User phone number not found. Please update your profile.');
    }

    // PhonePe API configuration
    const merchantId = 'PGTESTPAYUAT'; // Test merchant ID
    const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Test salt key
    const saltIndex = 1;

    // Create payment payload
    const paymentPayload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount,
      redirectUrl,
      redirectMode: 'POST',
      callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Encode payload
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Create checksum
    const checksumString = `${base64Payload}/pg/v1/pay${saltKey}`;
    const checksum = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(checksumString))
      .then(buffer => Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')) + `###${saltIndex}`;

    // Make API call to PhonePe
    const response = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const result = await response.json();
    
    console.log('PhonePe API Response:', result);

    if (result.success && result.data) {
      // Store payment initiation in database
      const { error: dbError } = await supabase
        .from('user_recharges')
        .insert({
          user_id: userId,
          plan_id: planId,
          phone_number: profile.phone_number,
          total_amount: amount / 100,
          payment_status: 'pending',
          transaction_id: transactionId,
          is_financing: isRecurring
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to store payment record');
      }

      return new Response(
        JSON.stringify({
          success: true,
          paymentUrl: result.data.instrumentResponse.redirectInfo.url,
          transactionId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } else {
      console.error('PhonePe payment initiation failed:', result);
      throw new Error(result.message || 'Payment initiation failed');
    }

  } catch (error) {
    console.error('Payment initiation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
