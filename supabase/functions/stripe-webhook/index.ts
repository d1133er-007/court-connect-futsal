
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") || "";
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Verify webhook signature
    // In production, use a webhook secret
    // const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // For development, we'll skip signature verification
    const event = JSON.parse(body);
    
    console.log(`Processing stripe event: ${event.type}`);
    
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      
      if (bookingId) {
        // Update booking status to confirmed
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId);
          
        if (bookingError) {
          console.error('Error updating booking:', bookingError);
          throw new Error('Failed to update booking status');
        }
        
        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingId,
            user_id: session.client_reference_id || session.customer || 'anonymous',
            amount: session.amount_total / 100, // Convert back from cents to main currency
            currency: session.currency,
            status: 'completed',
            payment_method: 'stripe',
          });
          
        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
          throw new Error('Failed to create payment record');
        }
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
