"use client";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import React from "react";

const ProductInfo = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleSearch = async () => {
    const response = await fetch("/api/response_url", {
      method: "POST",
      headers: {
        "Content-Type": "application/image",
      },
      body: product.image,
    });

    if (response.ok) {
      const { query } = await response.json();
      router.push(`/?page=1&query=${encodeURI(query)}`);
    } else {
      router.push(`/?page=1&query=${encodeURI("")}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <img className="max-w-96" src={product.image} alt={product.Name} />
      </div>
      <div className="flex flex-col px-4 space-y-4 justify-center">
        <h2 className="text-2xl font-semibold">{product.Name}</h2>
        <p className="text-gray-500">{product.sku}</p>
        <div className="">
          <button className="bg-main text-white p-2">+</button>
          <input
            defaultValue={12}
            className="w-16 h-10 focus:outline-none px-2 text-center"
            type="number"
          />
          <button className="bg-main text-white p-2">-</button>
        </div>
        <button
          onClick={() => handleSearch()}
          className="bg-main text-white py-1 px-2"
        >
          Buscar productos similares
        </button>
      </div>
    </>
  );
};

export default ProductInfo;
