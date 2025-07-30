"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ErrorState } from "@/app/user/lib/definitions";
import { z } from "zod";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Invalid price format.",
  }),
  isavailable: z.string().transform((val) => val === "true"),
  description: z.string().min(1),
  category: z.string().min(1),
  removeImage: z.string().optional(),
  image: z.any().optional(),
});

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function updateMenuItem(
  prevState: ErrorState,
  formData: FormData
): Promise<ErrorState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.issues.map((err) => err.message),
    };
  }

const { id, name, price, isavailable, description, category, removeImage } = parsed.data;

  const itemId = Number(id);
  const imageFile = formData.get("image") as File | null;

  let imageUrl: string | null = null;

  try {
    if (removeImage === "true") {
      await sql`UPDATE items SET image = NULL WHERE id = ${itemId}`;
    } else if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "items" }, (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          })
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Build dynamic update query
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    fields.push(`name = $${values.push(name)}`);
    fields.push(`price = $${values.push(parseFloat(price))}`);
    fields.push(`isavailable = $${values.push(isavailable)}`);
    fields.push(`description = $${values.push(description)}`);
    if (imageUrl) {
      fields.push(`image = $${values.push(imageUrl)}`);
    }

    const idParam = `$${values.push(itemId)}`;
    const query = `UPDATE items SET ${fields.join(", ")} WHERE id = ${idParam}`;

    await sql.unsafe(query, values);

    // Handle category relation
    const [categoryResult] = await sql`
      SELECT id FROM categories WHERE name = ${category} LIMIT 1
    `;

    if (categoryResult) {
      const categoryId = categoryResult.id;
            await sql`
        DELETE FROM ItemCategories
        WHERE itemId = ${itemId}
      `;
      await sql`
        INSERT INTO ItemCategories (itemId, categoryId)
        VALUES (${itemId}, ${categoryId})
      `;
    }

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Menu item updated successfully.",
    };
  } catch (err: unknown) {
    console.error("Update error:", err);
    return {
      success: false,
      message: "Failed to update menu item.",
      errors: ["Unexpected error occurred."],
    };
  }
}

export async function addMenuItem(
  prevState: ErrorState,
  formData: FormData
): Promise<ErrorState> {
  try {
    const rawData = {
      name: formData.get("name"),
      price: formData.get("price"),
      description: formData.get("description"),
      category: formData.get("category"),
    };

    const parsed = menuItemSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: parsed.error.issues.map((e) => e.message),
      };
    }

    const { name, price, description, category } = parsed.data;
    const imageFile = formData.get("image") as File;
    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "items" }, (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          })
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Get category ID
    const categoryResult = await sql`
      SELECT id FROM categories WHERE name = ${category}
    `;

    if (categoryResult.length === 0) {
      return {
        success: false,
        message: "Category not found.",
        errors: ["Selected category does not exist."],
      };
    }

    const categoryId = categoryResult[0].id;

    // Insert new item and return the ID
    const itemResult = await sql`
      INSERT INTO items (name, price, description, image)
      VALUES (${name}, ${parseFloat(price)}, ${description}, ${imageUrl})
      RETURNING id
    `;

    const itemId = itemResult[0].id;

    // Insert into itemcategories junction table
    await sql`
      INSERT INTO itemcategories (itemid, categoryid)
      VALUES (${itemId}, ${categoryId})
    `;

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      message: "Item added successfully.",
      errors: [],
    };
  } catch (err: unknown) {
    console.error("Add item error:", err);

    return {
      success: false,
      message: "Something went wrong while adding the item.",
      errors: ["Unknown error"],
    };
  }
}

export async function deleteMenuItem(id: number) {
  await sql`DELETE FROM items WHERE id = ${id}`;
  revalidatePath("/admin/dashboard");
}

export async function addCategory(name: string): Promise<{ success: boolean; message: string }> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { success: false, message: 'Category name is required.' };
  }

  try {
    // Check if category already exists
    const existing = await sql`
      SELECT 1 FROM Categories WHERE LOWER(name) = LOWER(${trimmedName}) LIMIT 1
    `;

    if (existing.length > 0) {
      return { success: false, message: 'Category already exists.' };
    }

    // Insert new category
    await sql`
      INSERT INTO Categories (name) VALUES (${trimmedName})
    `;

    revalidatePath("/admin/dashboard");
    return { success: true, message: 'Category added successfully.' };
  } catch (error: unknown) {
    console.error('Add Category Error:', error);
    return { success: false, message: 'Server error. Please try again.' };
  }
}

export async function deleteCategory(name: string): Promise<{ success: boolean; message: string }> {
  const trimmedName = name.trim();

  if (!trimmedName) return { success: false, message: 'Invalid category name.' };

  // Check for existing items
  const { count } = await sql`
    SELECT COUNT(*)::int FROM ItemCategories
    JOIN Categories on ItemCategories.CategoryID = Categories.ID
    WHERE name = ${trimmedName}
  `.then(res => res[0]);

  if (count > 0) {
    return {
      success: false,
      message: 'This category contains items and cannot be deleted.',
    };
  }

  // Delete category
  await sql`DELETE FROM Categories WHERE name = ${trimmedName}`;

  return { success: true, message: 'Category deleted successfully.' };
}