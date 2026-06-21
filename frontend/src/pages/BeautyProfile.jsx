import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BeautyProfile() {
  const [skinType, setSkinType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [preferences, setPreferences] = useState("");
  const [favoriteBrands, setFavoriteBrands] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/api/users/beauty-profile");
        const profile = res.data;
        setSkinType(profile.skin_type || "");
        setAllergies(profile.allergies || "");
        setPreferences(profile.preferences || "");
        setFavoriteBrands(profile.favorite_brands || "");
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/users/beauty-profile", {
        skin_type: skinType,
        allergies,
        preferences,
        favorite_brands: favoriteBrands,
      });
      alert("Beauty profil je uspešno ažuriran!");
      navigate("/");
    } catch {
      alert("Greška prilikom ažuriranja profila. Pokušajte ponovo.");
    }
  };

  const inputClass =
    "w-full border border-[#EAE9E4] bg-[#F9F9F9]/60 backdrop-blur-xs px-4 py-3.5 text-xs text-[#222222] placeholder-[#A0A0A0] transition-all duration-300 focus:outline-none focus:border-[#222222] focus:bg-white";
  const labelClass =
    "block text-[10px] font-bold tracking-widest uppercase text-[#222222] mb-2";

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-xs text-[#888888]">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-widest text-[#888888] block mb-2 font-light">
            Glow. My Profile
          </span>
          <h1 className="text-3xl font-normal tracking-wide text-[#222222] font-serif mb-3">
            Beauty Profile
          </h1>
          <p className="text-xs text-[#888888] font-light max-w-xs mx-auto leading-relaxed">
            Ažurirajte svoj profil kože da bismo unapredili vaše personalizovane
            preporuke.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <svg
                  className="fill-current h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
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

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors duration-300 rounded-none"
            >
              Sačuvaj Izmene
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
