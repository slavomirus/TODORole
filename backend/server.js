require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabase, supabaseAdmin } = require('./db');
const { authenticate, requireAdmin } = require('./middleware');

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH ---
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    // Pobranie profilu (stworzonego przez trigger)
    const { data: profile } = await supabaseAdmin
        .from('profiles').select('*').eq('id', data.user.id).single();

    res.status(201).json({ message: "User created", user: { ...profile, email: data.user.email } });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: "Invalid credentials" });

    const role = data.session.user.user_metadata?.role || 'user';
    res.status(200).json({
        token: data.session.access_token,
        user: { id: data.user.id, email: data.user.email, role }
    });
});

// --- TASKS ---
app.get('/tasks', authenticate, async (req, res) => {
    const { data, error } = await req.supabaseUserClient.from('tasks').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/tasks', authenticate, async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const { data, error } = await req.supabaseUserClient
        .from('tasks').insert([{ title, user_id: req.user.id }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

app.patch('/tasks/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const { data, error } = await req.supabaseUserClient
        .from('tasks').update({ completed }).eq('id', id).select().single();
    if (error) return res.status(404).json({ error: "Task not found or access denied" });
    res.json(data);
});

app.delete('/tasks/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { error } = await req.supabaseUserClient.from('tasks').delete().eq('id', id);
    if (error) return res.status(404).json({ error: "Task not found or access denied" });
    res.status(204).send();
});

// --- ADMIN ---
app.get('/admin/users', authenticate, requireAdmin, async (req, res) => {
    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
// Nowy endpoint: Zmiana roli użytkownika (Admin -> User lub User -> Admin)
app.patch('/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // Zabezpieczenie: akceptujemy tylko role 'admin' lub 'user'
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Allowed: 'user', 'admin'" });
    }

    // Aktualizacja w bazie danych
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});
app.delete('/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
});

// --- START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});