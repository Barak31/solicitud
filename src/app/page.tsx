
"use client";

import { useState, useTransition, useRef } from "react";
import { MultiStepForm } from "@/components/alquila-facil/multi-step-form";
import { Logo } from "@/components/alquila-facil/logo";
import { LanguageSwitcher } from "@/components/alquila-facil/language-switcher";
import { useLanguage } from "@/context/language-context";
import { ClientTypeSelector } from "@/components/alquila-facil/client-type-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, FileText, Building, Clock, User, Info, HelpCircle } from "lucide-react";
import type { ClientType, ApplicationData, FullApplication, Agent } from "@/lib/schema";
import { submitApplication } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { ReviewStep } from "@/components/alquila-facil/review-step";
import { TenantCountSelector } from "@/components/alquila-facil/tenant-count-selector";
import { DownloadPDFButton } from "@/components/alquila-facil/download-pdf-button";
import { AgentSelector } from "@/components/alquila-facil/agent-selector";


type FormStage = 'INSTRUCTIONS' | 'AGENT_SELECT' | 'TENANT_SELECT' | 'TENANT_COUNT_SELECT' | 'TENANT_FORM' | 'GUARANTOR_SELECT' | 'GUARANTOR_FORM' | 'REVIEW' | 'SUBMITTED';

export default function Home() {
  const { dictionary } = useLanguage();
  const [stage, setStage] = useState<FormStage>('INSTRUCTIONS');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [numberOfTenants, setNumberOfTenants] = useState<1 | 2>(1);
  
  const [application, setApplication] = useState<FullApplication>({
    agent: null,
    tenants: [],
    guarantor: null,
  });

  const reviewRef = useRef<HTMLDivElement>(null);

  const handleBack = (targetStage: FormStage) => {
    setStage(targetStage);
  };
  
  const handleAgentSelect = (agent: Agent) => {
    setApplication(prev => ({ ...prev, agent }));
    setStage('TENANT_SELECT');
  };

  const handleTenantCountSelect = (count: 1 | 2) => {
    setNumberOfTenants(count);
    const initialTenants = Array.from({ length: count }, () => ({
        clientType: 'individual' as const,
        fullName: '', email: '', phone: '', dob: undefined,
        currentAddress: '', housingType: undefined, previousAddress: '', landlordName: '', landlordPhone: '', reasonForLeaving: '',
        employmentStatus: undefined, employer: '', jobTitle: '', monthlyIncome: 0,
        workLetter: null, bankStatements: null, identityCard: null, datacredito: null,
      }));
    setApplication(prev => ({ ...prev, tenants: initialTenants }));
    setStage('TENANT_FORM');
  };

  const handleTenantTypeSelect = (type: ClientType) => {
    if (type === 'individual') {
        setStage('TENANT_COUNT_SELECT');
    } else { // company
        setNumberOfTenants(1);
        const companyTenant: ApplicationData = {
          clientType: 'company',
          companyName: '', companyRNC: '', companyAddress: '', companyActivity: '',
          companyPhoneOffice: '', companyPhoneCell: '', signerName: '', signerRole: '', signerId: '',
          mercantileRegistry: null, representativeId: null, assemblyAct: null, bankStatements: null, datacredito: null,
        };
        setApplication(prev => ({ ...prev, tenants: [companyTenant] }));
        setStage('TENANT_FORM');
    }
  };
  
  const handleGuarantorTypeSelect = (type: ClientType) => {
    const guarantorData: ApplicationData = type === 'individual' ? 
      { clientType: 'individual', fullName: '', email: '', phone: '', dob: undefined, currentAddress: '', housingType: undefined, previousAddress: '', landlordName: '', landlordPhone: '', reasonForLeaving: '', employmentStatus: undefined, employer: '', jobTitle: '', monthlyIncome: 0, workLetter: null, bankStatements: null, identityCard: null, datacredito: null } :
      { clientType: 'company', companyName: '', companyRNC: '', companyAddress: '', companyActivity: '', companyPhoneOffice: '', companyPhoneCell: '', signerName: '', signerRole: '', signerId: '', mercantileRegistry: null, representativeId: null, assemblyAct: null, bankStatements: null, datacredito: null };
    
    setApplication(prev => ({ ...prev, guarantor: guarantorData }));
    setStage('GUARANTOR_FORM');
  };

  const handleTenantFormSubmit = (data: { tenants: ApplicationData[] }) => {
    setApplication(prev => ({ ...prev, tenants: data.tenants }));
    setStage('GUARANTOR_SELECT');
  }

  const handleGuarantorFormSubmit = (data: ApplicationData) => {
    setApplication(prev => ({ ...prev, guarantor: data }));
    setStage('REVIEW');
  }

  const handleFinalSubmit = () => {
    startTransition(async () => {
        if (!application.guarantor || application.tenants.length === 0 || !application.agent) {
            toast({
                title: "Error",
                description: "La aplicación está incompleta.",
                variant: 'destructive',
            });
            return;
        }

        const result = await submitApplication(application as FullApplication);
        if (result.success) {
            setStage('SUBMITTED');
        } else {
            toast({
                title: dictionary.toasts.submitError.title,
                description: result.error || dictionary.toasts.submitError.description,
                variant: 'destructive',
            });
        }
    });
  }

  const handleEditTenant = () => {
    setStage('TENANT_FORM');
  };
  
  const handleEditGuarantor = () => {
    setStage('GUARANTOR_FORM');
  };

  const renderInstructionsStep = () => {
    const t = dictionary.instructions;
    const tDocs = dictionary.documents;

    const individualDocs = [
      tDocs.workLetter,
      tDocs.bankStatements,
      tDocs.identityCard,
      tDocs.datacredito,
    ];

    const companyDocs = [
      tDocs.companyDocuments.mercantileRegistry,
      tDocs.companyDocuments.representativeId,
      tDocs.companyDocuments.assemblyAct,
      tDocs.companyDocuments.bankStatements,
      tDocs.companyDocuments.datacredito,
    ];

    return (
      <div className="flex flex-col items-center justify-center text-center gap-6 p-4 md:p-8 min-h-[400px]">
        <h2 className="text-3xl font-bold font-headline">{t.title}</h2>
        <p className="max-w-3xl text-muted-foreground">{t.description}</p>
        
        <div className="w-full max-w-3xl grid md:grid-cols-2 gap-8 text-left mt-6">
          <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><User /> {t.docsIndividualTitle}</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {individualDocs.map(doc => <li key={doc}>{doc}</li>)}
              </ul>
          </div>
          <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Building /> {t.docsCompanyTitle}</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {companyDocs.map(doc => <li key={doc}>{doc}</li>)}
              </ul>
          </div>
        </div>
        
        <div className="w-full max-w-3xl text-left mt-6 border-t border-border pt-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Info className="h-5 w-5" />{t.recommendationsTitle}</h3>
            <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3 ml-2"><CheckCircle className="h-4 w-4 mt-1 text-primary" /><span><b>{t.formatsLabel}</b> {t.formats}</span></li>
                <li className="flex items-start gap-3 ml-2"><CheckCircle className="h-4 w-4 mt-1 text-primary" /><span><b>{t.weightLabel}</b> {t.weight}</span></li>
                <li className="flex items-start gap-3 ml-2"><Clock className="h-4 w-4 mt-1 text-primary" /><span><b>{t.timeLabel}</b> {t.time_updated}</span></li>
                <li className="flex items-start gap-3 ml-2"><HelpCircle className="h-4 w-4 mt-1 text-primary" /><span><b>{t.doubtsLabel}</b> {t.doubts}</span></li>
            </ul>
        </div>

        <div className="mt-8">
          <Button onClick={() => setStage('AGENT_SELECT')} size="lg" className="bg-primary hover:bg-primary/90">
            {t.readyButton}
          </Button>
        </div>
      </div>
    );
  }
  
  const renderContent = () => {
    switch(stage) {
      case 'INSTRUCTIONS':
        return renderInstructionsStep();
      case 'AGENT_SELECT':
        return <AgentSelector onSelect={handleAgentSelect} />;
      case 'TENANT_SELECT':
        return <ClientTypeSelector onSelect={handleTenantTypeSelect} title={dictionary.clientType.title} />;
      case 'TENANT_COUNT_SELECT':
        return <TenantCountSelector onSelect={handleTenantCountSelect} />;
      case 'TENANT_FORM':
        const clientType = application.tenants[0]?.clientType || 'individual';
        return <MultiStepForm
                  clientType={clientType}
                  onFormSubmit={handleTenantFormSubmit}
                  formRole="tenant"
                  key={`tenant-form-${numberOfTenants}`}
                  title={dictionary.page.title}
                  applicationData={{ tenants: application.tenants }}
                  numberOfTenants={numberOfTenants}
                />;
      case 'GUARANTOR_SELECT':
        return <ClientTypeSelector onSelect={handleGuarantorTypeSelect} title={dictionary.clientType.guarantorTitle} />;
      case 'GUARANTOR_FORM':
        if (!application.guarantor) return null; // Should not happen
        return <MultiStepForm
                  clientType={application.guarantor.clientType}
                  onFormSubmit={handleGuarantorFormSubmit}
                  formRole="guarantor"
                  key={'guarantor-form'}
                  title={dictionary.page.guarantorTitle}
                  applicationData={application.guarantor}
                  numberOfTenants={1}
                />;
      case 'REVIEW':
        return <ReviewStep 
                  ref={reviewRef}
                  application={application as FullApplication} 
                  onEditTenant={handleEditTenant}
                  onEditGuarantor={handleEditGuarantor}
                />;
      case 'SUBMITTED':
        return (
          <div className="w-full flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
            <CheckCircle className="h-20 w-20 text-accent" />
            <h2 className="text-3xl font-bold font-headline">{dictionary.success.title}</h2>
            <p className="text-muted-foreground text-lg max-w-md">
              {dictionary.success.message}
            </p>
            <Button onClick={() => window.location.reload()}>{dictionary.success.newApplication}</Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="w-full max-w-4xl z-10">
      <header className="flex flex-col items-center text-center mb-8 relative">
        <div className="absolute top-0 right-0">
          <LanguageSwitcher />
        </div>
        <div className="w-full mb-4">
          <Logo />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mt-4 font-headline tracking-tight text-white">
          {dictionary.page.title}
        </h1>
        <p className="mt-2 text-lg text-gray-200 max-w-2xl">
          {dictionary.page.description}
        </p>
      </header>

      <Card className="shadow-lg">
         <CardContent className="p-6">
            {renderContent()}
         </CardContent>
         {stage === 'REVIEW' && (
            <div className="flex justify-between items-center p-6 border-t">
                <DownloadPDFButton getElement={() => reviewRef.current} />
                <Button onClick={handleFinalSubmit} disabled={isPending} className="bg-accent hover:bg-accent/90">
                    {isPending ? <Loader2 className="animate-spin" /> : dictionary.buttons.submit}
                </Button>
            </div>
          )}
      </Card>
    </div>
  );
}

    