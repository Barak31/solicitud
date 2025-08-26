
"use client";

import { Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import type { ClientType } from "@/lib/schema";

type Props = {
    onSelect: (type: ClientType) => void;
    title: string;
}

export function ClientTypeSelector({ onSelect, title }: Props) {
    const { dictionary } = useLanguage();
    const t = dictionary.clientType;
    
    return (
        <div className="flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
            <h2 className="text-3xl font-bold font-headline">{title}</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-4 w-full max-w-2xl">
                <Card 
                    className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                    onClick={() => onSelect('individual')}
                >
                    <CardHeader className="items-center text-center">
                        <User className="h-12 w-12 mb-4 text-primary" />
                        <CardTitle>{t.individual}</CardTitle>
                        <CardDescription>{t.individualDescription}</CardDescription>
                    </CardHeader>
                </Card>
                <Card 
                    className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                    onClick={() => onSelect('company')}
                >
                    <CardHeader className="items-center text-center">
                        <Building className="h-12 w-12 mb-4 text-primary" />
                        <CardTitle>{t.company}</CardTitle>
                        <CardDescription>{t.companyDescription}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
