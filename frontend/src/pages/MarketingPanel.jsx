import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MarketingPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const [campaignForm, setCampaignForm] = useState({
    name: '', description: '', start_date: '', end_date: ''
  });

  const [promoForm, setPromoForm] = useState({
    campaign_id: '', code: '', discount_value: '', max_uses: ''
  });

  useEffect(() => {
    if (!user || (user.role !== 'MARKETING_MANAGER' && user.role !== 'ADMIN')) {
      navigate('/');
    }
  }, [user, navigate]);

  const loadCampaigns = async () => {
    try {
      const res = await API.get('/api/campaigns');
      setCampaigns(res.data);
    } catch {
      console.error('Greška pri učitavanju kampanja');
    }
  };

  const loadPromoCodes = async () => {
    try {
      const res = await API.get('/api/campaigns/promo/all');
      setPromoCodes(res.data);
    } catch {
      console.error('Greška pri učitavanju promo kodova');
    }
  };

  const loadAnalytics = async () => {
    try {
      const [ordersRes, productsRes, recommendationsRes] = await Promise.all([
        API.get('/api/admin/orders'),
        API.get('/api/products'),
        API.get('/api/recommendations/general')
      ]);

      const orders = ordersRes.data;
      const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

      setAnalytics({
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        totalProducts: productsRes.data.length,
        totalRecommendations: recommendationsRes.data.reduce((sum, r) => sum + r.recommendedProducts.length, 0)
      });
    } catch {
      console.error('Greška pri učitavanju analitike');
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadCampaigns();
      if (activeTab === 'promo') await loadPromoCodes();
      if (activeTab === 'analytics') await loadAnalytics();
    };
    load();
  }, [activeTab]);

  const handleCampaignSubmit = async () => {
    try {
      await API.post('/api/campaigns', campaignForm);
      setCampaignForm({ name: '', description: '', start_date: '', end_date: '' });
      setShowCampaignForm(false);
      loadCampaigns();
    } catch {
      alert('Greška pri kreiranju kampanje.');
    }
  };

  const handlePromoSubmit = async () => {
    try {
      await API.post('/api/campaigns/promo', {
        ...promoForm,
        campaign_id: Number(promoForm.campaign_id),
        discount_value: Number(promoForm.discount_value),
        max_uses: Number(promoForm.max_uses)
      });
      setPromoForm({ campaign_id: '', code: '', discount_value: '', max_uses: '' });
      setShowPromoForm(false);
      loadPromoCodes();
      alert('Promo kod kreiran!');
    } catch {
      alert('Greška pri kreiranju promo koda.');
    }
  };

  const inputClass = "w-full border border-[#F0EFEA] px-3 py-2 text-xs focus:outline-none focus:border-[#222222] bg-white";

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      
      <div className="text-center pt-12 pb-8">
        <h1 className="text-3xl font-normal tracking-wide text-[#222222] font-serif">
          Marketing Panel
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#888888] mt-2">
          Upravljanje kampanjama i promo kodovima
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex border-b border-[#F0EFEA]">
          {['campaigns', 'promo', 'analytics'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-[#222222] text-[#222222]'
                  : 'text-[#888888] hover:text-[#222222]'
              }`}>
              {tab === 'campaigns' ? 'Kampanje' : tab === 'promo' ? 'Promo Kodovi' : 'Analitika'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {activeTab === 'campaigns' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#222222]">
                Kampanje ({campaigns.length})
              </h2>
              <button onClick={() => setShowCampaignForm(true)}
                className="bg-[#222222] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors">
                + Nova kampanja
              </button>
            </div>

            {showCampaignForm && (
              <div className="border border-[#F0EFEA] p-6 mb-8 bg-[#F9F9F9]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#222222] mb-6">Nova kampanja</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Naziv</label>
                    <input value={campaignForm.name} onChange={e => setCampaignForm({...campaignForm, name: e.target.value})} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Opis</label>
                    <textarea value={campaignForm.description} onChange={e => setCampaignForm({...campaignForm, description: e.target.value})} rows={3} className={inputClass + ' resize-none'} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Datum početka</label>
                    <input type="datetime-local" value={campaignForm.start_date} onChange={e => setCampaignForm({...campaignForm, start_date: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Datum završetka</label>
                    <input type="datetime-local" value={campaignForm.end_date} onChange={e => setCampaignForm({...campaignForm, end_date: e.target.value})} className={inputClass} />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button onClick={handleCampaignSubmit} className="bg-[#222222] text-white px-8 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors">
                    Kreiraj kampanju
                  </button>
                  <button onClick={() => setShowCampaignForm(false)} className="border border-[#F0EFEA] px-8 py-2 text-xs uppercase tracking-widest hover:border-[#222222] transition-colors">
                    Otkaži
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="border border-[#F0EFEA] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-[#222222] mb-1">{campaign.name}</h3>
                      <p className="text-[10px] text-[#888888]">{campaign.description}</p>
                      <p className="text-[10px] text-[#888888] mt-2">
                        {new Date(campaign.start_date).toLocaleDateString('sr-RS')} → {new Date(campaign.end_date).toLocaleDateString('sr-RS')}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${campaign.is_active ? 'bg-green-100 text-green-700' : 'bg-[#F9F9F9] text-[#888888]'}`}>
                      {campaign.is_active ? 'Aktivna' : 'Neaktivna'}
                    </span>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <p className="text-xs text-[#888888] text-center py-12">Nema kampanja.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'promo' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#222222]">
                Promo Kodovi ({promoCodes.length})
              </h2>
              <button onClick={() => setShowPromoForm(true)}
                className="bg-[#222222] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors">
                + Novi promo kod
              </button>
            </div>

            {showPromoForm && (
              <div className="border border-[#F0EFEA] p-6 mb-8 bg-[#F9F9F9]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#222222] mb-6">Novi promo kod</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Kampanja</label>
                    <select value={promoForm.campaign_id} onChange={e => setPromoForm({...promoForm, campaign_id: e.target.value})} className={inputClass}>
                      <option value="">Odaberi kampanju</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Kod</label>
                    <input value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})} className={inputClass} placeholder="npr. GLOW20" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Popust (RSD)</label>
                    <input type="number" value={promoForm.discount_value} onChange={e => setPromoForm({...promoForm, discount_value: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Maks. upotreba</label>
                    <input type="number" value={promoForm.max_uses} onChange={e => setPromoForm({...promoForm, max_uses: e.target.value})} className={inputClass} />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button onClick={handlePromoSubmit} className="bg-[#222222] text-white px-8 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors">
                    Kreiraj promo kod
                  </button>
                  <button onClick={() => setShowPromoForm(false)} className="border border-[#F0EFEA] px-8 py-2 text-xs uppercase tracking-widest hover:border-[#222222] transition-colors">
                    Otkaži
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {promoCodes.map(promo => (
                <div key={promo.id} className="border border-[#F0EFEA] p-5 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-[#222222] tracking-widest">{promo.code}</p>
                    <p className="text-[10px] text-[#888888] mt-1">{promo.campaign_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#222222]">{promo.discount_value} RSD popusta</p>
                    <p className="text-[10px] text-[#888888] mt-1">
                      Iskorišćeno {promo.current_uses}{promo.max_uses ? ` / ${promo.max_uses}` : ''}
                    </p>
                  </div>
                </div>
              ))}
              {promoCodes.length === 0 && (
                <div className="text-center py-12 bg-[#F9F9F9] border border-dashed border-[#F0EFEA]">
                  <p className="text-xs text-[#888888]">Kreirajte promo kod vezan za kampanju.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#222222] mb-8">
              Analitički Izveštaj
            </h2>

            {analytics ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-[#F0EFEA] p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mb-2">Ukupno porudžbina</p>
                  <p className="text-3xl font-light text-[#222222]">{analytics.totalOrders}</p>
                </div>
                <div className="border border-[#F0EFEA] p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mb-2">Ukupan prihod</p>
                  <p className="text-3xl font-light text-[#222222]">{analytics.totalRevenue} RSD</p>
                </div>
                <div className="border border-[#F0EFEA] p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mb-2">Porudžbine na čekanju</p>
                  <p className="text-3xl font-light text-[#222222]">{analytics.pendingOrders}</p>
                </div>
                <div className="border border-[#F0EFEA] p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mb-2">Ukupno proizvoda</p>
                  <p className="text-3xl font-light text-[#222222]">{analytics.totalProducts}</p>
                </div>
                <div className="border border-[#F0EFEA] p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mb-2">Aktivne kampanje</p>
                  <p className="text-3xl font-light text-[#222222]">{campaigns.filter(c => c.is_active).length}</p>
                </div>
                <div className="border border-[#F0EFEA] p-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mb-2">Preporučeni proizvodi</p>
                  <p className="text-3xl font-light text-[#222222]">{analytics.totalRecommendations}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#888888] text-center py-12">Učitavanje analitike...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}