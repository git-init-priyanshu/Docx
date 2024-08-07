import DocCard from "./components/Card/Card";
import Header from "./components/Header/Header"
import { GetAllDocs } from "./actions";

export default async function Home() {
  const data = await GetAllDocs();

  return (
    <main>
      <Header />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-[80vw] mx-auto"
      >
        {data && data.map((doc, index) => {
          return (
            <DocCard
              key={index}
              docId={doc.id}
              thumbnail={doc.thumbnail}
              title={doc.name}
              updatedAt={doc.updatedAt}
              users={doc.users}
            />
          )
        })}
      </div>
    </main>
  );
}
