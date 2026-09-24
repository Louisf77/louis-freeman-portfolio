interface HomeProps {
  heading: string;
}

function Home({ heading }: HomeProps) {
  return (
    <main>
      <h1>{heading}</h1>
    </main>
  );
}

export default Home;
