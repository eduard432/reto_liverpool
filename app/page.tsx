import React from "react";
import { AggregateOptions, MongoClient, Document } from "mongodb";
import Pagination from "@/components/Pagination";
import { PageProps, Product } from "@/types";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 56;


export const metadata = {
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function Home({ searchParams }: PageProps<{}>) {
  const { page, query } = await searchParams;
  const pageNumber = Number(page) || 1;
  const queryStr = query || "";

  const url = process.env.DB_URI || "";
  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected successfully to server");
  const dbName = "reto_liverpool";
  const db = client.db(dbName);
  const collection = db.collection<Product>("produtos_liverpool");
  const pipeline: Document[] = [
    { $skip: (pageNumber == 1 ? 0 : pageNumber) * PRODUCTS_PER_PAGE },
    { $limit: PRODUCTS_PER_PAGE },
  ]
  if(queryStr) {
    pipeline.unshift({
      $search: {
        index: "default",
        text: {
          query: queryStr,
          path: {
            wildcard: "*",
          },
        },
      },
    })
  }
  const products = collection.aggregate(pipeline);
  const productData = await products.toArray();

  return (
    <div className="">
      
      <main className="bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Productos
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {productData.map((product, i) => (
              <div key={i + 1} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    alt={product.Name}
                    src={product.image}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/product/${product.sku}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.Name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.sku}
                    </p>
                  </div>
                </div>
              </div>
            ))} 
          </div>
            {productData.length == 0 && <p className="text-center" >No se encontraron productos...</p>}
        </div>
      </main>
      <footer className="w-full py-2 flex justify-center">
        {
          productData.length >= PRODUCTS_PER_PAGE && (<Pagination pageQty={10} />)
        }
      </footer>
    </div>
  );
}
