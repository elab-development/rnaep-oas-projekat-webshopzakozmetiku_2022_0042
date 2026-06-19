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
- `low-stock-alert` – zalihe proizvoda su pale ispod minimuma
- `recommendation-update` – preporuke su ažurirane

**Producer-i:** order-service, user-service, catalog-service
**Consumer-i:** catalog-service, recommendation-service

**Hibridni moduli (Consumer + Producer):**
- **recommendation-service** – konzumira `order-created` i `beauty-profile-updated`, ažurira preporuke i publikuje `recommendation-update`
- **catalog-service** – konzumira `order-created`, smanjuje zalihe i publikuje `low-stock-alert`

---

## Bezbednost

- **XSS** – Helmet middleware dodaje zaštitne HTTP headere na svim servisima
- **CORS** – konfigurisan na API Gateway-u, dozvoljen pristup samo sa frontend domena
- **IDOR** – middleware (`verifyToken`) proverava identitet korisnika pre pristupa resursima
- **SQL Injection** – korišćeni parametrizovani upiti (PostgreSQL) i Mongoose ORM (MongoDB)
- **CSRF** – zaštita putem JWT autentikacije

---

## Monitoring

Prometheus i Grafana su podignuti kroz Docker Compose za prikupljanje i vizualizaciju metrike.

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3006 (admin/admin)

Svi mikroservisi izlažu `/metrics` endpoint sa podacima o broju HTTP zahteva, statusu servisa i iskorišćenosti memorije.

---

## Distribuirani paterni

**Circuit Breaker** je implementiran korišćenjem `opossum` biblioteke za poziv ka User Service-u prilikom kreiranja porudžbine.

Kada Order Service kreira porudžbinu, poziva User Service da dobije beauty profil korisnika. Ako User Service postane nedostupan ili previše spor (timeout 3s), prekidač se otvara nakon određenog broja neuspešnih pokušaja i odmah vraća fallback odgovor umesto da čeka, čime se sprečava kaskadno otkazivanje sistema. Nakon 10 sekundi, prekidač ponovo pokušava da uspostavi konekciju.

