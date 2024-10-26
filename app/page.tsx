import Header from "@/components/Header";
import React from "react";
import { AggregateOptions, MongoClient, Document } from "mongodb";
import Pagination from "@/components/Pagination";

const maxElements = 52;

type Product = {
  name: string;
  main_category: string;
  sub_category: string;
  image: string;
  link: string;
  ratings: number;
  no_of_ratings: string;
  discount_price: string;
  actual_price: string;
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = {
  icons: {
    icon: '/favicon.ico', // /public path
  },
}

export default async function Home({ searchParams }: PageProps) {
  const { page, query } = await searchParams;
  const pageNumber = Number(page) || 1;
  const querytStr = query || "";

  const url =
    'mongodb+srv://edux:A9qLbLJZTlFmXzo0@cluster0.4ihwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"';
  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected successfully to server");
  // Database Name
  const dbName = "reto_liverpool";
  const db = client.db(dbName);
  const collection = db.collection<Product>("productos");
  const pipeline: Document[] = [
    { $skip: pageNumber * maxElements },
    { $limit: maxElements },
  ]
  if(querytStr) {
    pipeline.unshift({
      $search: {
        index: "default",
        text: {
          query: querytStr,
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
      <Header />
      <main className="bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Productos
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {productData.map((product, i) => (
              <div key={i + 1} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    alt={product.name}
                    src={product.image}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={"/"}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.sub_category}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.actual_price}
                  </p>
                </div>
              </div>
            ))} 
          </div>
            {productData.length == 0 && <p className="text-center" >No se encontraron productos...</p>}
        </div>
      </main>
      <footer className="w-full py-2 flex justify-center">
        <Pagination pageQty={10} />
      </footer>
    </div>
  );
}
