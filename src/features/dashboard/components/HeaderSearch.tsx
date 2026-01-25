"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { useIsClient } from "@uidotdev/usehooks";

function HeaderSearch() {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-10 w-[200px] md:w-[320px]" />;
  }

  return <SearchAutocomplete />;
}

export default HeaderSearch;
