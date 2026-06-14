const mongoose = require('mongoose');

const CATALOG_URI = 'mongodb://localhost:27017/catalogdb';
const RECOMMENDATION_URI = 'mongodb://localhost:27017/recommendation-db';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  skin_type: String,
  ingredients: [String],
  stock: Number,
  image_url: String,
  created_at: { type: Date, default: Date.now }
});

const generalRecommendationSchema = new mongoose.Schema({
  context: String,
  recommendedProducts: [{
    productId: mongoose.Schema.Types.ObjectId,
    score: Number,
    reason: String
  }],
  generatedAt: Date
});

const products = [
  {
    name: "Hidratantna Krema za Lice",
    description: "Lagana hidratantna krema pogodna za sve tipove kože. Sadrži hijaluronsku kiselinu i aloe veru.",
    price: 2490,
    category: "Nega lica",
    brand: "CeraVe",
    skin_type: "normalna",
    ingredients: ["hijaluronska kiselina", "aloe vera", "ceramidi"],
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"
  },
  {
    name: "Serum sa Vitaminom C",
    description: "Antioksidativni serum koji posvjetljuje ten i smanjuje tamne mrlje.",
    price: 3990,
    category: "Serumi",
    brand: "The Ordinary",
    skin_type: "kombinovana",
    ingredients: ["vitamin C", "niacinamid", "cink"],
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
  },
  {
    name: "Nežni Gel za Čišćenje",
    description: "Blagi gel za čišćenje koji ne narušava prirodnu barijeru kože.",
    price: 1890,
    category: "Čišćenje",
    brand: "La Roche-Posay",
    skin_type: "osetljiva",
    ingredients: ["niacinamid", "panthenol", "glicerin"],
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400"
  },
  {
    name: "Retinol Noćna Krema",
    description: "Intenzivna noćna krema sa retinolom za smanjenje bora.",
    price: 4590,
    category: "Anti-age",
    brand: "RoC",
    skin_type: "suva",
    ingredients: ["retinol", "vitamin E", "shea butter"],
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1601049541271-f5b45d06ad56?w=400"
  },
  {
    name: "Matting Fluid SPF 30",
    description: "Dnevna zaštita od sunca sa mat efektom, idealna za masnu kožu.",
    price: 2990,
    category: "Zaštita od sunca",
    brand: "Bioderma",
    skin_type: "masna",
    ingredients: ["SPF 30", "niacinamid", "silika"],
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400"
  },
  {
    name: "Maska za Lice sa Glinom",
    description: "Detox maska koja dubinski čisti pore i uklanja višak sebuma.",
    price: 1690,
    category: "Maske",
    brand: "Innisfree",
    skin_type: "masna",
    ingredients: ["kaolin", "bentonit", "čajevac"],
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400"
  },
  {
    name: "Hidratantni Tonik",
    description: "Osvježavajući tonik koji balansira pH kože i priprema je za dalju negu.",
    price: 1990,
    category: "Tonici",
    brand: "Pyunkang Yul",
    skin_type: "kombinovana",
    ingredients: ["astragalus", "panthenol", "glicerin"],
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400"
  },
  {
    name: "Eye Cream sa Kofeinom",
    description: "Krema za područje oko očiju koja smanjuje podočnjake i otekline.",
    price: 3290,
    category: "Nega oko očiju",
    brand: "The INKEY List",
    skin_type: "normalna",
    ingredients: ["kofein", "peptidi", "hijaluronska kiselina"],
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400"
  }
];

async function seed() {
  try {
    const catalogConn = await mongoose.createConnection(CATALOG_URI);
    const Product = catalogConn.model('Product', productSchema);
    
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Ubačeno ${insertedProducts.length} proizvoda u catalogdb`);

    const recConn = await mongoose.createConnection(RECOMMENDATION_URI);
    const GeneralRecommendation = recConn.model('GeneralRecommendation', generalRecommendationSchema);

    await GeneralRecommendation.deleteMany({});

    await GeneralRecommendation.create({
      context: 'bestsellers',
      recommendedProducts: insertedProducts.slice(0, 4).map((p, i) => ({
        productId: p._id,
        score: 1.0 - i * 0.1,
        reason: 'Najprodavaniji proizvod'
      })),
      generatedAt: new Date()
    });

    await GeneralRecommendation.create({
      context: 'top-rated',
      recommendedProducts: insertedProducts.slice(4, 8).map((p, i) => ({
        productId: p._id,
        score: 1.0 - i * 0.1,
        reason: 'Najbolje ocenjen proizvod'
      })),
      generatedAt: new Date()
    });

    console.log('✅ Ubačene generalne preporuke');

    await catalogConn.close();
    await recConn.close();
    console.log('Seed završen!');
    process.exit(0);
  } catch (error) {
    console.error('Greška:', error);
    process.exit(1);
  }
}

seed();