import { AnchorError } from "@coral-xyz/anchor";

const isAnchorError = (error: unknown): error is AnchorError => {
  return (
    error instanceof AnchorError &&
    error.error &&
    typeof error.error.errorCode === "number" &&
    typeof error.error.errorMessage === "string"
  );
};

export const parseTxError = (error: unknown): string => {
  // First check if it's an AnchorError with the expected structure
  if (isAnchorError(error)) {
    return error.error.errorMessage;
  }

  // Check if it's an AnchorError but with a different structure
  if (error instanceof AnchorError) {
    // Try to extract from the error object first
    if (error.error && error.error.errorMessage) {
      return error.error.errorMessage;
    }

    // Fallback to parsing the message using regex
    const message = error.message || error.toString();
    const match = message.match(/Error Message: (.+?)(?:\.|$)/);
    if (match) {
      return match[1];
    }
  }

  // Check if it's a regular Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Check if it's already a string
  if (typeof error === "string") {
    return error;
  }

  // Check if it's an object with a message property
  if (error && typeof error === "object" && "message" in error) {
    const errorObj = error as { message: unknown };
    if (typeof errorObj.message === "string") {
      return errorObj.message;
    }
  }

  // Fallback for unknown error types
  return "An unknown error occurred";
};
