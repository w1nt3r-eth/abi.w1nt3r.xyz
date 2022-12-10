import { GetServerSideProps } from 'next';

export default function Page() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const address = ctx.query.address as string;

  return {
    redirect: {
      destination: `/address/${address}`,
      permanent: true,
    },
  };
};
