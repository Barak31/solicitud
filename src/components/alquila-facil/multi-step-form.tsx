
"use client";

import { useState, useMemo } from "react";
import { useForm, useFieldArray, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateApplicationSchema, generateTenantSchema, type ApplicationData, type ClientType } from "@/lib/schema";
import { useLanguage } from "@/context/language-context";

import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { FormStepper } from "./form-stepper";
import { PersonalInfoStep } from "./personal-info-step";
import { RentalHistoryStep } from "./rental-history-step";
import { EmploymentInfoStep } from "./employment-info-step";
import { CompanyInfoStep } from "./company-info-step";
import { DocumentsStep } from "./documents-step";

type Props = {
  clientType: ClientType;
  onFormSubmit: (data: any) => void;
  formRole: 'tenant' | 'guarantor';
  title: string;
  applicationData?: any;
  numberOfTenants?: number;
}

export function MultiStepForm({ clientType, onFormSubmit, formRole, title, applicationData, numberOfTenants = 1 }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const { dictionary } = useLanguage();

  const individualSteps = useMemo(() => [
      { id: dictionary.stepper.step1.id, name: dictionary.stepper.step1.name, fields: ['fullName', 'email', 'phone', 'dob'] },
      { id: dictionary.stepper.step2.id, name: dictionary.stepper.step2.name, fields: ['currentAddress', 'previousAddress', 'landlordName', 'landlordPhone', 'reasonForLeaving'] },
      { id: dictionary.stepper.step3.id, name: dictionary.stepper.step3.name, fields: ['employmentStatus', 'employer', 'jobTitle', 'monthlyIncome'] },
      { id: dictionary.stepper.step4.id, name: dictionary.stepper.step4.name, fields: ['workLetter', 'bankStatements', 'identityCard', 'datacredito'] },
    ], [dictionary]);

  const companySteps = useMemo(() => [
      { id: dictionary.stepper.step1_company.id, name: dictionary.stepper.step1_company.name, fields: ['companyName', 'companyRNC', 'companyAddress', 'companyActivity', 'companyPhoneOffice', 'companyPhoneCell', 'signerName', 'signerRole', 'signerId'] },
      { id: dictionary.stepper.step2_company.id, name: dictionary.stepper.step4.name, fields: ['mercantileRegistry', 'representativeId', 'assemblyAct', 'bankStatements', 'datacredito'] },
    ], [dictionary]);

  const steps = clientType === 'individual' ? individualSteps : companySteps;

  const dynamicSchema = useMemo(() => {
    return formRole === 'tenant' ? generateTenantSchema(dictionary, clientType, numberOfTenants) : generateApplicationSchema(dictionary, clientType)
  }, [dictionary, clientType, numberOfTenants, formRole]);

  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: applicationData,
    mode: "onBlur"
  });

  const { control, trigger, getValues } = form;
  const { fields } = useFieldArray({
    control,
    name: "tenants"
  });
  
  const handleNext = async () => {
    let isValid = true;
    const currentFields = steps[currentStep].fields;

    if (formRole === 'tenant') {
        for (let i = 0; i < fields.length; i++) {
            const fieldsToValidate = currentFields.map(field => `tenants.${i}.${field}`) as FieldPath<any>[];
            const result = await trigger(fieldsToValidate);
            if (!result) isValid = false;
        }
    } else {
        const fieldsToValidate = currentFields.map(field => field) as FieldPath<any>[];
        isValid = await trigger(fieldsToValidate);
    }

    if (isValid) {
        setCurrentStep(step => step + 1);
    }
  };

  const handleFinalStep = async () => {
    const isValid = await trigger();
    if (isValid) {
        const data = getValues();
        onFormSubmit(data);
    }
  }
  
  const renderTenantForms = (StepComponent: React.ElementType, props: any = {}) => {
    if (formRole === 'tenant') {
        if (StepComponent === RentalHistoryStep && numberOfTenants > 1) {
            return (
                <>
                    <h3 className="text-xl font-semibold mb-4">{dictionary.rentalHistory.sharedTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{dictionary.rentalHistory.sharedDescription}</p>
                    <RentalHistoryStep form={form} fieldPrefix={`tenants.0.`} {...props} />
                </>
            );
        }
      
        return fields.map((field, index) => (
            <div key={field.id}>
                {numberOfTenants > 1 && (
                    <>
                        <h3 className="text-xl font-semibold">{`${dictionary.review.tenant} #${index + 1}`}</h3>
                        <Separator className="my-4" />
                    </>
                )}
                <StepComponent form={form} fieldPrefix={`tenants.${index}.`} clientType={clientType} {...props} />
                 {numberOfTenants > 1 && index < fields.length - 1 && <Separator className="my-8" />}
            </div>
        ));
    }
    return <StepComponent form={form} fieldPrefix="" clientType={clientType} {...props} />
  }

  const renderStep = () => {
    if (clientType === 'individual') {
        switch (currentStep) {
            case 0: return renderTenantForms(PersonalInfoStep);
            case 1: return renderTenantForms(RentalHistoryStep);
            case 2: return renderTenantForms(EmploymentInfoStep);
            case 3: return (
                <>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold font-headline">{dictionary.documents.title}</h2>
                        <p className="text-muted-foreground">{dictionary.documents.description}</p>
                    </div>
                    {renderTenantForms(DocumentsStep)}
                </>
            );
            default: return null;
        }
    } else { // Company
        switch (currentStep) {
            case 0: return renderTenantForms(CompanyInfoStep);
            case 1: return (
                <>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold font-headline">{dictionary.documents.companyDocuments.title}</h2>
                        <p className="text-muted-foreground">{dictionary.documents.companyDocuments.description}</p>
                    </div>
                    {renderTenantForms(DocumentsStep)}
                </>
            );
            default: return null;
        }
    }
  }

  return (
    <div className="w-full">
      <CardHeader>
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <FormStepper steps={steps} currentStep={currentStep} />
      </CardHeader>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent className="min-h-[450px] py-8">
            {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div>
            {currentStep > 0 && (
              <Button type="button" onClick={() => setCurrentStep(step => step - 1)} variant="outline">
                {dictionary.buttons.back}
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length -1 ? (
              <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                {dictionary.buttons.nextStep}
              </Button>
            ) : (
               <Button type="button" onClick={handleFinalStep} className="bg-accent hover:bg-accent/90">
                 {formRole === 'tenant' ? dictionary.buttons.continueToGuarantor : dictionary.buttons.review}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </div>
  );
}
