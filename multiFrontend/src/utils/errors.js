/** Turn any thrown value into a short, user-friendly message. */
export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  if (typeof error === "string") return error;

  if (error?.code === "ECONNABORTED") {
    return "The agent took too long to respond. Try again.";
  }
  if (error?.code === "ERR_NETWORK" || (error?.request && !error?.response)) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const status = error?.response?.status;
  if (status === 401) return "Your session has expired. Sign in again.";
  if (status === 429) return "Too many requests. Wait a moment, then try again.";
  if (status >= 500) return "The AI service had a problem. Try again in a moment.";

  const serverMessage = error?.response?.data?.message;
  if (status && typeof serverMessage === "string" && serverMessage.length < 200) {
    return serverMessage;
  }
  return fallback;
}
