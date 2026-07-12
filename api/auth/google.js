const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing credential' });

  try {
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64url').toString());
    const { sub: googleId, email, name, picture } = payload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Token expired' });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    let { data: user } = await supabase.from('users').select('*').eq('google_id', googleId).single();

    if (!user) {
      const { data: existing } = await supabase.from('users').select('*').eq('email', email).single();
      if (existing) {
        const { data } = await supabase.from('users').update({ google_id: googleId, avatar: picture || existing.avatar }).eq('id', existing.id).select().single();
        user = data;
      } else {
        const { data } = await supabase.from('users').insert({
          id: googleId, google_id: googleId, email, name, avatar: picture || '', provider: 'google',
          stats: {}, achievements: [], progress: []
        }).select().single();
        user = data;
      }
    }

    // Ensure auth user exists (ignore if already exists)
    await supabase.auth.admin.createUser({
      id: user.id, email, email_confirm: true,
      user_metadata: { full_name: name, avatar_url: picture }
    }).catch(() => {});

    // Generate magic link to extract token
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: 'magiclink', email
    });

    if (linkData?.properties?.action_link) {
      const url = new URL(linkData.properties.action_link);
      const token = url.searchParams.get('token');

      if (token) {
        return res.json({
          token,
          email,
          user: {
            id: user.id, email: user.email, name: user.name, avatar: user.avatar,
            provider: user.provider, stats: user.stats || {}, achievements: user.achievements || [],
            progress: user.progress || [], created_at: user.created_at
          }
        });
      }
    }

    return res.status(500).json({ error: 'Failed to generate auth token' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
