export function extractApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (!error) return fallback;

  const responseData = (error as any)?.response?.data;

  if (responseData) {
    if (typeof responseData === "string") {
      return responseData;
    }
    if (typeof responseData === "object") {
      if ("title" in responseData) return String((responseData as any).title);
      if ("message" in responseData) return String((responseData as any).message);

      try {
        return JSON.stringify(responseData);
      } catch {
        return fallback;
      }
    }
  }
  return fallback;
}
