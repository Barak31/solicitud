
"use server";

import { z } from "zod";
import { generateApplicationSchema, ApplicationData, FullApplication } from "@/lib/schema";
import { translations } from "@/lib/translations";
// import { db, storage } from "@/lib/firebase.ts"; // Uncomment for backend implementation
// import { collection, addDoc } from "firebase/firestore"; 
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// This action now needs to handle the full application object
export async function submitApplication(values: FullApplication) {
  const t = translations.es; // Assuming 'es' for validation, could be passed from client

  if (!values.agent || !values.tenants || values.tenants.length === 0 || !values.guarantor) {
      return { error: "Incomplete application data." };
  }

  // Validate Tenants
  for (const tenant of values.tenants) {
    const tenantSchema = generateApplicationSchema(t, tenant.clientType);
    const validatedTenant = tenantSchema.safeParse(tenant);
    if (!validatedTenant.success) {
      console.error("Tenant validation failed:", validatedTenant.error.issues);
      return { error: "Invalid tenant fields!", issues: validatedTenant.error.issues };
    }
  }

  // Validate Guarantor
  const guarantorSchema = generateApplicationSchema(t, values.guarantor.clientType);
  const validatedGuarantor = guarantorSchema.safeParse(values.guarantor);
  if (!validatedGuarantor.success) {
    console.error("Guarantor validation failed:", validatedGuarantor.error.issues);
    return { error: "Invalid guarantor fields!", issues: validatedGuarantor.error.issues };
  }
  
  const validatedTenants = values.tenants.map(tenant => {
      const tenantSchema = generateApplicationSchema(t, tenant.clientType);
      return tenantSchema.parse(tenant);
  });

  const data = {
      agent: values.agent,
      tenants: validatedTenants,
      guarantor: validatedGuarantor.data
  };

  // Backend Integration Point:
  // The frontend part is done. The data is validated and ready.
  // Now, the backend developer needs to implement the logic below.
  
  // TODO: Implement Firebase logic here.
  // 1. Upload files to Cloud Storage:
  //    - Iterate through `data.tenants` and `data.guarantor` to find file objects.
  //    - For each file, create a unique path (e.g., `applications/{applicationId}/{fileName}`).
  //    - Use `uploadBytes(storageRef, file)` to upload the file.
  //    - Get the download URL using `getDownloadURL(storageRef)`.
  //    - Replace the file object in the `data` with the download URL string.

  // 2. Save data to Firestore:
  //    - Once all files are uploaded and URLs are in the `data` object, save it to Firestore.
  //    - Use `addDoc(collection(db, "rental_applications"), data);`

  // 3. Send email notifications:
  //    - After saving to Firestore, trigger an email to `data.agent.email`.
  //    - Send a summary notification to `info@miscasasrd.com`.
  //    - This can be done using a Firebase Function triggered by the new Firestore document,
  //      or by using a third-party email service SDK here.

  console.log("Full application received (Ready for Firebase):", JSON.stringify(data, null, 2));
  console.log(`TODO: Upload files, save to Firestore, and then email this data to ${data.agent.email} and a notification to info@miscasasrd.com`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate a successful submission
  return { success: "¡Solicitud completa enviada con éxito!", data };
}
