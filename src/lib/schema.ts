
import { z } from "zod";
import type { translations } from "./translations";

export type ClientType = 'individual' | 'company';

const agentSchema = (t: (typeof translations)['es']) => z.object({
  name: z.string(),
  email: z.string().email(),
});

const fileSchema = (t: (typeof translations)['es']) => z.instanceof(File, { message: t.validation.file.required }).refine(file => file.size > 0, t.validation.file.required);

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
    housingType: z.enum(['rented', 'own'], { required_error: t.validation.housingType.required }),
    previousAddress: z.string().optional(),
    landlordName: z.string().optional(),
    landlordPhone: z.string().optional(),
    reasonForLeaving: z.string().optional(),
    // Employment Information
    employmentStatus: z.enum(["employed", "unemployed", "student"], {
        required_error: t.validation.employmentStatus.required,
    }),
    employer: z.string().min(1, { message: t.validation.employer.min }),
    jobTitle: z.string().min(1, { message: t.validation.jobTitle.min }),
    monthlyIncome: z.coerce.number().min(1, { message: t.validation.monthlyIncome.min }),
    // Documents
    workLetter: fileSchema(t),
    bankStatements: fileSchema(t),
    identityCard: fileSchema(t),
    datacredito: fileSchema(t),
}).superRefine((data, ctx) => {
    if (data.housingType === 'rented') {
        if (!data.previousAddress || data.previousAddress.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.validation.previousAddress.min, path: ['previousAddress'] });
        }
        if (!data.landlordName || data.landlordName.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.validation.landlordName.min, path: ['landlordName'] });
        }
        if (!data.landlordPhone || data.landlordPhone.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.validation.landlordPhone.min, path: ['landlordPhone'] });
        }
        if (!data.reasonForLeaving || data.reasonForLeaving.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: t.validation.reasonForLeaving.min, path: ['reasonForLeaving'] });
        }
    }
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
    mercantileRegistry: fileSchema(t),
    representativeId: fileSchema(t),
    assemblyAct: fileSchema(t),
    bankStatements: fileSchema(t),
    datacredito: fileSchema(t),
});

export const generateApplicationSchema = (t: (typeof translations)['es'], clientType: ClientType) => {
    return clientType === 'individual' ? individualSchemaBase(t) : companySchemaBase(t);
};

export const generateTenantSchema = (t: (typeof translations)['es'], clientType: ClientType, numberOfTenants: number) => {
    const baseSchema = generateApplicationSchema(t, clientType);
    return z.object({
        tenants: z.array(baseSchema).length(numberOfTenants, { message: `Deben haber exactamente ${numberOfTenants} inquilinos.`})
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

    