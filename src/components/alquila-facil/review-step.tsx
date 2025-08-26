
"use client";

import { forwardRef } from "react";
import type { FullApplication } from "@/lib/schema";
import { useLanguage } from "@/context/language-context";
import { ReviewCard } from "./review-card";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./logo";

type Props = {
  application: FullApplication;
  onEditTenant: () => void;
  onEditGuarantor: () => void;
};

export const ReviewStep = forwardRef<HTMLDivElement, Props>(({ application, onEditTenant, onEditGuarantor }, ref) => {
  const { dictionary } = useLanguage();
  const t = dictionary.review;
  const { tenants, guarantor } = application;

  if (!tenants || tenants.length === 0 || !guarantor) return null;

  const today = new Date().toLocaleDateString(dictionary.language === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 bg-white text-black p-8 rounded-lg" ref={ref}>
      <header className="flex justify-between items-center border-b-2 border-black pb-4">
        <div className="max-w-[200px]">
          <Logo />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">{dictionary.page.title}</h2>
          <p className="text-sm">Fecha: {today}</p>
        </div>
      </header>
      
      <div className="space-y-8">
        {/* Tenant Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300">{t.tenantInfo}</h3>
          {tenants.map((tenant, index) => (
              <div key={index} className="mb-6 last:mb-0">
                  {tenants.length > 1 && <h4 className="text-lg font-semibold text-primary mb-3">{`${t.tenant} #${index + 1}`}</h4>}
                  <ReviewCard data={tenant} />
                   {index < tenants.length - 1 && <Separator className="my-6" />}
              </div>
          ))}
        </div>
        
        <Separator className="my-8 bg-gray-400" />

        {/* Guarantor Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300">{t.guarantorInfo}</h3>
          <ReviewCard data={guarantor} />
        </div>
      </div>


      {/* Signature Section */}
      <div className="pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {tenants.map((tenant, index) => (
                <div key={`tenant-sig-${index}`} className="border-t-2 border-black pt-2">
                    <p className="font-semibold">{tenant.clientType === 'individual' ? tenant.fullName : tenant.companyName}</p>
                    <p className="text-sm text-gray-600">{`${t.tenant} #${index + 1}`}</p>
                </div>
            ))}
            {guarantor && (
                 <div className="border-t-2 border-black pt-2">
                    <p className="font-semibold">{guarantor.clientType === 'individual' ? guarantor.fullName : guarantor.companyName}</p>
                    <p className="text-sm text-gray-600">{t.guarantor}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
});

ReviewStep.displayName = "ReviewStep";
