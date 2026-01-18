const { createClient } = require('@supabase/supabase-js');
const { supabaseAdmin } = require('./db');

// Middleware uwierzytelniania
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(' ')[1];

    // Tworzymy klienta z kontekstem tego konkretnego tokena (dla RLS)
    const supabaseUserClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error } = await supabaseUserClient.auth.getUser();

    if (error || !user) return res.status(401).json({ error: "Invalid token" });

    req.user = user;
    req.supabaseUserClient = supabaseUserClient;
    next();
};

// Middleware admina
const requireAdmin = async (req, res, next) => {
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};

module.exports = { authenticate, requireAdmin };