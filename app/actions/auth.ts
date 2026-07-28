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
    // Correção: Agora aguardamos os cookies carregarem com 'await'
    const cookieStore = await cookies();
    
    cookieStore.set("organizador_auth", "logado", { 
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
  const cookieStore = await cookies();
  cookieStore.delete("organizador_auth");
  redirect("/login");
}