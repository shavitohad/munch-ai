const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const accessToken = process.env.SUPABASE_ACCESS_TOKEN

const SQL = `
CREATE TABLE IF NOT EXISTS favourites (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text        NOT NULL,
  recipe_id   text        NOT NULL,
  recipe_data jsonb       NOT NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ratings (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text        NOT NULL,
  recipe_id  text        NOT NULL,
  rating     integer     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);
`

async function main() {
  if (!supabaseUrl || !accessToken) {
    console.log(
      'ℹ️  DB setup skipped — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ACCESS_TOKEN to auto-create tables.',
    )
    console.log('Run this SQL manually in the Supabase dashboard SQL editor:\n')
    console.log(SQL)
    return
  }

  // Extract project ref from https://<ref>.supabase.co
  const ref = new URL(supabaseUrl).hostname.split('.')[0]

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: SQL }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('❌ Failed to create tables:', body)
    process.exit(1)
  }

  console.log('✅ Database tables created (or already exist)')
}

main().catch((err: Error) => {
  console.error('❌ Setup failed:', err.message)
  process.exit(1)
})
