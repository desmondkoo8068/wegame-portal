"use client";
/**
 * StoreProvider: makes the Redux store available to every client component.
 *
 * - It's a Client Component ("use client") because Redux uses React context,
 *   which only exists in the browser-side React tree.
 * - The root layout (a Server Component) can still render it and pass server
 *   components in as `children`; they don't become client components.
 * - useState's lazy initializer creates the store exactly once per mount,
 *   so it survives re-renders but is never shared across visitors.
 */
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
