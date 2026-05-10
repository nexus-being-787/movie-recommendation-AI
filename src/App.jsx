import React, { useState } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // DIAGNOSTIC: Check what key Vite actually loaded
  const rawKey = import.meta.env.VITE_OPENROUTER_API_KEY || "MISSING_KEY";
  const maskedKey = rawKey.length > 15 
    ? `${rawKey.substring(0, 12)}...${rawKey.substring(rawKey.length - 4)}` 
    : rawKey;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    try {
      // 1. Fire API calls concurrently
      const [openRouterRes, unsplashRes] = await Promise.all([
        fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.href,
            "X-Title": "MovieRecommender"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert movie analyst. Return raw JSON strictly matching this format: {"targetMovie":{"title":"Exact Title","genre":"Genre","analysis":"2-sentence vibe."},"recommendations":[{"title":"Movie","genre":"Genre","reason":"1-sentence reason."}]}`
              },
              { role: "user", content: `Analyze: ${searchQuery}` }
            ]
          })
        }).catch(() => ({ ok: false, status: 'Network Error' })), // Catch complete network failure
        
        fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery + " movie")}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}&per_page=1`)
          .catch(() => ({ ok: false })) 
      ]);

      let parsedData;

      // 2. CHECK IF OPENROUTER FAILED (401, 402, Network Error)
      if (!openRouterRes.ok) {
        console.warn(`OpenRouter Failed (${openRouterRes.status}). Activating Demo Fallback.`);
        setError(`API Warning: ${openRouterRes.status}. Using offline fallback engine for demo.`);
        
        //  FALLBACK AI SIMULATION 
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate AI "thinking" time
        parsedData = {
          targetMovie: {
            title: searchQuery.toUpperCase(),
            genre: "Cinematic Experience",
            analysis: `An incredible journey that pushes the boundaries of storytelling. "${searchQuery}" is widely recognized for its visual direction, intense pacing, and unforgettable character arcs.`
          },
          recommendations: [
            { title: "Inception", genre: "Sci-Fi / Thriller", reason: "Similar mind-bending narrative structure." },
            { title: "The Dark Knight", genre: "Action", reason: "Shares a gritty, high-stakes atmosphere." },
            { title: "Interstellar", genre: "Sci-Fi", reason: "Explores deep human emotions against massive odds." },
            { title: "Parasite", genre: "Drama / Thriller", reason: "Masterful pacing and unexpected plot twists." }
          ]
        };
      } else {
        // API worked! Parse the real data.
        const openRouterData = await openRouterRes.json();
        const rawContent = openRouterData.choices[0].message.content;
        const cleanJson = rawContent.substring(rawContent.indexOf('{'), rawContent.lastIndexOf('}') + 1);
        parsedData = JSON.parse(cleanJson);
      }

      // 3. Process Unsplash Image
      let imageUrl = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop';
      if (unsplashRes.ok) {
        const unsplashData = await unsplashRes.json();
        if (unsplashData.results && unsplashData.results.length > 0) {
          imageUrl = unsplashData.results[0].urls.regular;
        }
      }

      setResult({ ...parsedData, imageUrl });

    } catch (err) {
      console.error(err);
      setError("System critical failure. Check console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased py-10 px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Diagnostic Bar - Shows you exactly what key Vite loaded */}
        <div className="bg-gray-800 text-xs text-gray-400 p-2 rounded mb-6 text-center border border-gray-700">
          <strong>Diagnostic Mode Active</strong> | Loaded OpenRouter Key: <span className="font-mono text-cyan-400">{maskedKey}</span>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4 tracking-tight">
            AI CineMatch
          </h1>
          <p className="text-gray-400 text-lg">Powered by GPT-4o-mini & Unsplash</p>
        </header>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Enter a movie name (e.g., The Matrix)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500 text-lg"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing || !searchQuery.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg text-lg flex justify-center items-center min-w-[140px]"
          >
            {isAnalyzing ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Analyze"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-6 py-4 rounded-xl text-center mb-8 max-w-2xl mx-auto font-mono text-sm break-words">
            {error}
          </div>
        )}

        {result && (
          <div className="animate-fade-in-up">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-cyan-900/50 shadow-2xl mb-12 overflow-hidden flex flex-col md:flex-row">
              <img 
                src={result.imageUrl} 
                alt={result.targetMovie.title} 
                className="w-full md:w-1/3 h-64 md:h-auto object-cover"
              />
              <div className="p-8 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-white">{result.targetMovie.title}</h2>
                  <span className="bg-cyan-900 text-cyan-200 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                    {result.targetMovie.genre}
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {result.targetMovie.analysis}
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Because you searched for {result.targetMovie.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-white">{rec.title}</h4>
                    <span className="text-xs font-semibold text-gray-400 border border-gray-600 px-2 py-1 rounded ml-2 whitespace-nowrap">
                      {rec.genre}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}