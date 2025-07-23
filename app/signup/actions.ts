"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import {signupSchema } from "./schema"
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { ErrorState } from "../user/lib/actions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function signupUser(
  prevState: ErrorState,
  formData: FormData
): Promise<ErrorState> {
  const rawData = {
  name: formData.get('name')?.toString().trim() || '',
  email: formData.get('email')?.toString().trim() || '',
  phone: formData.get('phone')?.toString().trim() || '',
  password: formData.get('password')?.toString().trim() || '',
  confirmPassword: formData.get('confirmPassword')?.toString().trim() || '',
};

  const result = signupSchema.safeParse(rawData);

  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message);
    return { message: null, success: false, errors };
  }

  const { name, email, phone, password } = result.data;

  try {
   
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    if (existingUser.length > 0) {
      return {
        message: 'An account with this email already exists.',
        success: false,
      };
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    await sql`
      INSERT INTO users (username, email, contact, password)
      VALUES (${name}, ${email}, ${phone}, ${hashedPassword})
    `;

    return {
      message: null,
      success: true,
    };
  } catch (error) {
    console.error('Signup Error:', error);
    return {
      message: 'Something went wrong. Please try again later.',
      success: false,
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}