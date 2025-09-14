import z from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  content: z.string().trim().max(300, "Content must be at most 300 characters").optional().or(z.literal("")),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});
export type PostFormValues = z.infer<typeof postSchema>;
