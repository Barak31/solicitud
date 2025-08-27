
"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";

type Props = {
  form: UseFormReturn<any>; // Allow any for multi-tenant form structure
  fieldPrefix: string;
};

export function EmploymentInfoStep({ form, fieldPrefix }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.employmentInfo;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={`${fieldPrefix}employmentStatus`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.employmentStatus}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.employmentStatusPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="employed">{t.employed}</SelectItem>
                    <SelectItem value="unemployed">{t.unemployed}</SelectItem>
                    <SelectItem value="student">{t.student}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name={`${fieldPrefix}monthlyIncome`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.monthlyIncome}</FormLabel>
                <FormControl>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                        <Input type="number" placeholder="3000" className="pl-7" {...field} />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${fieldPrefix}employer`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.employer}</FormLabel>
                <FormControl>
                  <Input placeholder="ACME Corporation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${fieldPrefix}jobTitle`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.jobTitle}</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
}

    