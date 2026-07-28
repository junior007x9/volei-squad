"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, CheckCircle, MessageSquare, Timer, User, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { buscarJogoPorId } from "../../../actions/jogo";
import { confirmarConvitePublico } from "../../../actions/pagamento";

export default function ConvitePublico() {
  const params = useParams();
  const id = params.id as string;

  const [jogo, setJogo] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [confirmado, setConfirmado] = useState(false);

  // Estados do formulário público
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horasJogadas, setHorasJogadas] = useState<number>(2);
  const [observacao, setObservacao] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregar() {
      const dadosJogo = await buscarJogoPorId(id);
      if (dadosJogo) {
        setJogo(dadosJogo);
        setHorasJogadas(dadosJogo.duracao_horas); // Padrão é o tempo total da quadra
      }
      setCarregando(false);
    }
    carregar();
  }, [id]);

  async function confirmarPresenca(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) return;
    
    setEnviando(true);
    try {
      await confirmarConvitePublico(id, nome, telefone, horasJogadas, observacao);
      setConfirmado(true);
    } catch (error) {
      alert("Erro ao confirmar presença. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center animate-pulse">Carregando convite...</div>;
  if (!jogo) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Convite não encontrado ou jogo encerrado.</div>;

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
            <p className="text-slate-400">Seu cadastro foi salvo e o organizador já foi avisado. Nos vemos na quadra! 🏐</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                Convite Oficial
              </span>
              <h1 className="text-3xl font-extrabold text-white mb-2">🏐 Vôlei Squad</h1>
              
              <div className="flex flex-col items-center gap-2 text-slate-300 mt-6 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <span className="flex items-center gap-2 font-semibold"><Calendar size={18} className="text-blue-400"/> {jogo.data} às {jogo.horario}</span>
                <span className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-green-400"/> {jogo.local}</span>
                <span className="flex items-center gap-2 text-sm"><Timer size={16} className="text-amber-400"/> Duração Total: {jogo.duracao_horas}h</span>
              </div>
            </div>

            <form onSubmit={confirmarPresenca} className="space-y-4">
              
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                  <User size={16} className="text-purple-400"/> Seu Nome Completo
                </label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                  <Phone size={16} className="text-green-400"/> Seu WhatsApp
                </label>
                <input 
                  type="text" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: 11999999999"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-slate-500"
                />
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
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">O valor divide-se proporcionalmente às horas.</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-400"/> Observação (Opcional)
                </label>
                <input 
                  type="text" 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Vou chegar 20 min atrasado"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={enviando}
                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50"
              >
                {enviando ? "Salvando..." : "Confirmar Presença ✅"}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </main>
  );
}