// fetch-data.js
// Corre en GitHub Actions cada 60 segundos durante el Mundial
// Genera public/data.json con los partidos del día

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FOOTBALL_API_KEY;
const WC_CODE = 'WC'; // Código del Mundial en football-data.org

// Fecha de hoy en formato YYYY-MM-DD (hora Colombia UTC-5)
function todayColumbia() {
  const now = new Date();
  const col = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  return col.toISOString().split('T')[0];
}

// Fetcher genérico para la API
function fetchAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.football-data.org',
      path,
      method: 'GET',
      headers: { 'X-Auth-Token': API_KEY }
    };
    https.get(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON parse error: ' + body.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!API_KEY) {
    console.error('❌ Falta la variable FOOTBALL_API_KEY');
    process.exit(1);
  }

  const today = todayColumbia();
  console.log(`📅 Fetching partidos del Mundial para: ${today}`);

  // Traer partidos del día actual del Mundial
  const data = await fetchAPI(`/v4/competitions/${WC_CODE}/matches?dateFrom=${today}&dateTo=${today}`);

  // Agregar metadata útil para el ticker
  const output = {
    updatedAt: new Date().toISOString(),
    date: today,
    matches: (data.matches || []).map(m => ({
      id: m.id,
      status: m.status,           // SCHEDULED | TIMED | IN_PLAY | PAUSED | FINISHED
      minute: m.minute || null,
      utcDate: m.utcDate,
      stage: m.stage,
      group: m.group,
      homeTeam: {
        id: m.homeTeam.id,
        name: m.homeTeam.name,
        tla: m.homeTeam.tla,      // código 3 letras: COL, MEX, BRA...
        crest: m.homeTeam.crest
      },
      awayTeam: {
        id: m.awayTeam.id,
        name: m.awayTeam.name,
        tla: m.awayTeam.tla,
        crest: m.awayTeam.crest
      },
      score: {
        fullTime: {
          home: m.score?.fullTime?.home ?? null,
          away: m.score?.fullTime?.away ?? null
        },
        halfTime: {
          home: m.score?.halfTime?.home ?? null,
          away: m.score?.halfTime?.away ?? null
        }
      },
      venue: m.venue || null
    }))
  };

  // Guardar en public/data.json
  const outPath = path.join(__dirname, 'public', 'data.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`✅ data.json guardado con ${output.matches.length} partido(s)`);
  output.matches.forEach(m => {
    console.log(`   ${m.homeTeam.tla} vs ${m.awayTeam.tla} — ${m.status}`);
  });
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
