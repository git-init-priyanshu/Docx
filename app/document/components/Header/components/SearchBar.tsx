"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import prettifyDate from "@/helpers/prettifyDates";
import doc from "@/public/output-onlinepngtools.svg";
import useDebounce from "@/lib/customHooks/useDebounce";

import { SearchDocAction } from "../actions";

type SearchResultType = {
  id: string;
  name: string;
  updatedAt: Date;
  createdBy: {
    name: string;
  };
};
type SearchResponse = {
  success: boolean;
  data?: SearchResultType[];
  error?: string;
};
export default function SearchBar() {
  const router = useRouter();

  const debounce = useDebounce(
    async (value: string) => {
      if (!searchValue) return;
      setIsSearching(true);
      setSearchResponse(await SearchDocAction(value));
      setIsSearching(false);
    }, 500);

  const searchedResponseRef = useRef<HTMLDivElement>(null);

  const [searchResponse, setSearchResponse] = useState<
    SearchResponse | undefined
  >(undefined);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleDocumentClick = (e: any) => {
    if (
      searchedResponseRef.current &&
      !searchedResponseRef.current.contains(e.target)
    ) {
      setIsFocused(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  return (
    <div
      className={`transform relative w-full md:w-fit lg:w-[30rem] translate-x-0 xl:translate-x-1/4`}
    >
      <div className="relative">
        <Input
          className={`${isFocused && searchResponse
            ? "rounded-t-3xl rounded-b-none"
            : "rounded-full"
            } px-8 `}
          onFocus={() => setIsFocused(true)}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (!e.target.value) return setSearchResponse(undefined);
            // debouncedSearch(e.target.value);
            debounce(e.target.value);
          }}
          placeholder="Search documents..."
        />
        <Search
          size={20}
          className="absolute text-slate-500 top-1/2 transform -translate-y-1/2 ml-2"
        />
        <X
          size={20}
          onClick={() => setSearchValue("")}
          className={`${!searchValue ? "hidden" : ""
            } absolute text-slate-500 right-0 top-1/2 transform -translate-y-1/2 mr-2 cursor-pointer`}
        />
      </div>

      <div
        ref={searchedResponseRef}
        className={`${isFocused && searchResponse ? "block" : "hidden"
          } absolute shadow-md overflow-hidden border border-t-0 bg-white w-full md:w-full rounded-b-3xl`}
      >
        {isSearching ? (
          <div className="p-3 flex items-center gap-2 justify-center text-center text-neutral-500">
            <svg
              className="animate-spin lucide lucide-loader-circle"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Searching
          </div>
        ) : !searchResponse?.success ? (
          <div className="p-3 text-center text-neutral-500">
            {searchResponse?.error}
          </div>
        ) : (
          searchResponse.data?.map((data: SearchResultType) => {
            return (
              <div
                key={data.id}
                onClick={() => router.push(`writer/${data.id}`)}
                className="z-50 flex cursor-pointer justify-between p-2 border-l-2 border-white hover:bg-neutral-100 hover:border-blue-500 "
              >
                <div className="flex gap-2 items-center">
                  <Image className="w-6" src={doc} height={10} alt="doc" />
                  <div className="overflow-hidden">
                    <p className="truncate">{data.name}</p>
                    <p className="truncate text-neutral-500 text-sm">
                      {data.createdBy.name}
                    </p>
                  </div>
                </div>
                <p className="ml-2 text-sm">
                  {prettifyDate(String(data.updatedAt), {
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
