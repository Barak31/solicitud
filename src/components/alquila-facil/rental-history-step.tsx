
"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "./address-autocomplete";
import { useLanguage } from "@/context/language-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  form: UseFormReturn<any>; // Allow any for multi-tenant form structure
  fieldPrefix: string;
};

export function RentalHistoryStep({ form, fieldPrefix }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.rentalHistory;

  const housingType = form.watch(`${fieldPrefix}housingType`);

  return (
    <Form {...form}>
       <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">{t.title}</h2>
        <div className="space-y-6">
            <FormField
              control={form.control}
              name={`${fieldPrefix}currentAddress`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.currentAddress}</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                        value={field.value ?? ""}
                        onChange={(value) => field.onChange(value)}
                        placeholder={t.addressPlaceholder}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${fieldPrefix}housingType`}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t.housingSituation}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="rented" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t.rented}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="own" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t.own}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {housingType === 'rented' && (
              <>
                <FormField
                  control={form.control}
                  name={`${fieldPrefix}previousAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.previousAddress}</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value)}
                            placeholder={t.addressPlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name={`${fieldPrefix}landlordName`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.landlordName}</FormLabel>
                            <FormControl>
                            <Input placeholder="Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`${fieldPrefix}landlordPhone`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.landlordPhone}</FormLabel>
                            <FormControl>
                            <Input type="tel" placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
                 <FormField
                    control={form.control}
                    name={`${fieldPrefix}reasonForLeaving`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.reasonForLeaving}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.reasonForLeavingPlaceholder}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </>
            )}
        </div>
      </div>
    </Form>
  );
}

    