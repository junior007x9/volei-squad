"use server";

import { turso } from "../../lib/turso";
import { put } from "@vercel/blob";

export async function adicionarParticipante(jogo_id: string, jogador_id: string, horas_jogadas: number = 2, observacao: string = "") {
  const id = crypto.randomUUID();
  
  await turso.execute({
    sql: "INSERT INTO pagamentos (id, jogo_id, jogador_id, valor_pago, status, horas_jogadas, observacao) VALUES (?, ?, ?, 0, 'Pendente', ?, ?)",
    args: [id, jogo_id, jogador_id, horas_jogadas, observacao],
  });
}

// NOVA FUNÇÃO: Cadastra automaticamente o jogador (se for novo) e confirma na partida
export async function confirmarConvitePublico(
  jogo_id: string, 
  nome: string, 
  telefone: string, 
  horas_jogadas: number, 
  observacao: string
) {
  // Formata o telefone para o padrão brasileiro
  const num = telefone.replace(/\D/g, "");
  let telefoneFormatado = telefone;
  if (num.length === 11) {
    telefoneFormatado = `(${num.substring(0, 2)}) ${num.substring(2, 7)}-${num.substring(7, 11)}`;
  }

  // 1. Verifica se o jogador já existe pelo nome (ignorando maiúsculas/minúsculas)
  const { rows } = await turso.execute({
    sql: "SELECT id FROM jogadores WHERE LOWER(nome) = LOWER(?)",
    args: [nome.trim()]
  });

  let jogador_id: string;

  if (rows.length > 0) {
    jogador_id = rows[0].id as string;
    // Atualiza o telefone se ele mandou um novo
    if (telefoneFormatado) {
      await turso.execute({
        sql: "UPDATE jogadores SET telefone = ? WHERE id = ?",
        args: [telefoneFormatado, jogador_id]
      });
    }
  } else {
    // Se não existe, cria um novo jogador (fica salvo permanentemente para os próximos jogos!)
    jogador_id = crypto.randomUUID();
    await turso.execute({
      sql: "INSERT INTO jogadores (id, nome, telefone) VALUES (?, ?, ?)",
      args: [jogador_id, nome.trim(), telefoneFormatado]
    });
  }

  // 2. Verifica se ele já está escalado neste jogo específico
  const checkPart = await turso.execute({
    sql: "SELECT id FROM pagamentos WHERE jogo_id = ? AND jogador_id = ?",
    args: [jogo_id, jogador_id]
  });

  if (checkPart.rows.length === 0) {
    const pagamento_id = crypto.randomUUID();
    await turso.execute({
      sql: "INSERT INTO pagamentos (id, jogo_id, jogador_id, valor_pago, status, horas_jogadas, observacao) VALUES (?, ?, ?, 0, 'Pendente', ?, ?)",
      args: [pagamento_id, jogo_id, jogador_id, horas_jogadas, observacao],
    });
  } else {
    // Se já estava, apenas atualiza as horas e a observação
    await turso.execute({
      sql: "UPDATE pagamentos SET horas_jogadas = ?, observacao = ? WHERE jogo_id = ? AND jogador_id = ?",
      args: [horas_jogadas, observacao, jogo_id, jogador_id]
    });
  }
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