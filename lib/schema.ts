
import { z } from "zod";
import type { translations } from "./translations";

export type ClientType = 'individual' | 'company';

const agentSchema = (t: (typeof translations)['es']) => z.object({
  name: z.string(),
  email: z.string().email(),
});

const individualSchemaBase = (t: (typeof translations)['es']) => z.object({
    clientType: z.literal('individual'),
    // Personal Information
    fullName: z.string().min(1, { message: t.validation.fullName.min }),
    email: z.string().email({ message: t.validation.email.invalid }),
    phone: z.string().min(1, { message: t.validation.phone.min }),
    dob: z.date({
        required_error: t.validation.dob.required,
        invalid_type_error: t.validation.dob.invalid,
    }),
    // Rental History
    currentAddress: z.string().min(1, { message: t.validation.currentAddress.min }),
    previousAddress: z.string().min(1, { message: t.validation.previousAddress.min }),
    landlordName: z.string().min(1, { message: t.validation.landlordName.min }),
    landlordPhone: z.string().min(1, { message: t.validation.landlordPhone.min }),
    reasonForLeaving: z.string().min(1, { message: t.validation.reasonForLeaving.min }),
    // Employment Information
    employmentStatus: z.enum(["employed", "unemployed", "student"], {
        required_error: t.validation.employmentStatus.required,
    }),
    employer: z.string().min(1, { message: t.validation.employer.min }),
    jobTitle: z.string().min(1, { message: t.validation.jobTitle.min }),
    monthlyIncome: z.coerce.number().min(0, { message: t.validation.monthlyIncome.min }),
    // Documents
    workLetter: z.any().optional(),
    bankStatements: z.any().optional(),
    identityCard: z.any().optional(),
    datacredito: z.any().optional(),
});

const companySchemaBase = (t: (typeof translations)['es']) => z.object({
    clientType: z.literal('company'),
    // Company Information
    companyName: z.string().min(1, { message: t.validation.companyName.min }),
    companyRNC: z.string().min(1, { message: t.validation.companyRNC.min }),
    companyAddress: z.string().min(1, { message: t.validation.companyAddress.min }),
    companyActivity: z.string().min(1, { message: t.validation.companyActivity.min }),
    companyPhoneOffice: z.string().min(1, { message: t.validation.phone.min }),
    companyPhoneCell: z.string().min(1, { message: t.validation.phone.min }),
    // Signer Information
    signerName: z.string().min(1, { message: t.validation.fullName.min }),
    signerRole: z.string().min(1, { message: t.validation.signerRole.min }),
    signerId: z.string().min(1, { message: t.validation.signerId.min }),
    // Company Documents
    mercantileRegistry: z.any().optional(),
    representativeId: z.any().optional(),
    assemblyAct: z.any().optional(),
    bankStatements: z.any().optional(),
    datacredito: z.any().optional(),
});

export const generateApplicationSchema = (t: (typeof translations)['es'], clientType: ClientType) => {
    if (clientType === 'individual') {
        return individualSchemaBase(t);
    }
    return companySchemaBase(t);
};

export const generateTenantSchema = (t: (typeof translations)['es'], clientType: ClientType, numberOfTenants: number) => {
    const baseSchema = clientType === 'individual' ? individualSchemaBase(t) : companySchemaBase(t);
    return z.object({
        tenants: z.array(baseSchema).length(numberOfTenants)
    });
}

// This is the data for a single entity (tenant or guarantor)
export type ApplicationData = z.infer<ReturnType<typeof individualSchemaBase>> | z.infer<ReturnType<typeof companySchemaBase>>;
export type Agent = z.infer<ReturnType<typeof agentSchema>>;

// This is the full application data, containing tenant, guarantor, and agent info
export interface FullApplication {
    agent: Agent | null;
    tenants: ApplicationData[];
    guarantor: ApplicationData | null;
}

    