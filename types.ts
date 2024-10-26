export type Product = {
    sku: string,
    Name: string,
    image: string
  };

 export type PageProps<T> = {
    params: Promise<T>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };