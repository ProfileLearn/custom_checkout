import '../styles/globals.css'; // Asegúrate de que este archivo existe y contiene tus estilos globales

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async () => ({ pageProps: {} });

export default MyApp;