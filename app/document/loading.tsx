import { Card, CardFooter } from "@/components/ui/card";
import Header from "./components/Header/Header";

export default function Loading() {
  return (
    <>
      <Header image={null} name={null} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 max-w-[80vw] mx-auto">
        {[1, 2, 3, 4].map((i) => {
          return (
            <Card key={i} className="overflow-hidden">
              <div className="h-52 w-full bg-neutral-100 animate-pulse"></div>
              <CardFooter className=" flex flex-col items-start gap-4 border-t bg-slate-50 p-4">
                <div className="flex items-center gap-1">
                  <div className="h-5 w-60 bg-neutral-100 rounded-full"></div>
                </div>
                <div className="flex items-center w-full justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="size-8 bg-neutral-100 rounded-full"></div>
                    <div className="h-5 w-40 bg-neutral-100 rounded-full"></div>
                  </div>
                  <div className="size-8 bg-neutral-100 rounded-full"></div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
