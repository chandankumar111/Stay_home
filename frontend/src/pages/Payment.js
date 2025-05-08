import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';

const Payment = () => {
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const initiatePayment = async () => {
      const res = await loadRazorpayScript();

      if (!res) {
        setError('Failed to load Razorpay SDK. Please check your internet connection.');
        return;
      }

      try {
        const { data } = await api.post('/payments/create-order', { bookingId });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: 'PG/Flat Booking',
          description: 'Booking Payment',
          order_id: data.id,
          handler: async function (response) {
            try {
              await api.post('/payments/verify', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId,
              });
              setPaymentSuccess(true);
            } catch (err) {
              setError('Payment verification failed.');
            }
          },
          prefill: {
            // Prefill user info if available
          },
          theme: {
            color: '#3399cc',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        setError('Failed to initiate payment.');
      } finally {
        setLoading(false);
      }
    };

    initiatePayment();
  }, [bookingId]);

  if (loading) {
    return <div>Loading payment gateway...</div>;
  }

  if (paymentSuccess) {
    return <div>Payment successful! Thank you for your booking.</div>;
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!paymentSuccess && <p>Please complete the payment to confirm your booking.</p>}
    </div>
  );
};

export default Payment;
