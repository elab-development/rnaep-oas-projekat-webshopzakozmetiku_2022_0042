import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/api/campaigns')
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleValidatePromo = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/campaigns/promo/validate', { code: promoCode });
      if (response.data.valid) {
        setMessage(`Kôd je validan! Ostvarili ste ${response.data.discount}% popusta.`);
      } else {
        setMessage('Uneseni kôd nije validan.');
      }
    } catch (err) {
      console.log(err);
      setMessage('Greška prilikom validacije promo koda.');
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      
      <div className="text-center pt-12 pb-16">
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#222222] mb-3 font-serif">
          Offers & Campaigns
        </h1>
        <div className="flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-[#888888]">
          <span className="hover:text-[#222222] cursor-pointer">Glow.</span>
          <span>/</span>
          <span className="hover:text-[#222222] cursor-pointer">Promotions</span>
          <span>/</span>
          <span className="text-[#222222] font-medium">Active Campaigns</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        <div className="md:col-span-7 space-y-8">
          <div className="border-b border-[#F0EFEA] pb-4">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#222222]">
              Aktivne Ponude ({campaigns.length})
            </h2>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-[#F9F9F9] p-12 text-center rounded-xs">
              <p className="text-xs text-[#888888] tracking-wide font-light">
                Trenutno nema aktivnih sezonskih kampanja. Dođite uskoro!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {campaigns.map(camp => (
                <div key={camp.id} className="bg-[#F9F9F9] p-8 relative overflow-hidden group flex flex-col justify-between min-h-45">
                  
                  <div className="absolute top-0 left-0 bg-[#E05A47] text-white text-[9px] font-medium px-3 py-1 tracking-widest uppercase">
                    Active
                  </div>

                  <div className="pt-4">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#222222]">GLOW. EXCLUSIVE</span>
                    <h3 className="text-xl font-serif text-[#222222] tracking-wide mt-1 mb-3">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-[#555555] font-light leading-relaxed max-w-xl">
                      {camp.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAE9E4] flex justify-between items-center">
                    <span className="text-[10px] text-[#888888] uppercase tracking-widest font-light">
                      Važi do: <strong className="font-medium text-[#222222]">{camp.endDate}</strong>
                    </span>
                    <span className="text-xs text-[#222222] font-light group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-5 sticky top-24">
          <div className="border border-[#F0EFEA] p-8 bg-white shadow-xs">
            
            <div className="mb-6">
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#222222]">
                Iskoristi Promo Kôd
              </h3>
              <p className="text-[11px] text-[#888888] font-light mt-1">
                Unesite vaš vaučer kôd kako biste umanjili ukupan iznos korpe.
              </p>
            </div>

            <form onSubmit={handleValidatePromo} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="NPR. GLOWGLAM20" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)} 
                  required
                  className="w-full bg-[#F9F9F9] border border-[#EAE9E4] px-4 py-3.5 text-xs tracking-widest uppercase font-medium focus:outline-none focus:border-[#222222] placeholder:text-[#CCCCCC] placeholder:font-normal text-[#222222]" 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-[#222222] text-white py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors duration-300"
              >
                Primeni Kôd
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-3 text-center text-xs tracking-wide font-light border ${
                message.includes('validan!') 
                  ? 'bg-[#F2F8F4] border-[#D1E7DD] text-[#155724]' 
                  : 'bg-[#FFF3CD] border-[#FFEBAA] text-[#856404]'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 text-center border-t border-[#F0EFEA] pt-4">
              <span className="text-[10px] uppercase tracking-widest text-[#BBBBBB] font-light">
                * Jedan kôd je važeći po porudžbini.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}