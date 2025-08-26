
"use client";

import { useState } from "react";
import { Briefcase, Check } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/schema";

type Props = {
    onSelect: (agent: Agent) => void;
};

export function AgentSelector({ onSelect }: Props) {
    const { dictionary } = useLanguage();
    const t = dictionary.agentSelector;
    const [selectedAgentEmail, setSelectedAgentEmail] = useState<string>("");

    const handleContinue = () => {
        const selectedAgent = t.agents.find(agent => agent.email === selectedAgentEmail);
        if (selectedAgent) {
            onSelect(selectedAgent);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center text-center gap-6 p-4 md:p-8 min-h-[400px]">
            <Briefcase className="h-12 w-12 text-primary" />
            <h2 className="text-3xl font-bold font-headline">{t.title}</h2>
            <p className="max-w-md text-muted-foreground">{t.description}</p>
            
            <div className="w-full max-w-sm mt-4">
                 <Select value={selectedAgentEmail} onValueChange={setSelectedAgentEmail}>
                    <SelectTrigger>
                        <SelectValue placeholder={t.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {t.agents.map((agent) => (
                            <SelectItem key={agent.email} value={agent.email}>
                                {agent.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-8">
                <Button 
                    onClick={handleContinue} 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    disabled={!selectedAgentEmail}
                >
                    <Check className="mr-2 h-5 w-5" />
                    {t.button}
                </Button>
            </div>
        </div>
    );
}

    