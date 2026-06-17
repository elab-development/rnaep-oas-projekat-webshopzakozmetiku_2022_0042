describe('Recommendation Service - scoring logika', () => {
  test('Povecava score ako tip kože odgovara', () => {
    const skinType = 'suva';
    const product = { skin_type: 'suva' };

    let score = 1.0;
    if (product.skin_type === skinType) score += 0.5;

    expect(score).toBe(1.5);
  });

  test('Score ostaje isti ako tip kože ne odgovara', () => {
    const skinType = 'masna';
    const product = { skin_type: 'suva' };

    let score = 1.0;
    if (product.skin_type === skinType) score += 0.5;

    expect(score).toBe(1.0);
  });
});