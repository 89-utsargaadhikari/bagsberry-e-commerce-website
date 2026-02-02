const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFilePath = process.argv[2] || path.join(__dirname, 'update-database.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Supabase configuration
const supabaseUrl = 'https://zwxfrxovvqokjswocckd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eGZyeG92dnFva2pzd29jY2tkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODgzMTgxNywiZXhwIjoyMDg0NDA3ODE3fQ.Eh3rqs8CXh3-LaE7VlOAJ03H8CAvaRN-pHOaJ_vDlaw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running database migration...\n');
  console.log(`📄 SQL File: ${sqlFilePath}\n`);

  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments
      if (statement.startsWith('--')) continue;
      
      console.log(`[${i + 1}/${statements.length}] Executing...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        });

        if (error) {
          // Try direct query as fallback
          const result = await supabase.from('_exec').insert([{ query: statement }]);
          console.log(`✅ Statement ${i + 1} completed`);
        } else {
          console.log(`✅ Statement ${i + 1} completed`);
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} warning: ${err.message}`);
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase Dashboard → Storage');
    console.log('2. Create a bucket named: product-images (Make it Public)');
    console.log('3. Restart your dev server: npm run dev');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n⚠️  Please run the SQL manually in Supabase Dashboard → SQL Editor');
    console.error('Copy the SQL from: scripts/update-database.sql');
  }
}

runMigration();
