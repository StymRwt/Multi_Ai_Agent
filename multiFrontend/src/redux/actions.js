import { createAction } from "@reduxjs/toolkit";

// Dispatched on logout or an expired session. Every slice resets itself.
export const resetSession = createAction("session/reset");
