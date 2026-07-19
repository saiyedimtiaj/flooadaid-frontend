import { z } from "zod"

export const sosFormSchema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    districtId: z.number().nullable(),
    peopleCount: z.enum(["1", "2-5", "5-10", "10+"]).nullable(),
    helpTypes: z.array(z.string()),
    phone: z.string(),
    description: z.string().max(500),
    photoPreviews: z.array(z.string()),
    photoUrls: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.districtId === null) {
      ctx.addIssue({
        code: "custom",
        path: ["districtId"],
        message: "Select your district",
      })
    }
    if (data.peopleCount === null) {
      ctx.addIssue({
        code: "custom",
        path: ["peopleCount"],
        message: "Select the number of people",
      })
    }
    if (data.helpTypes.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["helpTypes"],
        message: "Select at least one type of help",
      })
    }
    if (!/^01\d{9}$/.test(data.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid Bangladeshi phone number",
      })
    }
  })

export type SOSFormData = z.infer<typeof sosFormSchema>
