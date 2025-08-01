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

    // Get API key from headers
    const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API key" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Hash the API key
    const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(apiKey))
    const hashHex = Array.from(new Uint8Array(keyHash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")

    // Verify API key
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("user_id")
      .eq("key_hash", hashHex)
      .single()

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user data and check plan limits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan_details")
      .eq("id", keyData.user_id)
      .single()

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "User not found" }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const plan = userData.plan_details
    if (plan.monthlyPrintCount >= plan.maxPrints) {
      return new Response(
        JSON.stringify({ error: "Monthly print limit exceeded" }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const body = await req.json()
    const { file_content_base64, printer_id, title } = body

    if (!file_content_base64 || !printer_id || !title) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: file_content_base64, printer_id, title" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert base64 to buffer
    const buffer = Uint8Array.from(atob(file_content_base64), c => c.charCodeAt(0))
    const fileName = `print_jobs/${keyData.user_id}/${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("print-files")
      .upload(fileName, buffer, { 
        contentType: "application/pdf",
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: "File upload failed" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create print job record
    const { data: jobData, error: jobError } = await supabase
      .from("print_jobs")
      .insert({
        user_id: keyData.user_id,
        printer_id,
        file_storage_path: fileName,
        title,
        status: "pending",
      })
      .select()
      .single()

    if (jobError) {
      console.error('Job creation error:', jobError)
      return new Response(
        JSON.stringify({ error: "Failed to create print job" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Increment print count
    await supabase.rpc("increment_print_count", { user_id: keyData.user_id })

    return new Response(
      JSON.stringify({ 
        jobId: jobData.id, 
        status: "enqueued",
        message: "Print job created successfully"
      }), 
      { 
        status: 202, 
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