
"use client";

import { User, Users } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

type Props = {
    onSelect: (count: 1 | 2) => void;
}

export function TenantCountSelector({ onSelect }: Props) {
    const { dictionary } = useLanguage();
    const t = dictionary.tenantCount;
    
    return (
        <div className="flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
            <h2 className="text-3xl font-bold font-headline">{t.title}</h2>
            <p className="text-muted-foreground max-w-md">{t.description}</p>
            <div className="grid md:grid-cols-2 gap-6 mt-4 w-full max-w-2xl">
                <Card 
                    className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                    onClick={() => onSelect(1)}
                >
                    <CardHeader className="items-center text-center">
                        <User className="h-12 w-12 mb-4 text-primary" />
                        <CardTitle>{t.one}</CardTitle>
                    </CardHeader>
                </Card>
                <Card 
                    className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                    onClick={() => onSelect(2)}
                >
                    <CardHeader className="items-center text-center">
                        <Users className="h-12 w-12 mb-4 text-primary" />
                        <CardTitle>{t.two}</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
