import React from 'react';

const TICKER_ITEMS = [
  { pair: 'INSTITUTIONAL USD AUM', price: '$185,450,000 USD', change: '+3.82% MoM', up: true },
  { pair: 'GOLD / USD (XAU/USD)', price: '$2,654.80 USD', change: '+1.42%', up: true },
  { pair: 'USD FEDWIRE CLEARANCE', price: 'T+0 Instant USD', change: '100% VERIFIED', up: true },
  { pair: 'USD 10-TIER POOL', price: '$482,900 USD Payout', change: '+12.5%', up: true },
  { pair: 'USD PRIME SPREAD', price: '0.0 Pips USD', change: 'INSTITUTIONAL', up: true },
  { pair: 'USD OVERNIGHT REPO', price: '5.40% Annualized USD', change: 'TIER-1 LIQUIDITY', up: true },
  { pair: 'USD DIGITAL CUSTODY', price: '1:1 USD Full Reserve', change: 'SECURED', up: true },
  { pair: 'USD GLOBAL VOLUME (24H)', price: '$48,250,000 USD', change: '+8.14%', up: true },
];

export const UsdLiveTicker: React.FC = () => {
  return (
    <div className="relative z-30 bg-[#060709] border-b border-gold-500/20 text-[11px] overflow-hidden py-1.5 select-none shadow-sm">
      <div className="flex w-max animate-ticker items-center gap-8 px-4 font-mono">
        {/* Double array for seamless loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold text-slate-300">{item.pair}</span>
            <span className="text-gold-400 font-semibold">{item.price}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              item.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
            }`}>
              {item.change}
            </span>
            <span className="text-white/10 mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
