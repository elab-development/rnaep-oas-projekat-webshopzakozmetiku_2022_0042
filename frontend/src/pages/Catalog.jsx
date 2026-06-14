import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [skinType, setSkinType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    API.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const skinTypes = [...new Set(products.map(p => p.skin_type).filter(Boolean))];

  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === '' || p.category === category) &&
      (brand === '' || p.brand === brand) &&
      (skinType === '' || p.skin_type === skinType)
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const clearFilters = () => {
    setCategory('');
    setBrand('');
    setSkinType('');
  };

  const hasActiveFilters = category || brand || skinType;

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      
      <div className="text-center pt-12 pb-16">
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#222222] mb-3 font-serif">
          Face Creams & Lotions
        </h1>
        <div className="flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-[#888888]">
          <Link to="/" className="hover:text-[#222222]">Skincare</Link>
          <span>/</span>
          <span className="text-[#222222] font-medium">Creams & Lotions</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-[#F0EFEA]">
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-b border-[#CCCCCC] py-1.5 text-xs tracking-wide focus:outline-none focus:border-[#222222] transition-colors"
          />
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-[#666666] self-end sm:self-auto">
          <span className="font-light">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-[#222222] font-medium focus:outline-none cursor-pointer text-xs"
          >
            <option value="newest">newest</option>
            <option value="price-low">price: low to high</option>
            <option value="price-high">price: high to low</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <aside className="md:col-span-3 space-y-6 sticky top-24 pr-4">
          <div className="border-b border-[#F0EFEA] pb-4 flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#222222]">Filters</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-[10px] uppercase tracking-wider text-[#888888] hover:text-[#222222] underline underline-offset-4">
                Clear all
              </button>
            )}
          </div>

          {/* Product Type */}
          <div className="border-b border-[#F0EFEA] pb-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-[#222222]">Product Type</span>
            </div>
            <div className="mt-2 space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center space-x-3 text-xs text-[#555555] cursor-pointer hover:text-[#222222]">
                  <input 
                    type="radio" 
                    name="category-filter"
                    checked={category === cat}
                    onChange={() => setCategory(category === cat ? '' : cat)}
                    className="w-3.5 h-3.5 accent-[#222222]"
                  />
                  <span className="capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="border-b border-[#F0EFEA] pb-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-[#222222]">Brand</span>
            </div>
            <div className="mt-2 space-y-2">
              {brands.map(b => (
                <label key={b} className="flex items-center space-x-3 text-xs text-[#555555] cursor-pointer hover:text-[#222222]">
                  <input 
                    type="radio" 
                    name="brand-filter"
                    checked={brand === b}
                    onChange={() => setBrand(brand === b ? '' : b)}
                    className="w-3.5 h-3.5 accent-[#222222]"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b border-[#F0EFEA] pb-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-[#222222]">Skin Type</span>
            </div>
            <div className="mt-2 space-y-2">
              {skinTypes.map(st => (
                <label key={st} className="flex items-center space-x-3 text-xs text-[#555555] cursor-pointer hover:text-[#222222]">
                  <input 
                    type="radio" 
                    name="skintype-filter"
                    checked={skinType === st}
                    onChange={() => setSkinType(skinType === st ? '' : st)}
                    className="w-3.5 h-3.5 accent-[#222222]"
                  />
                  <span className="capitalize">{st}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="md:col-span-9">
          <p className="text-xs text-[#888888] mb-6">{filteredProducts.length} proizvoda</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filteredProducts.map(product => (
              <div key={product._id} className="group relative flex flex-col justify-between">
                
                <div className="relative aspect-3/4 w-full bg-[#F9F9F9] flex items-center justify-center p-8 overflow-hidden">
                  <button className="absolute top-4 right-4 text-[#888888] hover:text-[#222222] transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>

                  <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-102 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="text-[10px] tracking-widest text-[#C8C2B9] uppercase font-light">
                        glow. image
                      </div>
                    )}
                  </Link>
                </div>

                <div className="text-center pt-4 flex flex-col items-center grow justify-between">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-[#222222]">
                      {product.brand || 'GLOW.'}
                    </h3>
                    <p className="text-xs text-[#555555] font-light mt-1 max-w-50 mx-auto line-clamp-2 leading-relaxed">
                      {product.name}
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-[#222222]">
                    {product.price} RSD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}