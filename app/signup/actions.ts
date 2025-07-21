"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import {signupSchema , loginSchema } from "./schema"


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export interface SignupErrorState {
  message: string | null;
  success: boolean;
  errors?: string[];
}

export interface LoginErrorState {
  message: string | null;
  success: boolean;
  errors?: string[];
}





export async function signupUser(
  prevState: SignupErrorState,
  formData: FormData
): Promise<SignupErrorState> {
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



export async function loginUser(
  prevState: LoginErrorState,
  formData: FormData
): Promise<LoginErrorState> {
  const rawData = {
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message);
    return { message: null, success: false, errors };
  }

  const { email, password } = result.data;

  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return {
        message: "No user found with this email.",
        success: false,
      };
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        message: "Invalid password.",
        success: false,
      };
    }

    return {
      message: null,
      success: true,
    };
  } catch (error) {
    console.error("Login Error:", error);
    return {
      message: "Something went wrong. Please try again later.",
      success: false,
    };
  }
}