"use client";
import React, { useState } from "react";
import { FaCamera, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchDialog from "./SearchDialog";

const Header = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <SearchDialog
        setSearch={setSearch}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <header className="bg-main text-white px-10 py-6 text-3xl justify-between xs:flex-col md:flex space-y-2 items-center">
        <div className="flex justify-center">
          <Link href="/">
            {" "}
            <Image
              width={174}
              height={40}
              alt="Liverpool Logo"
              src="/liverpool_logo.svg"
            />
          </Link>
        </div>
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
