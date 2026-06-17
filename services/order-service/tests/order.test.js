describe('Order Service - kalkulacija cene', () => {
  test('Racuna ukupnu cenu na osnovu stavki u korpi', () => {
    const cartItems = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 1 }
    ];

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    expect(totalPrice).toBe(2500);
  });

  test('Vraca 0 za praznu korpu', () => {
    const cartItems = [];
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    expect(totalPrice).toBe(0);
  });
});