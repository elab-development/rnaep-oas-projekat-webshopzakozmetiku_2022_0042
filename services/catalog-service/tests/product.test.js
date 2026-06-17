describe('Catalog Service - filter proizvoda', () => {
  test('Filtrira proizvode po kategoriji', () => {
    const products = [
      { name: 'Krema', category: 'serum' },
      { name: 'Losion', category: 'krema' },
      { name: 'Serum', category: 'serum' }
    ];

    const filtered = products.filter(p => p.category === 'serum');

    expect(filtered.length).toBe(2);
  });

  test('Vraca prazan niz ako nema proizvoda te kategorije', () => {
    const products = [
      { name: 'Krema', category: 'serum' }
    ];

    const filtered = products.filter(p => p.category === 'maska');

    expect(filtered.length).toBe(0);
  });
});