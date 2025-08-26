
"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ApplicationData } from "@/lib/schema";
import { useLanguage } from "@/context/language-context";
import { ReviewCard } from "./review-card";

type Props = {
  form: UseFormReturn<ApplicationData>;
  goTo: (step: number) => void;
};

export function ReviewStep({ form, goTo }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.review;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-headline">{t.title}</h2>
      <p className="text-muted-foreground">
        {t.description}
      </p>

      <div className="space-y-4">
        <ReviewCard data={form.getValues()} goTo={goTo} />
      </div>
    </div>
  );
}
