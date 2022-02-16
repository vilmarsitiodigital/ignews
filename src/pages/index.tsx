import Image from 'next/image';
import Head from 'next/head';
import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton';
import { GetServerSideProps, GetStaticProps } from 'next';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br />
            the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          width="336"
          height="521"
          src="/images/avatar.svg"
          alt="Girl coding"
        />
      </main>
    </>
  );
}

// Client-side = informações que são carregadas com iteração do usuário
// Server-side = dados estritamente dinâmicos (Ex: Bem Vindo Vilmar ao logar)
// Static-side = dados iguais para todos usuários que não precisam ser carregados toda hora
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KTZNHJhjVdJZoDcd9WBqsFH');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
