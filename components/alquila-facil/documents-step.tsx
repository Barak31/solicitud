
"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/context/language-context";
import { FileUploader } from "./file-uploader";
import type { ClientType } from "@/lib/schema";

type Props = {
  form: UseFormReturn<any>; // Allow any for multi-tenant form structure
  fieldPrefix: string;
  clientType: ClientType;
};

export function DocumentsStep({ form, fieldPrefix, clientType }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.documents;

  const renderIndividualDocs = () => (
    <div className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <FormField
                control={form.control}
                name={`${fieldPrefix}workLetter`}
                render={({ field }) => (
                <FormItem className="flex flex-col h-full">
                    <FormLabel>{t.workLetter}</FormLabel>
                    <FormControl className="flex-grow">
                        <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${fieldPrefix}bankStatements`}
                render={({ field }) => (
                <FormItem className="flex flex-col h-full">
                    <FormLabel>{t.bankStatements}</FormLabel>
                    <FormControl className="flex-grow">
                        <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${fieldPrefix}identityCard`}
                render={({ field }) => (
                <FormItem className="flex flex-col h-full">
                    <FormLabel>{t.identityCard}</FormLabel>
                    <FormControl className="flex-grow">
                        <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${fieldPrefix}datacredito`}
                render={({ field }) => (
                <FormItem className="flex flex-col h-full">
                    <FormLabel>{t.datacredito}</FormLabel>
                    <FormControl className="flex-grow">
                        <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
    </div>
  );

  const renderCompanyDocs = () => {
    const tCompany = t.companyDocuments;
    return (
        <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}mercantileRegistry`}
                    render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                        <FormLabel>{tCompany.mercantileRegistry}</FormLabel>
                        <FormControl className="flex-grow">
                            <FileUploader
                                value={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}representativeId`}
                    render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                        <FormLabel>{tCompany.representativeId}</FormLabel>
                        <FormControl className="flex-grow">
                            <FileUploader
                                value={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}assemblyAct`}
                    render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                        <FormLabel>{tCompany.assemblyAct}</FormLabel>
                        <FormControl className="flex-grow">
                            <FileUploader
                                value={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}bankStatements`}
                    render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                        <FormLabel>{tCompany.bankStatements}</FormLabel>
                        <FormControl className="flex-grow">
                            <FileUploader
                                value={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`${fieldPrefix}datacredito`}
                    render={({ field }) => (
                    <FormItem className="flex flex-col h-full">
                        <FormLabel>{tCompany.datacredito}</FormLabel>
                        <FormControl className="flex-grow">
                            <FileUploader
                                value={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>
    )
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {clientType === 'individual' ? renderIndividualDocs() : renderCompanyDocs()}
      </div>
    </Form>
  );
}
