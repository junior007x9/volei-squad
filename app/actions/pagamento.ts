"use server";

import { turso } from "../../lib/turso";
import { put } from "@vercel/blob";

// Agora aceita horas jogadas (para calcularmos depois)
export async function adicionarParticipante(jogo_id: string, jogador_id: string, horas_jogadas: number = 2, observacao: string = "") {
  const id = crypto.randomUUID();
  
  await turso.execute({
    sql: "INSERT INTO pagamentos (id, jogo_id, jogador_id, valor_pago, status, horas_jogadas, observacao) VALUES (?, ?, ?, 0, 'Pendente', ?, ?)",
    args: [id, jogo_id, jogador_id, horas_jogadas, observacao],
  });
}

export async function buscarParticipantes(jogo_id: string) {
  const { rows } = await turso.execute({
    sql: `
      SELECT p.id as pagamento_id, p.status, p.url_comprovante, p.horas_jogadas, p.observacao, 
             j.id as jogador_id, j.nome, j.telefone 
      FROM pagamentos p 
      JOIN jogadores j ON p.jogador_id = j.id 
      WHERE p.jogo_id = ?
      ORDER BY j.nome ASC
    `,
    args: [jogo_id]
  });
  return JSON.parse(JSON.stringify(rows));
}

export async function removerParticipante(pagamento_id: string) {
  await turso.execute({
    sql: "DELETE FROM pagamentos WHERE id = ?",
    args: [pagamento_id],
  });
}

export async function enviarComprovante(pagamento_id: string, formData: FormData) {
  const file = formData.get("comprovante") as File;
  if (!file || file.size === 0) throw new Error("Nenhum arquivo selecionado.");

  const blob = await put(`comprovantes/${pagamento_id}-${file.name}`, file, { access: 'public' });

  await turso.execute({
    sql: "UPDATE pagamentos SET url_comprovante = ?, status = 'Confirmado' WHERE id = ?",
    args: [blob.url, pagamento_id],
  });
}