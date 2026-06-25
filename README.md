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

## Event-Driven Architecture (Kafka)

Komunikacija između mikroservisa transformisana je iz sinhrone (HTTP) u asinhronu korišćenjem Apache Kafka.

**Topics:**
- `order-created` – kreirana je nova porudžbina
- `beauty-profile-updated` – korisnik je promenio beauty profil
- `stock-updated` – ažurirano je stanje zaliha proizvoda nakon kupovine
- `review-submitted` – korisnik je ostavio recenziju proizvoda

**Producer-i:** order-service, user-service, catalog-service
**Consumer-i:** catalog-service, recommendation-service

**Hibridni modul (Consumer + Producer):**
- **catalog-service** – konzumira `order-created`, smanjuje zalihe proizvoda i publikuje `stock-updated`

---

## Bezbednost

- **XSS** – Helmet middleware dodaje zaštitne HTTP headere na svim servisima
- **CORS** – konfigurisan na API Gateway-u, dozvoljen pristup samo sa frontend domena
- **IDOR** – middleware (`verifyToken`) proverava identitet korisnika pre pristupa resursima
- **SQL Injection** – korišćeni parametrizovani upiti (PostgreSQL) i Mongoose ORM (MongoDB)
- **CSRF** – zaštita putem JWT autentikacije

---

## CI/CD

Proces razvoja je automatizovan korišćenjem GitHub Actions. Pipeline se okida na svaki push i sastoji se od dve faze:

- **test** – instalira zavisnosti i pokreće unit testove za svaki mikroservis
- **build** – pokreće se samo ako testovi prođu; builduje Docker image za svaki mikroservis i frontend, i objavljuje ih na [Docker Hub](https://hub.docker.com/u/suzanatesovic)

---

## Monitoring

Prometheus i Grafana su podignuti kroz Docker Compose za prikupljanje i vizualizaciju metrike.

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3006 (admin/admin)

Svi mikroservisi izlažu `/metrics` endpoint sa podacima o broju HTTP zahteva, statusu servisa i iskorišćenosti memorije.

---

## Distribuirani paterni

**Circuit Breaker** je implementiran korišćenjem `opossum` biblioteke na dva mesta u Order Service-u:

1. **Provera beauty profila** – prilikom kreiranja porudžbine, Order Service poziva User Service da dobije beauty profil korisnika. Ako User Service postane nedostupan ili previše spor (timeout 3s), prekidač se otvara i odmah vraća fallback odgovor (bez beauty profila) umesto da čeka, čime se sprečava kaskadno otkazivanje sistema.

2. **Provera zaliha** – prilikom kreiranja porudžbine, Order Service poziva Catalog Service da provери da li su proizvodi iz korpe na zalihama. Ako je proizvod nedostupan, porudžbina se odbija. Ako Catalog Service ne odgovori (timeout 3s), fallback dozvoljava kupovinu da nastavi.

Nakon 10 sekundi, oba prekidača ponovo pokušavaju da uspostave konekciju.