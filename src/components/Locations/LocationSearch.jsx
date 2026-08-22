import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Loader2, X, Globe } from 'lucide-react';
import { INITIAL_LOCATIONS, SEARCH_DATABASE } from '../../data/mockLocations';
import { searchGlobalLocations } from '../../services/weatherService';

export default function LocationSearch({ onClose, onSelect }) {
  const { setActiveCity } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle Search Input with debounce for Live WeatherAPI / Open-Meteo geocoding
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Immediate local match for instant feel
    const qLower = query.toLowerCase();
    const localMatches = SEARCH_DATABASE.filter(loc =>
      loc.name.toLowerCase().includes(qLower) ||
      loc.country.toLowerCase().includes(qLower) ||
      loc.region.toLowerCase().includes(qLower)
    );
    setResults(localMatches);

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const apiResults = await searchGlobalLocations(query);
        if (apiResults && apiResults.length > 0) {
          // Merge local and API results removing duplicates
          const combined = [...apiResults];
          localMatches.forEach(lm => {
            if (!combined.some(c => c.name.toLowerCase() === lm.name.toLowerCase() && c.country.toLowerCase() === lm.country.toLowerCase())) {
              combined.push(lm);
            }
          });
          setResults(combined);
        }
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handlePick = (loc) => {
    setActiveCity(loc);
    if (onSelect) onSelect(loc);
    if (onClose) onClose();
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      handlePick(results[0]);
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-sky-400 absolute left-4 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search any global city, state, country or coordinates (e.g. Chennai, London, India)..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/40 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans shadow-lg"
        />
        {isSearching ? (
          <Loader2 className="w-4 h-4 text-sky-400 animate-spin absolute right-4" />
        ) : query ? (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Auto-suggest dropdown list */}
      {query.trim().length > 0 && (
        <div className="mt-2 glass-card p-2 rounded-2xl border border-sky-500/30 shadow-2xl space-y-1 animate-fadeIn max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((loc) => (
              <div
                key={loc.id || `${loc.name}-${loc.lat}`}
                onClick={() => handlePick(loc)}
                className="p-3 rounded-xl hover:bg-sky-500/20 cursor-pointer flex items-center justify-between text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-sky-500/30 text-sky-400 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-sky-300 transition-colors">
                      {loc.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {[loc.region, loc.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono-telemetry text-xs">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>{loc.lat ? `${loc.lat.toFixed(1)}°, ${loc.lon.toFixed(1)}°` : ''}</span>
                </div>
              </div>
            ))
          ) : !isSearching ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching cities found for &quot;{query}&quot;. Try typing city or country name.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
