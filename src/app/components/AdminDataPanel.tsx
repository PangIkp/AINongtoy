"use client";

import React from "react";

interface AdminDataPanelProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  toolbar: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminDataPanel({
  eyebrow,
  title,
  description,
  toolbar,
  children,
}: AdminDataPanelProps) {
  return (
    <section className="mt-8 flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-4 px-2 pb-6 sm:px-2 lg:flex-row lg:items-end lg:justify-between">
        {(eyebrow || title || description) && (
          <div>
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-sm leading-7 text-[#aebddb]">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
          {toolbar}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}
