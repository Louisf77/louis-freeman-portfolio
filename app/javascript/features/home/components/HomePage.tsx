interface HomePageProps {
  heading: string;
}

function HomePage({ heading }: HomePageProps) {
  return (
    <main>
      <h1>{heading}</h1>
    </main>
  );
}

export default HomePage;
