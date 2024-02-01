"use client";
import {
    ChangeEvent,
    ChangeEventHandler,
    MouseEventHandler,
    useState,
} from "react";
import * as csv from "csv-parse";
import { CSVLink } from "react-csv";
import Table from "./table";
import { Encounter } from "./types";

const API_URL = process.env.ENCOUNTER_API_URL || "http://127.0.0.1:5000/encounters";

export default function Home() {
    const [file, setFile] = useState<File>();
    const [csvData, setCsvData] = useState<Encounter[]>();
    const filereader = new FileReader();

    const handleOnChange: ChangeEventHandler = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setFile(e.target.files?.[0]);
    };

    const handleOnSubmit: MouseEventHandler = (e) => {
        e.preventDefault();

        if (file) {
            filereader.onload = async (e) => {
                const csvOutput = e.target?.result as string;
                const formData = new FormData();
                formData.append("csv", csvOutput);
                const options = {
                    method: "POST",
                    body: formData,
                };
                fetch(API_URL, options)
                    .then((response) => response.json())
                    .then((data: string) => {
                        csv.parse(
                            data,
                            {
                                columns: true,
                            },
                            (err, results: Encounter[]) => {
                                if (err) {
                                    console.log(err);
                                }
                                setCsvData(results);
                            }
                        );
                    });
            };
            filereader.readAsText(file);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-center mb-4 text-4xl font-extrabold">
                Hospital Encounter Generator
            </h1>
            <form className="justify-center">
                <label
                    className="text-center block mb-2 text-l font-medium text-gray-900"
                    htmlFor="fileUpload"
                >
                    Upload Events CSV File
                </label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-200 dark:border-gray-300 dark:placeholder-gray-300"
                    aria-describedby="file_input_help"
                    type="file"
                    id="fileUpload"
                    name="fileUpload"
                    accept=".csv"
                    onChange={handleOnChange}
                />
                <div className="flex justify-center">
                    <input
                        type="submit"
                        className="block border border-gray-300 rounded px-2 py-1 bg-white my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={(e) => handleOnSubmit(e)}
                        value={"Process Events"}
                    />
                </div>
            </form>
            {csvData ? (
                <div className="flex flex-col justify-center mt-5">
                    <div className="flex justify-center">
                        <CSVLink
                            className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            data={csvData}
                            filename="encounters.csv"
                        >
                            Download Encounters CSV
                        </CSVLink>{" "}
                    </div>
                    <Table csvData={csvData}></Table>
                </div>
            ) : null}
        </main>
    );
}
