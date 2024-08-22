import getServerSession from "@/lib/customHooks/getServerSession";

import { GetAllDocs } from "./actions";
import DocCard from "./components/Card/Card";
import Header from "./components/Header/Header"

export default async function Home() {
  const session = await getServerSession();
  if (!session?.id) return;

  const data = await GetAllDocs(session.id);

  return (
    <main>
      <Header name={session?.name} image={session?.image} />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-[80vw] mx-auto"
      >
        {data
          && data.length > 0
          ? data.map((doc, index) => {
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
          })
          : <></>}
      </div>
    </main>
  );
}
