export default function Loading() {
  return (
    <div className="w-[816.3px] h-[1056.36px] mx-auto my-2 bg-white rounded-md border p-24">
      <div className="h-12 w-52 rounded bg-neutral-100 animate-pulse mb-4"></div>
      <div className="h-8 w-96 rounded bg-neutral-100 animate-pulse mb-4"></div>

      <div className="flex gap-4 w-[700px] mb-12">
        <div className="h-8 rounded bg-neutral-100 animate-pulse mb-4 w-1/2"></div>
        <div className="h-8 rounded bg-neutral-100 animate-pulse mb-4 w-1/2"></div>
      </div>

      <div className="flex gap-4 w-[600px]">
        <div className="h-8 rounded bg-neutral-100 animate-pulse mb-4 w-1/2"></div>
        <div className="h-8 rounded bg-neutral-100 animate-pulse mb-4 w-1/2"></div>
      </div>

      <div className="h-8 w-96 rounded bg-neutral-100 animate-pulse mb-4"></div>
      <div className="h-8 w-96 rounded bg-neutral-100 animate-pulse mb-4"></div>

      <div className="h-8 w-[400px] rounded bg-neutral-100 animate-pulse mb-4"></div>
      <div className="h-8 w-[500px] rounded bg-neutral-100 animate-pulse mb-4"></div>
    </div>
  );
}
