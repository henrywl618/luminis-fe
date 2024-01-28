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
                console.log(csvOutput);
                const formData = new FormData();
                formData.append("csv", csvOutput);
                console.log(formData.get("csv"));
                const options = {
                    method: "POST",
                    body: formData,
                };
                fetch("http://127.0.0.1:5000/encounters", options)
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
            <h1> CSV Generator </h1>
            <form>
                <input
                    type="file"
                    id="fileUpload"
                    name="fileUpload"
                    accept=".csv"
                    onChange={handleOnChange}
                />
                <input
                    type="submit"
                    className="border-2 rounded px-2 py-1 bg-white"
                    onClick={(e) => handleOnSubmit(e)}
                />
            </form>
            {csvData ? (
                <>
                    <CSVLink data={csvData}>Download CSV</CSVLink>{" "}
                    <Table csvData={csvData}></Table>
                </>
            ) : null}
        </main>
    );
}
