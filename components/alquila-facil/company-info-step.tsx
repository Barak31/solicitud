
"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ApplicationData } from "@/lib/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "./address-autocomplete";
import { useLanguage } from "@/context/language-context";

type Props = {
  form: UseFormReturn<any>; // Allow any for multi-tenant form structure
  fieldPrefix?: string;
};

export function CompanyInfoStep({ form, fieldPrefix = "" }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.companyInfo;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">{t.title}</h2>
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}companyName`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.companyName}</FormLabel>
                        <FormControl>
                        <Input placeholder="InmoBusiness S.R.L" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}companyRNC`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.companyRNC}</FormLabel>
                        <FormControl>
                        <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name={`${fieldPrefix}companyAddress`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.companyAddress}</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                        value={field.value ?? ""}
                        onChange={(value) => field.onChange(value)}
                        placeholder={dictionary.rentalHistory.addressPlaceholder}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name={`${fieldPrefix}companyActivity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.companyActivity}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Desarrollo de Software"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}companyPhoneOffice`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.companyPhoneOffice}</FormLabel>
                        <FormControl>
                        <Input type="tel" placeholder="(809) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}companyPhoneCell`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.companyPhoneCell}</FormLabel>
                        <FormControl>
                        <Input type="tel" placeholder="(829) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <hr className="my-6" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}signerName`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.signerName}</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}signerRole`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.signerRole}</FormLabel>
                        <FormControl>
                        <Input placeholder="Gerente General" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
             <FormField
                control={form.control}
                name={`${fieldPrefix}signerId`}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t.signerId}</FormLabel>
                    <FormControl>
                    <Input placeholder="001-1234567-8" {...field} />
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
