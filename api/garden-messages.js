const crypto = require('crypto');

// Nettoie le texte : enlève les caractères de contrôle et les espaces autour
const clean = (s) =>
  String(s || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim();

module.exports = async (req, res) => {
  try {
    // Vérifie que les 3 variables existent (affiche seulement les NOMS manquants)
    const missing = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'IP_SALT']
      .filter((k) => !process.env[k]);
    if (missing.length) {
      console.error('Variables manquantes :', missing.join(', '));
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ---------- LIRE les messages ----------
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('messages')
        .select('id, first_name, message, created_at')
        .eq('hidden', false)
        .order('created_at', { ascending: false })
        .limit(300);

      if (error) {
        console.error('Supabase GET :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
      return res.status(200).json(data);
    }

    // ---------- AJOUTER un message ----------
    if (req.method === 'POST') {
      const { firstName, message, website } = req.body || {};

      // Piège anti-robot : ce champ caché reste vide chez un humain
      if (website) return res.status(200).json({ ok: true });

      const name = clean(firstName);
      const text = clean(message);

      if (name.length < 1 || name.length > 20)
        return res.status(400).json({ error: 'Prénom invalide (1 à 20 caractères)' });
      if (text.length < 1 || text.length > 200)
        return res.status(400).json({ error: 'Message invalide (1 à 200 caractères)' });

      // Anti-spam : 3 messages max par visiteur toutes les 10 minutes
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const ipHash = crypto
        .createHash('sha256')
        .update(ip + process.env.IP_SALT)
        .digest('hex');

      const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', since);

      if ((count || 0) >= 3)
        return res.status(429).json({ error: 'Trop de messages, réessaie dans quelques minutes.' });

      const { data, error } = await supabase
        .from('messages')
        .insert({ first_name: name, message: text, ip_hash: ipHash })
        .select('id, first_name, message, created_at')
        .single();

      if (error) {
        console.error('Supabase INSERT :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      return res.status(201).json(data);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  } catch (err) {
    console.error('Erreur API garden-messages :', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};