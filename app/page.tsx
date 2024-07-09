import DocCard from "./components/Card";
import Header from "./components/Header"

export default function Home() {
  return (
    <main>
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-[80vw] mx-auto">
        <DocCard />
        <DocCard />
        <DocCard />
        <DocCard />
      </div>
    </main>
  );
}
