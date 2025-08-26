
"use client";

import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { ApplicationData } from "@/lib/schema";
import { useLanguage } from "@/context/language-context";

type Props = {
  data: ApplicationData;
  title?: string;
  clientType?: 'individual' | 'company';
};

const ReviewItem = ({ label, value }: { label: string; value?: string | number | null | React.ReactNode; }) => {
    const { dictionary } = useLanguage();
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="font-medium text-sm">{value}</p>
        </div>
    )
};

const SectionTitle = ({ title }: { title: string }) => (
    <h4 className="text-base font-semibold mt-6 mb-3 col-span-full">{title}</h4>
);


export function ReviewCard({ data }: Props) {
  const { language, dictionary } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const renderIndividualReview = () => {
    const t_personal = dictionary.personalInfo;
    const t_rental = dictionary.rentalHistory;
    const t_employment = dictionary.employmentInfo;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <SectionTitle title={t_personal.title} />
                <ReviewItem label={t_personal.fullName} value={data.fullName} />
                <ReviewItem label={t_personal.email} value={data.email} />
                <ReviewItem label={t_personal.phone} value={data.phone} />
                <ReviewItem label={t_personal.dob} value={data.dob ? format(new Date(data.dob), "PPP", { locale }) : ''} />
            
                <SectionTitle title={t_rental.title} />
                <ReviewItem label={t_rental.currentAddress} value={data.currentAddress} />
                <ReviewItem label={t_rental.previousAddress} value={data.previousAddress} />
                <ReviewItem label={t_rental.landlordName} value={data.landlordName} />
                <ReviewItem label={t_rental.landlordPhone} value={data.landlordPhone} />
                <div className="md:col-span-3">
                    <ReviewItem label={t_rental.reasonForLeaving} value={data.reasonForLeaving} />
                </div>

                <SectionTitle title={t_employment.title} />
                <ReviewItem label={t_employment.employmentStatus} value={data.employmentStatus ? dictionary.employmentInfo[data.employmentStatus as keyof typeof dictionary.employmentInfo] : ''} />
                <ReviewItem label={t_employment.employer} value={data.employer} />
                <ReviewItem label={t_employment.jobTitle} value={data.jobTitle} />
                <ReviewItem label={t_employment.monthlyIncome} value={data.monthlyIncome ? `$${data.monthlyIncome.toLocaleString()}` : ''} />
            </div>
        </div>
    )
  }

  const renderCompanyReview = () => {
    const t_company = dictionary.companyInfo;
    
    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <SectionTitle title={t_company.title} />
                <ReviewItem label={t_company.companyName} value={data.companyName} />
                <ReviewItem label={t_company.companyRNC} value={data.companyRNC} />
                <div className="md:col-span-3">
                 <ReviewItem label={t_company.companyAddress} value={data.companyAddress} />
                </div>
                <ReviewItem label={t_company.companyActivity} value={data.companyActivity} />
                <ReviewItem label={t_company.companyPhoneOffice} value={data.companyPhoneOffice} />
                <ReviewItem label={t_company.companyPhoneCell} value={data.companyPhoneCell} />

                <SectionTitle title={t_company.signerInfoTitle} />
                <ReviewItem label={t_company.signerName} value={data.signerName} />
                <ReviewItem label={t_company.signerRole} value={data.signerRole} />
                <ReviewItem label={t_company.signerId} value={data.signerId} />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-4">
        {data.clientType === 'individual' ? renderIndividualReview() : renderCompanyReview()}
    </div>
  );
}
