require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Klient podstawowy (do logowania)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Klient admina (do zarządzania użytkownikami - SERVICE_ROLE)
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabase, supabaseAdmin };