"use client";

import { useState } from "react";
import { PoemCard } from "@/components/poem/PoemCard";
import { PoemNav } from "@/components/poem/PoemNav";
import { getPoemForDate } from "@/lib/poems";
import { getDateString, formatDateEN } from "@/lib/utils";

export default function PoemPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const dateStr = getDateString(dayOffset);
  const poem = getPoemForDate(dateStr);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PoemNav
        onPrev={() => setDayOffset((d) => d - 1)}
        onNext={() => setDayOffset((d) => d + 1)}
        canPrev={dayOffset > -7}
        canNext={dayOffset < 0}
        dateLabel={formatDateEN(dateStr)}
      />

      <div className="py-8">
        <PoemCard key={dateStr} poem={poem} variant="full" />
      </div>
    </div>
  );
}
