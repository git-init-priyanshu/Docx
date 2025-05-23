'use client'

import { useEffect, useState } from "react";

import { GetAllDocs } from "./actions";
import DocCard from "./components/Card/Card";
import Header from "./components/Header/Header";
import Onboarding from "./components/Onboarding";
import useClientSession from "@/lib/customHooks/useClientSession";
import { getAllGuestDocuments } from "@/lib/guestServices";

export default function Home() {
  const session = useClientSession();

  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      if (session?.id) {
        const response = await GetAllDocs(session.id);
        if (response.success) {
          setData(response.data!);
        } else {
          setData([]);
        }
      } else {
        setData(getAllGuestDocuments());
      }
    })()
  }, [session.id])

  return (
    <main>
      <Header name={session?.name} image={session?.image} />
      {data && data.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-[80vw] mx-auto"
        >
          {data.map((doc, index) => {
            return (
              <DocCard
                key={index}
                docId={doc.id}
                thumbnail={doc.thumbnail}
                title={doc.name}
                updatedAt={doc.updatedAt}
                users={doc.users}
              />
            );
          })}
        </div>
      ) : (
        <Onboarding />
      )}
    </main>
  );
}
