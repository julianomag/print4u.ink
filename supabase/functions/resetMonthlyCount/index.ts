import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, plan_details")

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return new Response(
        JSON.stringify({ error: "Failed to fetch users" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let updatedCount = 0
    const currentDate = new Date().toISOString()

    // Reset monthly count for each user
    for (const user of users || []) {
      const plan = user.plan_details
      plan.monthlyPrintCount = 0
      plan.billingCycleStart = currentDate

      const { error: updateError } = await supabase
        .from("users")
        .update({ plan_details: plan })
        .eq("id", user.id)

      if (!updateError) {
        updatedCount++
      } else {
        console.error(`Error updating user ${user.id}:`, updateError)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Monthly reset completed",
        updatedUsers: updatedCount,
        totalUsers: users?.length || 0
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 