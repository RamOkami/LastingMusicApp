import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import AdminForm from './admin/AdminForm';
import AdminPreview from './admin/AdminPreview';
import AdminCDTable from './admin/AdminCDTable';

export default function AdminPanel({ 
  onAddCD, 
  customCDs, 
  onDeleteCD, 
  onUpdateCD,
  setActiveSection 
}) {
  // Form State
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [status, setStatus] = useState('disponible');
  const [isJapanese, setIsJapanese] = useState(false);
  const [hasObi, setHasObi] = useState(false);
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [tracklistStr, setTracklistStr] = useState('');

  // Discogs Token State
  const [discogsToken, setDiscogsToken] = useState(() => {
    return localStorage.getItem('lasting_discogs_token') || '';
  });

  // Autocomplete Preview State
  const [isLoading, setIsLoading] = useState(false);
  const [autocompletePreview, setAutocompletePreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Save Token in LocalStorage
  useEffect(() => {
    localStorage.setItem('lasting_discogs_token', discogsToken);
  }, [discogsToken]);

  // Helper for gradient colors
  const getRandomCoverGradient = (g) => {
    if (!g) return 'from-neutral-800 via-neutral-950 to-neutral-900';
    const genreLower = g.toLowerCase();
    if (genreLower.includes('metal') || genreLower.includes('death')) {
      return 'from-neutral-950 via-neutral-900 to-neutral-950';
    } else if (genreLower.includes('rap') || genreLower.includes('hip')) {
      return 'from-neutral-700 via-neutral-900 to-black';
    } else if (genreLower.includes('rock') || genreLower.includes('pop')) {
      return 'from-neutral-800 via-neutral-900 to-neutral-950';
    } else if (genreLower.includes('jazz')) {
      return 'from-neutral-800 via-neutral-955 to-neutral-900';
    } else if (genreLower.includes('electro') || genreLower.includes('dance') || genreLower.includes('synth')) {
      return 'from-neutral-800 via-neutral-950 to-black';
    }
    return 'from-neutral-800 via-neutral-950 to-neutral-900';
  };

  // Handle Autocomplete (Discogs + iTunes cascade)
  const handleAutocomplete = async () => {
    if (!artist || !album) {
      setErrorMsg('Por favor, ingresa el Artista y Álbum antes de autocompletar.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setSearchResults([]);

    try {
      const resultsList = [];

      // 1. Fetch from iTunes (limit 5)
      try {
        const iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + album)}&media=music&entity=album&limit=5`;
        const iTunesResponse = await fetch(iTunesUrl);
        if (iTunesResponse.ok) {
          const iTunesData = await iTunesResponse.json();
          if (iTunesData.results && iTunesData.results.length > 0) {
            iTunesData.results.forEach(item => {
              resultsList.push({
                id: item.collectionId,
                source: 'itunes',
                title: item.collectionName,
                artist: item.artistName,
                coverUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg') : '',
                year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                genre: item.primaryGenreName,
                raw: item
              });
            });
          }
        }
      } catch (e) {
        console.warn('Error searching iTunes:', e);
      }

      // 2. Fetch from Discogs (limit 5)
      if (discogsToken) {
        try {
          const searchUrl = `https://api.discogs.com/database/search?artist=${encodeURIComponent(artist)}&release_title=${encodeURIComponent(album)}&type=release&per_page=5`;
          const searchResponse = await fetch(searchUrl, {
            headers: {
              'Authorization': `Discogs token=${discogsToken}`,
              'User-Agent': 'LastingMusicMockup/1.0'
            }
          });

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.results && searchData.results.length > 0) {
              searchData.results.forEach(item => {
                let itemYear = '';
                if (item.year) itemYear = item.year.toString();
                resultsList.push({
                  id: item.id,
                  source: 'discogs',
                  title: item.title.split(' - ')[1] || item.title,
                  artist: item.title.split(' - ')[0] || artist,
                  coverUrl: item.cover_image || '',
                  year: itemYear,
                  genre: item.genre ? item.genre[0] : '',
                  raw: item
                });
              });
            }
          }
        } catch (e) {
          console.warn('Error searching Discogs:', e);
        }
      }

      if (resultsList.length === 0) {
        throw new Error('No se encontraron lanzamientos en las bases de datos de iTunes ni Discogs con ese nombre. Por favor, ingresa los datos manualmente.');
      }

      setSearchResults(resultsList);
      setSuccessMsg('Se encontraron coincidencias. Por favor, selecciona el álbum correcto de la lista de abajo.');

    } catch (err) {
      console.warn(err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Select search result
  const handleSelectResult = async (result) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalGenre = result.genre || '';
      let finalYear = result.year || '';
      let finalCoverUrl = result.coverUrl || '';
      let finalTracks = [];
      let finalDescription = '';

      if (result.source === 'itunes') {
        const lookupUrl = `https://itunes.apple.com/lookup?id=${result.id}&entity=song`;
        const lookupResponse = await fetch(lookupUrl);
        if (lookupResponse.ok) {
          const lookupData = await lookupResponse.json();
          const trackResults = lookupData.results.filter(r => r.wrapperType === 'track');
          if (trackResults.length > 0) {
            finalTracks = trackResults.map(r => r.trackName);
          }
        }
        finalDescription = `Álbum oficial de ${result.artist} titulado "${result.title}" (Género: ${finalGenre || 'Música'}, Año: ${finalYear}). Importado en formato físico original.`;
      } else if (result.source === 'discogs') {
        const releaseUrl = `https://api.discogs.com/releases/${result.id}`;
        const headers = { 'User-Agent': 'LastingMusicMockup/1.0' };
        if (discogsToken) {
          headers['Authorization'] = `Discogs token=${discogsToken}`;
        }
        const releaseResponse = await fetch(releaseUrl, { headers });

        if (releaseResponse.ok) {
          const releaseData = await releaseResponse.json();

          if (releaseData.genres && releaseData.genres.length > 0) {
            const mainGenre = releaseData.genres[0];
            finalGenre = mainGenre.charAt(0).toUpperCase() + mainGenre.slice(1);
          } else if (releaseData.styles && releaseData.styles.length > 0) {
            const mainStyle = releaseData.styles[0];
            finalGenre = mainStyle.charAt(0).toUpperCase() + mainStyle.slice(1);
          }

          if (releaseData.year) {
            finalYear = releaseData.year.toString();
          }

          if (releaseData.tracklist && releaseData.tracklist.length > 0) {
            finalTracks = releaseData.tracklist
              .filter(t => t.title && t.type_ === 'track')
              .map(t => t.title);
          }

          const stylesStr = releaseData.styles ? releaseData.styles.join(', ') : '';
          finalDescription = `Edición física oficial. Estilo: ${stylesStr || 'Música'}. Lanzamiento físico original.`;

          if (releaseData.images && releaseData.images.length > 0) {
            const primaryImage = releaseData.images.find(img => img.type === 'primary') || releaseData.images[0];
            finalCoverUrl = primaryImage.uri || primaryImage.resource_url;
          }
        }

        // iTunes cover fallback
        if (!finalCoverUrl) {
          try {
            const iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(result.artist + ' ' + result.title)}&media=music&entity=album&limit=1`;
            const iTunesResponse = await fetch(iTunesUrl);
            if (iTunesResponse.ok) {
              const iTunesData = await iTunesResponse.json();
              if (iTunesData.results && iTunesData.results.length > 0) {
                const artwork100 = iTunesData.results[0].artworkUrl100;
                finalCoverUrl = artwork100.replace('100x100bb.jpg', '600x600bb.jpg');
              }
            }
          } catch (e) {
            console.warn('iTunes cover fallback error for Discogs:', e);
          }
        }
      }

      setGenre(finalGenre || 'Otros');
      setReleaseYear(finalYear || new Date().getFullYear().toString());
      setDescription(finalDescription || `Álbum de ${result.artist} titulado "${result.title}".`);
      setCoverUrl(finalCoverUrl);
      setTracklistStr(finalTracks.join('\n'));
      setAutocompletePreview(true);
      setSearchResults([]);

      setArtist(result.artist);
      setAlbum(result.title);

      setSuccessMsg('¡Datos cargados con éxito para el álbum seleccionado! Revisa y ajusta los campos si es necesario.');
      setTimeout(() => setSuccessMsg(''), 4000);

    } catch (err) {
      console.warn(err);
      setErrorMsg(`Error al cargar los detalles del álbum: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save CD to catalog
  const handleSaveCD = (e) => {
    e.preventDefault();
    if (!artist || !album || !price) {
      setErrorMsg('Artista, Álbum y Precio son requeridos.');
      return;
    }

    const tracklistArray = tracklistStr
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const finalGenre = genre.trim() || 'Varios';
    const finalYear = parseInt(releaseYear, 10) || new Date().getFullYear();
    const finalDescription = description.trim() || `Álbum de ${artist} titulado "${album}".`;
    
    const newCD = {
      id: `cd-custom-${Date.now()}`,
      title: album,
      artist: artist,
      genre: finalGenre,
      price: parseInt(price, 10),
      status: status,
      hasObi: hasObi,
      releaseYear: finalYear,
      origin: isJapanese ? 'Japón (Importado)' : 'USA',
      waitTime: status === 'encargo' ? '1-2 meses' : status === 'transito' ? '2-3 semanas' : '2-4 días',
      description: finalDescription,
      coverColor: getRandomCoverGradient(finalGenre),
      coverUrl: coverUrl.trim() || null,
      tracklist: tracklistArray.length > 0 ? tracklistArray : ['Track 1']
    };

    onAddCD(newCD);
    
    // Clear form
    setArtist('');
    setAlbum('');
    setIsJapanese(false);
    setHasObi(false);
    setPrice('');
    setGenre('');
    setReleaseYear('');
    setDescription('');
    setCoverUrl('');
    setTracklistStr('');
    setAutocompletePreview(false);
    setSuccessMsg('¡CD agregado con éxito al catálogo!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <section className="max-w-4xl mx-auto" aria-labelledby="admin-title">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-neutral-900 pb-4">
        <div className="text-left">
          <h1 id="admin-title" className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-8 h-8 text-white" /> Panel de Administración
          </h1>
          <p className="text-sm text-neutral-400 mt-1 font-mono">Agrega nuevos discos importados o en tránsito</p>
        </div>
        <button 
          onClick={() => setActiveSection('store')}
          className="text-xs text-neutral-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          Volver a la Tienda <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg mb-6 border bg-neutral-900/50 border-neutral-800 text-neutral-200 text-sm font-medium text-left">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form component */}
        <AdminForm
          artist={artist}
          setArtist={setArtist}
          album={album}
          setAlbum={setAlbum}
          status={status}
          setStatus={setStatus}
          isJapanese={isJapanese}
          setIsJapanese={setIsJapanese}
          hasObi={hasObi}
          setHasObi={setHasObi}
          price={price}
          setPrice={setPrice}
          genre={genre}
          setGenre={setGenre}
          releaseYear={releaseYear}
          setReleaseYear={setReleaseYear}
          description={description}
          setDescription={setDescription}
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          tracklistStr={tracklistStr}
          setTracklistStr={setTracklistStr}
          discogsToken={discogsToken}
          setDiscogsToken={setDiscogsToken}
          isLoading={isLoading}
          errorMsg={errorMsg}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleAutocomplete={handleAutocomplete}
          handleSelectResult={handleSelectResult}
          handleSaveCD={handleSaveCD}
          autocompletePreview={autocompletePreview}
        />

        {/* Live Preview component */}
        <AdminPreview
          artist={artist}
          album={album}
          genre={genre}
          releaseYear={releaseYear}
          description={description}
          coverUrl={coverUrl}
          tracklistStr={tracklistStr}
          hasObi={hasObi}
          getRandomCoverGradient={getRandomCoverGradient}
        />
      </div>

      {/* Added CDs Table component */}
      <AdminCDTable
        customCDs={customCDs}
        onDeleteCD={onDeleteCD}
        onUpdateCD={onUpdateCD}
      />

    </section>
  );
}
