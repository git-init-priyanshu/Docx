"use client"

import { useQuery } from "@tanstack/react-query";
import DocCard from "./components/Card/Card";
import Header from "./components/Header/Header"
import { getAllDocuments } from "./actions";

import Loading from "./Loading";
import Doc from '@/public/110045644.png'

export default function Home() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await getAllDocuments();
      return response;
    }
  })
  if (isLoading) return <Loading />

  return (
    <main>
      <Header />
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-[80vw] mx-auto"
      >
        {data && data.map((doc) => {
          return (
            <DocCard
              docId={doc.id}
              thumbnail={doc.thumbnail}
              title={doc.name}
              createdAt={doc.createdAt}
              refetch={refetch}
            />
          )
        })}
      </div>
    </main>
  );
}
