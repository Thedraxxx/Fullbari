import z from "zod";

const categoryValidate = z.object({
  categoryName: z.string().nonempty({ message: "This field cannot be empty." }),
  discription: z.string().optional(),
  isActive: z.boolean().optional().default(true)
});

export type ICategory = z.infer<typeof categoryValidate>;
export {categoryValidate}