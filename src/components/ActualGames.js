import React from "react";

export default function ActualGames({
  isBlurred = false,
  games,
  userPredictions,
  predictionInputs,
  setPredictionInputs,
  submitPrediction
}) {
  if (!games || games.length === 0) return null;
  
  return (
    <div className={isBlurred ? "opacity-30 blur-[4px] pointer-events-none select-none mt-8" : "mt-8"}>
      {Array.isArray(games) && games.map(game => {
        if (!game || !game.id) return null;
        const userPred = userPredictions ? userPredictions[game.id] : null;
        return (
          <div key={game.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col items-center w-1/3">
                {game.team_a_logo && typeof game.team_a_logo === 'string' && <img src={game.team_a_logo} alt="Team A" className="w-14 h-14 mb-2 object-contain drop-shadow-md"/>}
                <span className="font-bold text-center text-xs text-zinc-300">{String(game.team_a || "")}</span>
              </div>
              <div className="text-2xl font-black text-amber-500 w-1/3 text-center">VS</div>
              <div className="flex flex-col items-center w-1/3">
                {game.team_b_logo && typeof game.team_b_logo === 'string' && <img src={game.team_b_logo} alt="Team B" className="w-14 h-14 mb-2 object-contain drop-shadow-md"/>}
                <span className="font-bold text-center text-xs text-zinc-300">{String(game.team_b || "")}</span>
              </div>
            </div>

            {!isBlurred && game.status === 'open' && !userPred && (
              <div className="flex flex-col items-center space-y-4 border-t border-zinc-800 pt-4">
                <div className="flex justify-center items-center space-x-3">
                  <input type="number" value={predictionInputs[game.id]?.a || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...(prev[game.id] || {}), a: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                  <span className="font-black text-zinc-500">-</span>
                  <input type="number" value={predictionInputs[game.id]?.b || ""} onChange={e => setPredictionInputs(prev => ({...prev, [game.id]: {...(prev[game.id] || {}), b: e.target.value}}))} className="w-16 p-3 rounded-lg bg-black border border-zinc-700 text-white text-center font-black focus:border-amber-500 outline-none" placeholder="0" />
                </div>
                <button onClick={() => submitPrediction(game.id)} className="w-full bg-amber-500 text-black py-3 rounded-xl font-black shadow-lg hover:bg-amber-400 transition-colors">ውጤት ላክ</button>
              </div>
            )}

            {!isBlurred && game.status === 'open' && userPred && (
              <div className="mt-4 text-center bg-black border border-amber-500/50 text-amber-500 text-sm font-bold p-3 rounded-xl">🔒 ግምትዎ ተቆልፏል: {String(userPred.predicted_score_a ?? '')} - {String(userPred.predicted_score_b ?? '')}</div>
            )}

            {!isBlurred && game.status === 'finished' && userPred && (
              <div className="mt-4 text-center border-t border-zinc-800 pt-4">
                <div className="text-sm font-bold text-zinc-400 mb-2">ትክክለኛ ውጤት: <span className="text-white">{String(game.final_score_a ?? '')} - {String(game.final_score_b ?? '')}</span></div>
                <div className={`p-3 rounded-xl text-sm font-black text-white ${userPred.predicted_score_a === game.final_score_a && userPred.predicted_score_b === game.final_score_b ? 'bg-green-600/80 border border-green-500' : 'bg-red-900/50 border border-red-800 text-red-200'}`}>
                  {userPred.predicted_score_a === game.final_score_a && userPred.predicted_score_b === game.final_score_b ? "🎉 አሸናፊ!" : `የእርስዎ ግምት: ${String(userPred.predicted_score_a ?? '')} - ${String(userPred.predicted_score_b ?? '')} ❌`}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
