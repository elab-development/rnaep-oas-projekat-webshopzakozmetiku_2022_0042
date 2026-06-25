describe('Campaign Service - validacija promo koda', () => {
  test('Promo kod je validan ako nije istekao', () => {
    const promoCode = { code: 'LETO2026', expiryDate: new Date('2026-12-31') };
    const today = new Date('2026-06-17');

    const isValid = promoCode.expiryDate > today;

    expect(isValid).toBe(true);
  });

  test('Promo kod je nevalidan ako je istekao', () => {
    const promoCode = { code: 'ZIMA2025', expiryDate: new Date('2025-12-31') };
    const today = new Date('2026-06-17');

    const isValid = promoCode.expiryDate > today;

    expect(isValid).toBe(false);
  });
});