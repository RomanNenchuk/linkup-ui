import z from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .min(3, "Content is too short")
    .max(300, "Content must be at most 300 characters"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
});
export type PostFormValues = z.infer<typeof postSchema>;
