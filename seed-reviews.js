const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
const reviews = [
  // Hidratantna Krema za Lice
  {
    product_id: "6a2b4a1db445f815e75dad57",
    user_id: 1,
    rating: 5,
    comment: "Odlicna krema, koza mi je mekana i hidratisana ceo dan.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad57",
    user_id: 2,
    rating: 4,
    comment: "Brzo se upija, samo malo previse masna za leto.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad57",
    user_id: 3,
    rating: 5,
    comment: "Koristim je vec mesec dana, koza mi je vidno bolja.",
  },

  // Serum sa Vitaminom C
  {
    product_id: "6a2b4a1db445f815e75dad58",
    user_id: 1,
    rating: 5,
    comment: "Ten mi je posvetljen za samo dve nedelje, preporucujem!",
  },
  {
    product_id: "6a2b4a1db445f815e75dad58",
    user_id: 4,
    rating: 4,
    comment: "Dobar serum, malo lepljiv ali efekat se vidi.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad58",
    user_id: 5,
    rating: 3,
    comment: "Ocekivala sam vise, tamne mrlje su jedva primetno smanjene.",
  },

  // Nezni Gel za Ciscenje
  {
    product_id: "6a2b4a1db445f815e75dad59",
    user_id: 2,
    rating: 5,
    comment: "Najbolji gel za osetljivu kozu koji sam probala.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad59",
    user_id: 6,
    rating: 5,
    comment: "Ne suzi kozu nakon umivanja, super proizvod.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad59",
    user_id: 3,
    rating: 4,
    comment: "Blag je, ali ponekad mi treba jaci gel za temeljito ciscenje.",
  },

  // Retinol Nocna Krema
  {
    product_id: "6a2b4a1db445f815e75dad5a",
    user_id: 4,
    rating: 5,
    comment: "Bore oko ociju su vidno manje nakon mesec dana koriscenja.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5a",
    user_id: 7,
    rating: 4,
    comment: "Jaka krema, krenula sam polako da ne iritira kozu.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5a",
    user_id: 1,
    rating: 5,
    comment: "Najbolja anti-age krema koju sam koristila, vredi cena.",
  },

  // Matting Fluid SPF 30
  {
    product_id: "6a2b4a1db445f815e75dad5b",
    user_id: 5,
    rating: 5,
    comment: "Konacno SPF koji ne ostavlja masnu kozu, savrsen za leto.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5b",
    user_id: 6,
    rating: 4,
    comment: "Dobra zastita, lagano sija ali nije strasno.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5b",
    user_id: 2,
    rating: 5,
    comment: "Koristim svaki dan ispod sminke, super se slaze.",
  },

  // Maska za Lice sa Glinom
  {
    product_id: "6a2b4a1db445f815e75dad5c",
    user_id: 3,
    rating: 4,
    comment: "Pore su vidno cistije nakon koriscenja, malo steze kozu.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5c",
    user_id: 7,
    rating: 5,
    comment: "Odlicna detox maska, koristim je jednom nedeljno.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5c",
    user_id: 4,
    rating: 3,
    comment: "Dobra je, ali mi je previse susi kozu ako je ostavim dugo.",
  },

  // Hidratantni Tonik
  {
    product_id: "6a2b4a1db445f815e75dad5d",
    user_id: 1,
    rating: 5,
    comment: "Savrsen za pripremu kože pre seruma, koristim svako jutro.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5d",
    user_id: 5,
    rating: 4,
    comment: "Prijatan miris, koza je mekana nakon koriscenja.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5d",
    user_id: 6,
    rating: 5,
    comment: "Balansira kozu odlicno, vise ne imam crvenilo.",
  },

  // Eye Cream sa Kofeinom
  {
    product_id: "6a2b4a1db445f815e75dad5e",
    user_id: 2,
    rating: 4,
    comment: "Podocnjaci su manje vidljivi ujutru, dobar proizvod.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5e",
    user_id: 7,
    rating: 5,
    comment: "Najbolja krema za oci koju sam probala, otok je smanjen.",
  },
  {
    product_id: "6a2b4a1db445f815e75dad5e",
    user_id: 3,
    rating: 4,
    comment: "Dobra tekstura, brzo se upija, koristim svako vece.",
  },

  // Hidratantna Krema SPF 50
  {
    product_id: "6a2c459baa3ef3eb32635cab",
    user_id: 4,
    rating: 5,
    comment: "Odlicna zastita za osetljivu kozu, ne izaziva iritaciju.",
  },
  {
    product_id: "6a2c459baa3ef3eb32635cab",
    user_id: 6,
    rating: 5,
    comment: "Koristim svaki dan, koza mi je zasticena i hidratisana.",
  },
  {
    product_id: "6a2c459baa3ef3eb32635cab",
    user_id: 1,
    rating: 4,
    comment: "Dobra dnevna krema, malo bela na pocetku ali se upije.",
  },
];

const seedReviews = async () => {
  try {
    const mongoUri = "mongodb://localhost:27017/catalogdb";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("Povezano na MongoDB");

    await Review.deleteMany({});
    console.log("Stare recenzije obrisane");

    await Review.insertMany(reviews);
    console.log(`Ubaceno ${reviews.length} recenzija`);

    await mongoose.disconnect();
    console.log("Gotovo!");
  } catch (error) {
    console.error("Greska:", error);
    process.exit(1);
  }
};

seedReviews();
