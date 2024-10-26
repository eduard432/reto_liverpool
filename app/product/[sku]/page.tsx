import ProductInfo from "@/components/ProductInfo";
import { PageProps, Product } from "@/types";
import { MongoClient } from "mongodb";
import React from "react";

const Page = async ({ params }: PageProps<{ sku: string }>) => {
  const { sku } = await params;
  const url = process.env.DB_URI || "";
  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected successfully to server");
  // Database Name
  const dbName = "reto_liverpool";
  const db = client.db(dbName);
  const collection = db.collection<Product>("produtos_liverpool");
  const product = await collection.findOne({ sku }, {projection: {_id: 0, Name:1, sku: 1, image: 1}});

  return (
    <div className="px-16 grid grid-cols-1 sm:grid-cols-2">
      {product ? (
        <ProductInfo product={product} />
      ) : (
        <h2 className="text-2xl font-semibold text-center">Producto no encontrado</h2>
      )}
    </div>
  );
};

export default Page;
