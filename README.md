# Web Shop za Kozmetiku

Mikroservisna aplikacija za prodaju kozmetičkih proizvoda sa personalizovanim preporukama, upravljanjem kampanjama i Stripe integracijom za plaćanje.

---

## Arhitektura sistema

| Servis | Opis | Baza | Port |
|--------|------|------|------|
| User Service | Registracija, prijava, beauty profil | PostgreSQL | 3001 |
| Catalog Service | Proizvodi i recenzije | MongoDB | 3002 |
| Order Service | Korpa, porudžbine, plaćanje | PostgreSQL | 3003 |
| Recommendation Service | Personalizovane preporuke | MongoDB | 3004 |
| Campaign Service | Kampanje i promo kodovi | PostgreSQL | 3005 |
| API Gateway | Jedinstvena ulazna tačka | - | 3000 |
| Frontend | React + Vite + Tailwind CSS | - | 5173 |

---

## Preduslovi

- [Docker](https://www.docker.com/) i Docker Compose
- Git

---

## Pokretanje

**1. Kloniraj repozitorijum:**
```bash
git clone https://github.com/elab-development/rnaep-oas-projekat-webshopzakozmetiku_2022_0042.git
cd rnaep-oas-projekat-webshopzakozmetiku_2022_0042
```

**2. Kreiraj `.env` fajl u korenu projekta:**
```env
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=tvojemail@gmail.com
```

**3. Pokreni sve servise:**
```bash
docker-compose up --build
```

**4. Otvori browser:**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:3000

**5. (Opciono) Popuni bazu test podacima:**
```bash
node seed.js
```

---

## Eksterni API-ji

- **Stripe** – procesiranje plaćanja karticom
- **SendGrid** – slanje email notifikacija nakon kupovine

---

## Tim

- Suzana Tešović (2022/0042)
- Jovana Sekulić (2022/1004)
- Andrea Dorontić (2022/0278)
