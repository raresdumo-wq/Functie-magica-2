const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/sync', async (req, res) => {
    try {
        const { data, error } = await supabase.from('db_state').select('*').eq('id', 1).single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/sync', async (req, res) => {
    try {
        // Am adaugat home si proiecte aici:
        const { users, content, lectii, docs, resp, home, proiecte } = req.body;
        const { error } = await supabase
            .from('db_state')
            .update({ users, content, lectii, docs, resp, home, proiecte })
            .eq('id', 1);
        if (error) throw error;
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { password } = req.body;
    if (password === "RAR") return res.json({ role: "Admin" });
    
    const { data } = await supabase.from('db_state').select('users').eq('id', 1).single();
    const user = (data.users || []).find(u => u.pass === password);
    
    if (user) res.json({ role: user.role });
    else res.status(401).send("Acces refuzat");
});

app.listen(process.env.PORT || 3000, () => console.log("Server pornit!"));