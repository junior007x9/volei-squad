"use server";

import { turso } from "../../lib/turso";

export async function criarJogador(formData: FormData) {
  const nome = formData.get("nome") as string;
  let telefone = formData.get("telefone") as string;
  
  // Limpa tudo que não for número
  const num = telefone.replace(/\D/g, "");
  // Se tiver 11 dígitos, formata para (XX) XXXXX-XXXX
  if (num.length === 11) {
    telefone = `(${num.substring(0, 2)}) ${num.substring(2, 7)}-${num.substring(7, 11)}`;
  }

  const id = crypto.randomUUID();

  await turso.execute({
    sql: "INSERT INTO jogadores (id, nome, telefone) VALUES (?, ?, ?)",
    args: [id, nome, telefone],
  });
}

export async function buscarJogadores() {
  const { rows } = await turso.execute("SELECT * FROM jogadores ORDER BY nome ASC");
  // CORREÇÃO DO ERRO: Converte os dados do banco para objetos puros do JavaScript
  return JSON.parse(JSON.stringify(rows));
}

export async function deletarJogador(id: string) {
  await turso.execute({
    sql: "DELETE FROM jogadores WHERE id = ?",
    args: [id],
  });
}