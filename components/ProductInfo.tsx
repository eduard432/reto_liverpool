"use client"
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import React, { useState } from "react";

const ProductInfo = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleSearch = async () => {
    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: 'Asistente que etiqueta imagenes con 8 etiquetas en español, la más importante primero junto con la marca, utiliza sinónimos. Sé descriptivo. Responde por ejemplo: "anime, camiseta, negro, hombres"',
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Etiqueta la siguiente imagen" },
            {
              type: "image_url",
              image_url: {
                url: `${product.image}`,
              },
            },
          ],
        },
      ],
    });
    router.push(
      `/?page=1&query=${encodeURI(response.choices[0].message.content || "")}`
    );
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
