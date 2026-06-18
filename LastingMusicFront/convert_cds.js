import fs from 'fs';

// Helper function to sleep/delay between API calls
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Clean search query by removing suffixes in parentheses/brackets
const cleanSearchQuery = (text) => {
  return text
    .replace(/\s*[\(\[][^\)\]]*(edition|special|anniversary|collector|deluxe|vol|volume|dvd|remaster|live|202\d|19\d\d|original|soundtrack)[^\)\]]*[\)\]]/gi, '')
    .replace(/["']/g, '')
    .trim();
};

// 0. Fetch Access Token from Spotify API
const getSpotifyToken = async (clientId, clientSecret) => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (response.ok) {
    const data = await response.json();
    return data.access_token;
  } else {
    const errorText = await response.text();
    throw new Error(`Error de credenciales en Spotify: ${errorText}`);
  }
};

// 1. Search and Fetch details from Spotify API
const searchSpotify = async (artist, title, token) => {
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist + ' ' + title)}&type=album&limit=1`;
  const response = await fetch(searchUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.albums && data.albums.items && data.albums.items.length > 0) {
      const album = data.albums.items[0];
      
      // Fetch tracklist
      const tracksUrl = `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=50`;
      const tracksResponse = await fetch(tracksUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let tracklist = ['Track 1'];
      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json();
        if (tracksData.items && tracksData.items.length > 0) {
          tracklist = tracksData.items.map(t => t.name);
        }
      }

      // Fetch artist details to get genres (Spotify does not attach genres to the album object directly)
      let genre = 'Otros';
      if (album.artists && album.artists.length > 0) {
        const artistUrl = `https://api.spotify.com/v1/artists/${album.artists[0].id}`;
        const artistResponse = await fetch(artistUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (artistResponse.ok) {
          const artistData = await artistResponse.json();
          if (artistData.genres && artistData.genres.length > 0) {
            genre = artistData.genres[0];
            genre = genre.charAt(0).toUpperCase() + genre.slice(1);
          }
        }
      }

      return {
        genre: genre,
        releaseYear: album.release_date ? parseInt(album.release_date.substring(0, 4), 10) : 2000,
        coverUrl: album.images && album.images.length > 0 ? album.images[0].url : null,
        tracklist: tracklist
      };
    }
  }
  return null;
};

// 2. Fetch from Discogs API (requires token)
const searchDiscogs = async (artist, title, token) => {
  const searchUrl = `https://api.discogs.com/database/search?artist=${encodeURIComponent(artist)}&release_title=${encodeURIComponent(title)}&type=release&per_page=1`;
  const response = await fetch(searchUrl, {
    headers: {
      'Authorization': `Discogs token=${token}`,
      'User-Agent': 'LastingMusicMockup/1.0'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const release = data.results[0];
      const releaseUrl = `https://api.discogs.com/releases/${release.id}`;
      const releaseResponse = await fetch(releaseUrl, {
        headers: {
          'Authorization': `Discogs token=${token}`,
          'User-Agent': 'LastingMusicMockup/1.0'
        }
      });
      if (releaseResponse.ok) {
        const releaseData = await releaseResponse.json();
        const tracks = releaseData.tracklist 
          ? releaseData.tracklist.filter(t => t.title && t.type_ === 'track').map(t => t.title)
          : [];
        let genre = 'Otros';
        if (releaseData.genres && releaseData.genres.length > 0) {
          genre = releaseData.genres[0];
        } else if (releaseData.styles && releaseData.styles.length > 0) {
          genre = releaseData.styles[0];
        }
        let coverUrl = null;
        if (releaseData.images && releaseData.images.length > 0) {
          const primaryImage = releaseData.images.find(img => img.type === 'primary') || releaseData.images[0];
          coverUrl = primaryImage.uri || primaryImage.resource_url;
        }
        return {
          genre: genre.charAt(0).toUpperCase() + genre.slice(1),
          releaseYear: releaseData.year || 2000,
          coverUrl: coverUrl,
          tracklist: tracks.length > 0 ? tracks : ['Track 1']
        };
      }
    }
  }
  return null;
};

// 3. Fetch from iTunes API (free, public)
const searchITunes = async (artist, title) => {
  const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + title)}&media=music&entity=album&limit=1`;
  const response = await fetch(searchUrl);
  if (response.ok) {
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const album = data.results[0];
      let tracklist = ['Track 1'];

      if (album.collectionId) {
        const lookupUrl = `https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song`;
        const lookupResp = await fetch(lookupUrl);
        if (lookupResp.ok) {
          const lookupData = await lookupResp.json();
          const tracks = lookupData.results
            .filter(item => item.wrapperType === 'track')
            .map(item => item.trackName);
          if (tracks.length > 0) {
            tracklist = tracks;
          }
        }
      }

      return {
        genre: album.primaryGenreName || 'Otros',
        releaseYear: album.releaseDate ? parseInt(album.releaseDate.substring(0, 4), 10) : 2000,
        coverUrl: album.artworkUrl100 ? album.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg') : null,
        tracklist: tracklist
      };
    }
  }
  return null;
};

// 4. Fetch from Deezer API (free, public)
const searchDeezer = async (artist, title) => {
  const searchUrl = `https://api.deezer.com/search/album?q=${encodeURIComponent(artist + ' ' + title)}&limit=1`;
  const response = await fetch(searchUrl);
  if (response.ok) {
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const album = data.data[0];
      const albumUrl = `https://api.deezer.com/album/${album.id}`;
      const albumResponse = await fetch(albumUrl);
      if (albumResponse.ok) {
        const albumData = await albumResponse.json();
        const tracks = albumData.tracks && albumData.tracks.data 
          ? albumData.tracks.data.map(t => t.title) 
          : [];
        return {
          genre: albumData.genres && albumData.genres.data && albumData.genres.data.length > 0 
            ? albumData.genres.data[0].name 
            : 'Otros',
          releaseYear: albumData.release_date ? parseInt(albumData.release_date.substring(0, 4), 10) : 2000,
          coverUrl: albumData.cover_xl || albumData.cover_big || albumData.cover_medium || null,
          tracklist: tracks.length > 0 ? tracks : ['Track 1']
        };
      }
    }
  }
  return null;
};

// Cascade orchestrator
const fetchCDMetadata = async (artist, title, spotifyToken, discogsToken) => {
  const cleanTitle = cleanSearchQuery(title);
  const cleanArtist = cleanSearchQuery(artist);

  // 1. Try Spotify if token is available
  if (spotifyToken) {
    try {
      const data = await searchSpotify(cleanArtist, cleanTitle, spotifyToken);
      if (data && data.coverUrl) {
        console.log(`   🟢 Encontrado en Spotify`);
        return data;
      }
    } catch (e) {
      console.warn(`   ⚠️ Error en Spotify para "${title}":`, e.message);
    }
  }

  // 2. Try Discogs if token is available
  if (discogsToken) {
    try {
      const data = await searchDiscogs(cleanArtist, cleanTitle, discogsToken);
      if (data && data.coverUrl) {
        console.log(`   💿 Encontrado en Discogs`);
        return data;
      }
    } catch (e) {
      console.warn(`   ⚠️ Error en Discogs para "${title}":`, e.message);
    }
  }

  // 3. Try iTunes
  try {
    const data = await searchITunes(cleanArtist, cleanTitle);
    if (data && data.coverUrl) {
      console.log(`   🍏 Encontrado en iTunes`);
      return data;
    }
  } catch (e) {
    console.warn(`   ⚠️ Error en iTunes para "${title}":`, e.message);
  }

  // 4. Try Deezer (Fallback)
  try {
    const data = await searchDeezer(cleanArtist, cleanTitle);
    if (data && data.coverUrl) {
      console.log(`   📻 Encontrado en Deezer`);
      return data;
    }
  } catch (e) {
    console.warn(`   ⚠️ Error en Deezer para "${title}":`, e.message);
  }

  // 5. Try fallback search with original strings if cleaned ones failed
  if (cleanTitle !== title || cleanArtist !== artist) {
    if (spotifyToken) {
      try {
        const data = await searchSpotify(artist, title, spotifyToken);
        if (data && data.coverUrl) {
          console.log(`   🟢 Encontrado en Spotify (Búsqueda fallback con texto original)`);
          return data;
        }
      } catch (e) {}
    }

    try {
      const data = await searchITunes(artist, title);
      if (data && data.coverUrl) {
        console.log(`   🍏 Encontrado en iTunes (Búsqueda fallback con texto original)`);
        return data;
      }
    } catch (e) {}

    try {
      const data = await searchDeezer(artist, title);
      if (data && data.coverUrl) {
        console.log(`   📻 Encontrado en Deezer (Búsqueda fallback con texto original)`);
        return data;
      }
    } catch (e) {}
  }

  console.log(`   ❌ No se encontraron portadas ni datos para "${title}".`);
  return null;
};

async function run() {
  const filePath = './src/data/lista.js';
  const outputPath = './src/data/cds.js';
  
  const discogsToken = process.env.DISCOGS_TOKEN || '';
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID || '';
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  
  let spotifyToken = '';

  if (spotifyClientId && spotifyClientSecret) {
    console.log('🔑 Credenciales de Spotify detectadas. Autenticando...');
    try {
      spotifyToken = await getSpotifyToken(spotifyClientId, spotifyClientSecret);
      console.log('✅ Autenticación exitosa con Spotify API.');
    } catch (error) {
      console.error('❌ Error de autenticación con Spotify:', error.message);
    }
  }

  if (discogsToken) {
    console.log('🔑 Token de Discogs detectado.');
  }

  console.log('📖 Leyendo lista antigua (src/data/lista.js)...');
  let oldCds;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonStr = fileContent
      .replace(/^\s*export\s+const\s+ListaCds\s*=\s*/, '')
      .trim()
      .replace(/;\s*$/, '');
    oldCds = JSON.parse(jsonStr);
  } catch (error) {
    console.error('❌ Error al leer o procesar lista.js:', error.message);
    process.exit(1);
  }

  console.log(`🚀 Se encontraron ${oldCds.length} CDs para actualizar.`);
  console.log('🎵 Iniciando conversión y consulta de metadatos multicanal...');

  const newCds = [];

  const getRandomCoverGradient = (g) => {
    if (!g) return 'from-violet-800 via-neutral-950 to-neutral-900';
    const genreLower = g.toLowerCase();
    if (genreLower.includes('metal') || genreLower.includes('death')) {
      return 'from-red-950 via-neutral-950 to-red-900';
    } else if (genreLower.includes('rap') || genreLower.includes('hip')) {
      return 'from-neutral-700 via-neutral-900 to-black';
    } else if (genreLower.includes('rock') || genreLower.includes('pop')) {
      return 'from-pink-900 via-rose-950 to-neutral-950';
    } else if (genreLower.includes('jazz')) {
      return 'from-amber-600 via-orange-950 to-neutral-950';
    } else if (genreLower.includes('electro') || genreLower.includes('dance') || genreLower.includes('synth') || genreLower.includes('electronic')) {
      return 'from-purple-900 via-indigo-950 to-black';
    }
    return 'from-violet-800 via-neutral-950 to-neutral-900';
  };

  for (let i = 0; i < oldCds.length; i++) {
    const cd = oldCds[i];
    console.log(`[${i + 1}/${oldCds.length}] Procesando: "${cd.title}" - ${cd.artist}...`);

    let meta = await fetchCDMetadata(cd.artist, cd.title, spotifyToken, discogsToken);

    const genre = meta ? meta.genre : 'Otros';
    const releaseYear = meta ? meta.releaseYear : 2000;
    const coverUrl = meta ? meta.coverUrl : null;
    const tracklist = meta ? meta.tracklist : ['Track 1'];

    const finalOrigin = cd.origin === 'Japón' ? 'Japón (Importado)' : cd.origin;
    const finalWaitTime = cd.status === 'encargo' ? '1-2 meses' : cd.status === 'transito' ? '2-3 semanas' : '2-4 días';
    const conditionStr = cd.condition ? `, Condición: ${cd.condition}` : '';
    const originStr = cd.origin ? `, Origen: ${cd.origin}` : '';
    const finalDescription = `Edición física oficial. Estilo: ${genre}${conditionStr}${originStr}. Lanzamiento físico original.`;

    newCds.push({
      id: cd.id,
      title: cd.title,
      artist: cd.artist,
      genre: genre,
      price: cd.price,
      status: cd.status,
      hasObi: cd.hasObi,
      releaseYear: releaseYear,
      origin: finalOrigin,
      waitTime: finalWaitTime,
      description: finalDescription,
      coverColor: getRandomCoverGradient(genre),
      coverUrl: coverUrl,
      tracklist: tracklist
    });

    // Small delay between calls to respect API limits (150ms)
    await sleep(150);
  }

  const uniqueGenres = ['Todos', ...new Set(newCds.map(c => c.genre))];

  console.log('✍️ Escribiendo resultados en src/data/cds.js...');
  const outputContent = `export const genres = ${JSON.stringify(uniqueGenres, null, 2)};

export const mockCDs = ${JSON.stringify(newCds, null, 2)};

export const mockOrders = [];
`;

  try {
    fs.writeFileSync(outputPath, outputContent, 'utf8');
    console.log('✅ ¡Conversión completada con éxito!');
    console.log(`🎉 Se actualizaron ${newCds.length} discos en src/data/cds.js.`);
  } catch (error) {
    console.error('❌ Error al escribir en cds.js:', error.message);
  }
}

run();
