import { writeFile } from "fs/promises";
import Printer from "../printer";
import generateSolutionKeyService from "../services/generateSolutionKey";

export type GenerateSolutionKeyParams = {
    outputPath: string;
};

export default async (params: GenerateSolutionKeyParams) => {
    Printer.print("Generating solution key");

    const solutionKay = await generateSolutionKeyService();

    Printer.print("Saving solution key to " + params.outputPath);

    await writeFile(params.outputPath, solutionKay);

    Printer.print("Solution key was generated successfully");
};
