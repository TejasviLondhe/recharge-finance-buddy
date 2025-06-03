
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
    const { planId, userId, totalAmount, emiAmount, emiCount } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create financing option record
    const { data: financing, error: financingError } = await supabase
      .from('financing_options')
      .insert({
        plan_id: planId,
        initial_payment: emiAmount,
        emi_amount: emiAmount,
        emi_count: emiCount,
        processing_fee: totalAmount * 0.02, // 2% processing fee
        gst_percentage: 18,
        discounted_price: totalAmount
      })
      .select()
      .single();

    if (financingError) {
      throw new Error('Failed to create financing option');
    }

    // Create EMI schedule
    const emiSchedule = [];
    for (let i = 1; i <= emiCount; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      
      emiSchedule.push({
        financing_id: financing.id,
        user_id: userId,
        emi_number: i,
        amount: emiAmount,
        due_date: dueDate.toISOString().split('T')[0],
        payment_status: i === 1 ? 'paid' : 'pending'
      });
    }

    const { error: emiError } = await supabase
      .from('emi_transactions')
      .insert(emiSchedule);

    if (emiError) {
      console.error('EMI schedule creation error:', emiError);
      throw new Error('Failed to create EMI schedule');
    }

    return new Response(
      JSON.stringify({
        success: true,
        recurringId: financing.id,
        message: 'Recurring payment setup completed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Recurring payment setup error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Setup failed',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
