"use client";

import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";

export function PaginationDemo() {
  const [page, setPage] = useState(2);

  return <Pagination currentPage={page} totalPages={5} onChange={setPage} />;
}
