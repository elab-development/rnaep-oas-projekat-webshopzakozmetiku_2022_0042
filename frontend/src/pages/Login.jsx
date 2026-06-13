import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const [skinType, setSkinType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [preferences, setPreferences] = useState('');
  const [favoriteBrands, setFavoriteBrands] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/users/login', { email, password });
      if (response.data.token) {
        login(response.data.token);
        navigate('/');
      }
    } catch  {
      alert('Greška prilikom prijave. Pokušajte ponovo.');
    }
  };

  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/users/register', { email, password, username });
      if (response.data.user) {
        const loginRes = await API.post('/api/users/login', { email, password });
        if (loginRes.data.token) {
          login(loginRes.data.token);
          setStep(2);
        }
      }
    } catch {
      alert('Greška prilikom registracije. Pokušajte ponovo.');
    }
  };

  const handleRegisterStep2 = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/users/beauty-profile', {
        skin_type: skinType,
        allergies,
        preferences,
        favorite_brands: favoriteBrands
      });
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const inputClass = "w-full border border-[#EAE9E4] bg-[#F9F9F9]/60 backdrop-blur-xs px-4 py-3.5 text-xs text-[#222222] placeholder-[#A0A0A0] transition-all duration-300 focus:outline-none focus:border-[#222222] focus:bg-white";
  const labelClass = "block text-[10px] font-bold tracking-widest uppercase text-[#222222] mb-2";

  if (!isLogin && step === 2) {
    return (
      <div className="bg-white min-h-screen text-[#222222] font-sans antialiased flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          
          <div className="w-full bg-[#F0EFEA] h-0.5b-12 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-full bg-[#222222] transition-all duration-500 ease-out"></div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-normal tracking-wide text-[#222222] font-serif mb-3">
              Beauty Profile
            </h1>
            <p className="text-xs text-[#888888] font-light max-w-xs mx-auto leading-relaxed">
              Pomozite nam da kreiramo personalizovano iskustvo i prilagodimo preporuke vašem profilu kože.
            </p>
          </div>

          <form onSubmit={handleRegisterStep2} className="space-y-6">
            <div>
              <label className={labelClass}>Tip Kože</label>
              <div className="relative">
                <select 
                  value={skinType} 
                  onChange={(e) => setSkinType(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer rounded-none`}
                >
                  <option value="">Odaberite tip kože</option>
                  <option value="suva">Suva</option>
                  <option value="masna">Masna</option>
                  <option value="kombinovana">Kombinovana</option>
                  <option value="osetljiva">Osetljiva</option>
                  <option value="normalna">Normalna</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#888888]">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Alergije</label>
              <input 
                type="text" 
                value={allergies} 
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="npr. parfemi, veštačke boje..."
                className={inputClass} 
              />
            </div>

            <div>
              <label className={labelClass}>Preferencije</label>
              <input 
                type="text" 
                value={preferences} 
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="npr. prirodni sastojci, veganski proizvodi..."
                className={inputClass} 
              />
            </div>

            <div>
              <label className={labelClass}>Omiljeni Brendovi</label>
              <input 
                type="text" 
                value={favoriteBrands} 
                onChange={(e) => setFavoriteBrands(e.target.value)}
                placeholder="npr. The Ordinary, CeraVe, La Roche-Posay..."
                className={inputClass} 
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors duration-300 rounded-none"
              >
                Završi Registraciju
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className="w-full text-center text-[10px] uppercase tracking-widest text-[#888888] font-light hover:text-[#222222] transition-colors pt-2 block"
              >
                Preskoči za sada
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        
        {!isLogin && (
          <div className="w-full bg-[#F0EFEA] h-0.5 mb-12 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-[#222222] transition-all duration-500 ease-out"></div>
          </div>
        )}

        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-widest text-[#888888] block mb-2 font-light">
            Glow. Authenticate
          </span>
          <h1 className="text-3xl font-normal tracking-wide text-[#222222] font-serif">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterStep1} className="space-y-6">
          {!isLogin && (
            <div>
              <label className={labelClass}>Korisničko Ime</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Unesite vaše korisničko ime"
                className={inputClass} 
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Email Adresa</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="ime@example.com"
              className={inputClass} 
            />
          </div>

          <div>
            <label className={labelClass}>Lozinka</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="••••••••••••"
              className={inputClass} 
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors duration-300 rounded-none"
            >
              {isLogin ? 'Prijavi se' : 'Dalje'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setStep(1); }}
            className="text-[11px] text-[#888888] font-light tracking-wide hover:text-[#222222] transition-colors underline underline-offset-4"
          >
            {isLogin ? 'Nemate nalog? Registrujte se' : 'Već imate nalog? Prijavite se'}
          </button>
        </div>

      </div>
    </div>
  );
}