"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, CheckCircle, MessageSquare, Timer, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { buscarJogoPorId } from "../../actions/jogo";
import { buscarJogadores } from "../../actions/jogador";
import { adicionarParticipante, buscarParticipantes } from "../../actions/pagamento";

export default function ConvitePublico() {
  const params = useParams();
  const id = params.id as string;

  const [jogo, setJogo] = useState<any>(null);
  const [jogadoresDisponiveis, setJogadoresDisponiveis] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [confirmado, setConfirmado] = useState(false);

  // Estados do formulário
  const [jogadorSelecionado, setJogadorSelecionado] = useState("");
  const [horasJogadas, setHorasJogadas] = useState<number>(2);
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    async function carregar() {
      const dadosJogo = await buscarJogoPorId(id);
      if (dadosJogo) {
        setJogo(dadosJogo);
        setHorasJogadas(dadosJogo.duracao_horas); // Padrão é o tempo total do jogo
        
        // Pega todos os jogadores e remove quem já está confirmado
        const todosJogadores = await buscarJogadores();
        const participantes = await buscarParticipantes(id);
        const disponiveis = todosJogadores.filter(
          (j: any) => !participantes.some((p: any) => p.jogador_id === j.id)
        );
        setJogadoresDisponiveis(disponiveis);
      }
      setCarregando(false);
    }
    carregar();
  }, [id]);

  async function confirmarPresenca(e: React.FormEvent) {
    e.preventDefault();
    if (!jogadorSelecionado) return;
    
    await adicionarParticipante(id, jogadorSelecionado, horasJogadas, observacao);
    setConfirmado(true);
  }

  if (carregando) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center animate-pulse">Carregando convite...</div>;
  if (!jogo) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Convite não encontrado ou jogo cancelado.</div>;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Efeitos de fundo */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/50 to-slate-900 pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 bg-green-500/20 w-64 h-64 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        
        {confirmado ? (
          <div className="text-center py-8 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Presença Confirmada!</h2>
            <p className="text-slate-400">O organizador já foi avisado. Prepare a joelheira!</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                Convite para Jogo
              </span>
              <h1 className="text-3xl font-extrabold text-white mb-2">🏐 Vôlei Squad</h1>
              
              <div className="flex flex-col items-center gap-2 text-slate-300 mt-6 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <span className="flex items-center gap-2 font-semibold"><Calendar size={18} className="text-blue-400"/> {jogo.data} às {jogo.horario}</span>
                <span className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-green-400"/> {jogo.local}</span>
                <span className="flex items-center gap-2 text-sm"><Timer size={16} className="text-amber-400"/> Duração: {jogo.duracao_horas} horas</span>
              </div>
            </div>

            <form onSubmit={confirmarPresenca} className="space-y-5">
              
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                  <User size={16} className="text-purple-400"/> Quem é você?
                </label>
                <select 
                  value={jogadorSelecionado}
                  onChange={(e) => setJogadorSelecionado(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Selecione seu nome...</option>
                  {jogadoresDisponiveis.map(j => (
                    <option key={j.id} value={j.id}>{j.nome}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">Não achou seu nome? Peça pro organizador te cadastrar no elenco.</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                  <Timer size={16} className="text-amber-400"/> Quantas horas vai jogar?
                </label>
                <input 
                  type="number" 
                  step="0.5" 
                  min="0.5" 
                  max={jogo.duracao_horas}
                  value={horasJogadas}
                  onChange={(e) => setHorasJogadas(parseFloat(e.target.value))}
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-slate-500 mt-1">O valor será dividido proporcionalmente.</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                  <MessageSquare size={16} className="text-green-400"/> Observação (Opcional)
                </label>
                <input 
                  type="text" 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Vou chegar 30 min mais tarde"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
              >
                Confirmar Presença ✅
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </main>
  );
}