
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // PhonePe configuration
    const merchantId = 'PGTESTPAYUAT';
    const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = 1;

    // Create checksum for verification
    const checksumString = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
    const checksum = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(checksumString))
      .then(buffer => Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')) + `###${saltIndex}`;

    // Verify payment with PhonePe
    const response = await fetch(
      `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': merchantId
        }
      }
    );

    const result = await response.json();
    console.log('Payment verification result:', result);

    if (result.success && result.data?.state === 'COMPLETED') {
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('user_recharges')
        .update({ 
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionId);

      if (updateError) {
        console.error('Database update error:', updateError);
      }

      // Process cashback and wallet operations if it's a 3-month plan
      const { data: rechargeData } = await supabase
        .from('user_recharges')
        .select('user_id, is_financing, total_amount')
        .eq('transaction_id', transactionId)
        .single();

      if (rechargeData?.is_financing) {
        // Add cashback for 3-month plans
        const { data: settings } = await supabase
          .from('admin_settings')
          .select('three_month_cashback')
          .eq('id', 1)
          .single();

        const cashbackAmount = settings?.three_month_cashback || 50;

        // Update wallet balance
        await supabase
          .from('wallet_balance')
          .upsert({
            user_id: rechargeData.user_id,
            balance: cashbackAmount
          }, {
            onConflict: 'user_id'
          });

        // Record cashback transaction
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: rechargeData.user_id,
            type: 'credit',
            amount: cashbackAmount,
            description: 'Cashback for 3-month plan',
            reference: transactionId
          });
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Verification failed',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
