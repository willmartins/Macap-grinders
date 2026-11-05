"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { EnquiryGrinder } from "@/lib/enquiry";

const EnquiryGrinderContext = createContext<EnquiryGrinder | null>(null);

export function EnquiryGrinderProvider({
  grinder,
  children,
}: {
  grinder: EnquiryGrinder | null;
  children: ReactNode;
}) {
  return <EnquiryGrinderContext.Provider value={grinder}>{children}</EnquiryGrinderContext.Provider>;
}

export function useEnquiryGrinder(): EnquiryGrinder | null {
  return useContext(EnquiryGrinderContext);
}
