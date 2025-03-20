import CheckoutForm from '../components/checkout/CheckoutForm';

export default function Home() {
  const handleSubmit = (formData) => {
    console.log('Datos del formulario:', formData);
  };

  return (
    <div>
      <h1>Formulario de Checkout</h1>
      <CheckoutForm onSubmit={handleSubmit} />
    </div>
  );
}