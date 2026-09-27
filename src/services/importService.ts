import { apiUrl } from "./api";

export const importService = {
  async upload(file: File) {
    const form = new FormData();

    form.append("file", file);

    const response = await fetch(
      apiUrl("/transactions/import-csv.php"),
      {
        method: "POST",
        credentials: "include",
        body: form,
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "CSV import failed.",
      );
    }

    return result as {
      success: true;
      message: string;
      data: {
        inserted: number;
        skipped: number;
      };
    };
  },
};