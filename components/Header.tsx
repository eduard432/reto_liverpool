"use client";
import React, { useEffect, useState } from "react";
import { FaCamera, FaSearch } from "react-icons/fa";
import OpenAI from "openai";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "./Spinner";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [fileData, setFileData] = useState("");
  const [loading, setLoading] = useState(false);


  const setSearch = (search: string) => {
    router.push(`/?page=1&query=${encodeURI(search)}`);
    setSearchInput("");
  };

  const handleSearch: React.FormEventHandler<HTMLFormElement> | undefined = (
    event
  ) => {
    event.preventDefault();
    setSearch(searchInput);
  };

  const handleSearchImage = async () => {
    setLoading(true)
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
              text: 'Asistente que etiqueta imagenes con 8 etiquetas en español, la más importante primero, utiliza sinónimos. Sé descriptivo. Responde por ejemplo: "anime, camiseta, negro, hombres"',
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
                url: `data:image/jpeg;base64,${fileData}`,
              },
            },
          ],
        },
      ],
    });
    setSearch(response.choices[0].message.content || "");
    setIsOpen(false)
    setLoading(false)
  };

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader?.result == "string") {
          const result = reader?.result?.split(",")[1]; // Eliminar la parte del encabezado "data:"
          setFileData(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFileData("");
    }
  }, [isOpen]);


  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel className="max-w-lg space-y-4 bg-white p-8 min-w-44 min-h-52">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <DialogTitle className="font-bold">
                  Sube una foto de lo que buscas
                </DialogTitle>
                <input
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={(event) => handleUpload(event)}
                  type="file"
                  className="flex w-96 h-60 bg-pink-100 border-dashed border-pink-600 border-2"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSearchImage()}
                    disabled={!fileData}
                    className="bg-main text-white px-5 py-2 disabled:opacity-35 "
                  >
                    Buscar
                  </button>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
      <header className="bg-main text-white px-10 py-6 text-3xl justify-between xs:flex-col md:flex space-y-2 items-center">
        <p className="text-center"><Link href="/" >Liverpool.com</Link></p>
        <div className="px-2 py-1 flex bg-white text-gray-500 justify-between items-center round-md w-full sm:w-1/3">
          <button
            className="focus:outline-none"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <FaCamera className="w-5" />
          </button>
          <form onSubmit={handleSearch} className="flex w-full" action="">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className=" text-sm text-black w-full mx-2 px-2 focus:outline-none"
              type="text"
              placeholder="Buscar producto..."
            />
            <button type="submit">
              <FaSearch className="w-5" />
            </button>
          </form>
        </div>
      </header>
    </>
  );
};

export default Header;
