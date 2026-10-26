"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export function Studio() {
  return (
    <div className="h-dvh">
      <NextStudio config={config} />
    </div>
  );
}
