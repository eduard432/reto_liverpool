"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const Pagination = ({pageQty}: {pageQty: number}) => {
  const params = useSearchParams();


  return (
    <nav
      aria-label="Pagination"
      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
    >
    {
        pageQty == 10 ? (<>{[...new Array(pageQty)].map((_, i) => (
            <Link
              key={i + 1}
              href={`/?page=${i + 1}${params.get("query") ? "&query=" + params.get("query") : ""}`}
              aria-current="page"
              className={`text-black px-4 py-2  border ${
                (Number(params.get("page")) || 1) == i + 1
                  ? "bg-pink-200 hover:bg-pink-300"
                  : "bg-white hover:bg-pink-200"
              }`}
            >
              {i + 1}
            </Link>
          ))}</>) : (<></>)
    }
    </nav>
  );
};

export default Pagination;
