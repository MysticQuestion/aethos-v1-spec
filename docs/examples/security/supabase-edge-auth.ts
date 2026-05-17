// Supabase Edge Function auth guard for AI-credit-consuming functions such as
// generate-workshop and generate-profile. Adapt in the implementation repo.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function requireSupabaseUser(req: Request) {
  const authHeader = req.headers.get('authorization') ?? '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return { error: jsonResponse({ error: 'missing bearer token' }, 401) };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) {
    return { error: jsonResponse({ error: 'server auth configuration missing' }, 500) };
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { error: jsonResponse({ error: 'invalid bearer token' }, 401) };
  }

  return { user: data.user, supabase };
}

// Usage inside an Edge Function:
// Deno.serve(async (req) => {
//   if (req.method !== 'POST') return jsonResponse({ error: 'method not allowed' }, 405);
//   const auth = await requireSupabaseUser(req);
//   if ('error' in auth) return auth.error;
//   // Continue with AI generation for auth.user.id only.
// });
