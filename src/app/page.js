"use client";

import React from "react";
import * as XLSX from "xlsx";

import { SiMicrosoftexcel } from "react-icons/si";
import {
  BsFiletypeJson,
  BsBoxArrowUp,
  BsArrowRight,
  BsCheck2,
} from "react-icons/bs";
import { FiCopy } from "react-icons/fi";

import { AnimatePresence, motion } from "framer-motion";

const App = () => {
  const [data, setData] = React.useState();
  const [valueName, setValueName] = React.useState("");
  const [table, setTable] = React.useState(false);
  const [json, setJson] = React.useState(true);

  const [copy, setCopy] = React.useState(false);

  const toggleCopy = () => {
    setCopy(true);
    window.navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  React.useEffect(() => {
    setTimeout(() => {
      setCopy(false);
    }, 3500);
  }, [copy]);

  const nextJson = () => {
    setTable(true);
    setJson(false);
  };

  const backTable = () => {
    setTable(false);
    setJson(true);
  };

  const handleChangeFile = (e) => {
    const { files, value } = e.target;

    setValueName(value);

    const reader = new FileReader();
    reader.readAsBinaryString(files[0]);
    reader.onload = (e) => {
      const data = e?.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook?.SheetNames[0];
      const sheet = workbook?.Sheets[sheetName];
      const parsedData = XLSX?.utils?.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  return (
    <main className="w-full h-screen p-20 bg-gradient-to-b from-gray-950 to-gray-900 overflow-auto">
      {copy ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: 100 }}
            role="alert"
            className="bg-green-200 rounded-md flex items-center gap-3 p-3 md:w-[500px] fixed bottom-0 right-5 z-50"
          >
            <span>
              <svg
                className="text-green-600"
                data-testid="geist-icon"
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>

            <p className="text-green-900 sm:text-base text-sm">
              Copied to clipboard!
            </p>
          </motion.div>
        </AnimatePresence>
      ) : null}

      <div className="container mx-auto w-full h-full flex items-center justify-center flex-col">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-green-500 flex items-center gap-3 text-2xl">
            <SiMicrosoftexcel /> <BsArrowRight /> <BsFiletypeJson />
          </div>
          <h1 className=" bg-clip-text text-transparent bg-gradient-to-b from-green-500/60 to-green-500  text-5xl md:text-8xl font-extrabold max-w-6xl text-center">
            EXCEL TO JSON
          </h1>
          <p className="text-gray-500 text-center text-lg">
            Transforms an Excel or Google Sheets file to a JSON file.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <label
              htmlFor="fileInput"
              className="bg-green-500 px-5 py-2 rounded border border-green-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <BsBoxArrowUp /> Upload File
            </label>

            <input
              type="file"
              id="fileInput"
              className={"hidden"}
              onChange={handleChangeFile}
            />
          </div>
        </div>

        {!data ? null : (
          <>
            <div className="mt-10 flex items-center gap-5 border-b border-green-800/50 w-[250px] md:w-[800px]">
              <p
                className={
                  table
                    ? `text-green-800 cursor-pointer`
                    : `text-green-500 border-b border-green-500 cursor-pointer`
                }
                onClick={() => backTable()}
              >
                Table
              </p>
              <p
                className={
                  json
                    ? `text-green-800 cursor-pointer`
                    : `text-green-500 border-b border-green-500 cursor-pointer`
                }
                onClick={() => nextJson()}
              >
                Json
              </p>
            </div>

            {!table ? (
              <div className="overflow-x-auto w-[250px] md:w-[800px] max-w-[800px] max-h-[400px] border border-white/20 rounded-md mt-10">
                <table className="min-w-full divide-y-2 divide-gray-200/50 bg-transparent text-sm ">
                  <thead className="ltr:text-left rtl:text-right">
                    <tr className="bg-green-900">
                      {Object.keys(data[0]).map((key) => (
                        <th
                          key={key}
                          className="whitespace-nowrap px-4 py-2 font-medium text-start text-gray-100"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200/50">
                    {data?.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-green-100/50 hover:text-white text-gray-300"
                      >
                        {Object.values(row).map((value, index) => (
                          <td
                            key={index}
                            className="whitespace-nowrap px-4 py-2 font-light text-start"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <pre className="relative overflow-x-auto w-[250px] md:w-[800px] max-w-[800px] h-[400px] max-h-[400px] border border-white/20 rounded-md mt-10 text-white px-10 py-10">
                  <div className="absolute top-5 right-7">
                    {copy ? (
                      <span className="text-sm text-white bg-green-500  flex items-center gap-1 cursor-pointer border border-green-500 px-3 py-2 rounded transition-all">
                        <BsCheck2 /> Copied!
                      </span>
                    ) : (
                      <span
                        className="text-sm text-green-500 hover:text-white hover:bg-green-500 flex items-center gap-1 cursor-pointer border border-green-500 px-3 py-2 rounded transition-all"
                        onClick={() => toggleCopy()}
                      >
                        <FiCopy /> Copy
                      </span>
                    )}
                  </div>

                  {JSON.stringify(data, null, 2)}
                </pre>
              </>
            )}
          </>
        )}

        <div className="w-full pt-10 pb-5 flex items-center justify-center">
          <p className="text-gray-600">
            Created by{" "}
            <a
              href="https://nicoschonfeld.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500/50 hover:text-green-600 transition-all"
            >
              Nico Schönfeld.
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default App;
