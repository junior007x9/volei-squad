"use server";

import { turso } from "../../lib/turso";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fazerLogin(formData: FormData) {
  const senha = formData.get("senha") as string;
  
  const { rows } = await turso.execute({
    sql: "SELECT * FROM organizadores WHERE senha = ?",
    args: [senha]
  });

  if (rows.length > 0) {
    // Se a senha estiver correta, gera o carimbo de acesso válido por 30 dias
    cookies().set("organizador_auth", "logado", { 
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
    
    redirect("/"); // Joga pro painel inicial
  } else {
    return { erro: "Senha incorreta. Tente novamente!" };
  }
}

export async function fazerLogout() {
  cookies().delete("organizador_auth");
  redirect("/login");
}