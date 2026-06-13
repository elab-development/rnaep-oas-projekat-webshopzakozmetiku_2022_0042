import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const stripePromise = loadStripe('pk_test_51Th6us3e9bFmpZjVMzd5NUIA22Wc22nEGxfx6rnxbaCwx6AmcD0jAD0gnP1nDrFvL0FvZT1iQiC6pvEcLQDg5Bvq00EAgIbrws');

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      alert('Plaćanje uspešno!');
      navigate('/orders');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">Broj kartice</label>
          <div className="border border-[#F0EFEA] px-3 py-3 focus-within:border-[#222222]">
            <CardNumberElement options={{ style: { base: { fontSize: '14px', color: '#222222' } } }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">Rok važenja</label>
            <div className="border border-[#F0EFEA] px-3 py-3 focus-within:border-[#222222]">
              <CardExpiryElement options={{ style: { base: { fontSize: '14px', color: '#222222' } } }} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">CVV</label>
            <div className="border border-[#F0EFEA] px-3 py-3 focus-within:border-[#222222]">
              <CardCvcElement options={{ style: { base: { fontSize: '14px', color: '#222222' } } }} />
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
      <button type="submit" disabled={!stripe || loading}
        className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors">
        {loading ? 'Procesiranje...' : 'Plati'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);

  const createOrder = async () => {
    try {
      const res = await API.post('/api/orders', {});
      setClientSecret(res.data.clientSecret);
      setOrderCreated(true);
    } catch {
      alert('Greška pri kreiranju porudžbine.');
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      <div className="text-center pt-12 pb-16">
        <h1 className="text-3xl font-normal tracking-wide font-serif">Checkout</h1>
      </div>
      <div className="max-w-md mx-auto px-4">
        {!orderCreated ? (
          <button onClick={createOrder}
            className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors">
            Nastavi na plaćanje
          </button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}