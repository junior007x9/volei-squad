"use server";

import { turso } from "../../lib/turso";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function criarJogo(formData: FormData) {
  const data = formData.get("data") as string;
  const horario = formData.get("horario") as string;
  const local = formData.get("local") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const duracao = parseFloat(formData.get("duracao") as string) || 2; // Padrão 2 horas
  
  const id = crypto.randomUUID();

  await turso.execute({
    sql: "INSERT INTO jogos (id, data, horario, local, valor_total, duracao_horas) VALUES (?, ?, ?, ?, ?, ?)",
    args: [id, data, horario, local, valor, duracao],
  });

  revalidatePath("/");
  redirect(`/jogo/${id}`);
}

export async function buscarJogoPorId(id: string) {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM jogos WHERE id = ?",
    args: [id]
  });
  return rows[0] ? JSON.parse(JSON.stringify(rows[0])) : null;
}

export async function buscarUltimoJogo() {
  const { rows } = await turso.execute("SELECT * FROM jogos ORDER BY data DESC, horario DESC LIMIT 1");
  return rows[0] ? JSON.parse(JSON.stringify(rows[0])) : null;
}