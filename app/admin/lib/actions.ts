"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { v2 as cloudinary } from "cloudinary";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function updateMenuItem(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  let imageUrl: string | null = null;

  // Upload/Delete image if provided
  const removeImage = formData.get("removeImage");

if (removeImage === "true") {
  await sql`UPDATE items SET image = NULL WHERE id = ${id}`;
} else if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "items" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    imageUrl = (uploadResult as any).secure_url;
  }

  // Build query dynamically
  const fields: string[] = [];
  const values: any[] = [];

  fields.push(`name = $${values.push(name)}`);
  fields.push(`price = $${values.push(price)}`);
  fields.push(`status = $${values.push(status)}`);
  fields.push(`description = $${values.push(description)}`);
  if (imageUrl) {
    fields.push(`image = $${values.push(imageUrl)}`);
  }

  // Add ID for WHERE clause
  const idParam = `$${values.push(id)}`;

  const query = `UPDATE items SET ${fields.join(", ")} WHERE id = ${idParam}`;
  await sql.unsafe(query, values);

  revalidatePath("/admin/dashboard");
}

export async function deleteMenuItem(id: number) {
  await sql`DELETE FROM items WHERE id = ${id}`;
  revalidatePath("/admin/dashboard");
}
