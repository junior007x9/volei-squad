"use client";

import { motion, Variants } from "framer-motion";
import { MapPin, Calendar, Clock, Timer, Users, CheckCircle, AlertCircle, ArrowRight, Sparkles, Volleyball } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { buscarJogoPorId } from "../../actions/jogo";
import { buscarParticipantes } from "../../actions/pagamento";

export default function AcompanharPartida() {
  const params = useParams();
  const id = params.id as string;

  const [jogo, setJogo] = useState<any>(null);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    const dadosJogo = await buscarJogoPorId(id);
    const dadosParticipantes = await buscarParticipantes(id);
    
    setJogo(dadosJogo);
    setParticipantes(dadosParticipantes);
    setCarregando(false);
  }, [id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-5xl"
        >
          🏐
        </motion.div>
        <p className="text-slate-400 font-medium animate-pulse">Aquecendo para a partida...</p>
      </div>
    );
  }

  if (!jogo) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-md">
          <h2 className="text-2xl font-bold mb-2">Partida Encerrada</h2>
          <p className="text-slate-400">Este link de jogo não foi encontrado ou já foi finalizado.</p>
        </div>
      </div>
    );
  }

  const totalConfirmados = participantes.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 md:p-12 relative overflow-hidden perspective-1000">
      
      {/* Efeitos 3D Imersivos de Fundo */}
      <motion.div 
        animate={{ 
          y: [0, -35, 0], 
          rotateX: [0, 360], 
          rotateY: [0, 360],
          scale: [1, 1.08, 1] 
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-6 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-green-400/20 rounded-full blur-xl pointer-events-none border border-white/10 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(59,130,246,0.3)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        🏐
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 30, 0], 
          rotateZ: [0, -180, 0],
          x: [0, -20, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-6 w-28 h-28 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-lg pointer-events-none border border-white/5 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(168,85,247,0.3)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        🏐
      </motion.div>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 inline-block border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            Painel da Galera 🏐
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 drop-shadow-md">
            Acompanhar Jogo
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Veja quem já garantiu presença na quadra em tempo real!</p>
        </motion.div>

        {/* Card de Detalhes da Partida com Efeito 3D Hover */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01, rotateX: 1 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center gap-3 text-2xl font-bold text-white">
            <MapPin className="text-blue-400 shrink-0" /> 
            <span>{jogo.local}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-slate-300 text-sm pt-3 border-t border-white/10">
            <span className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5 font-medium">
              <Calendar size={16} className="text-blue-400"/> {jogo.data}
            </span>
            <span className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5 font-medium">
              <Clock size={16} className="text-blue-400"/> {jogo.horario}
            </span>
            <span className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5 font-medium">
              <Timer size={16} className="text-amber-400"/> Duração: {jogo.duracao_horas}h
            </span>
          </div>
        </motion.div>

        {/* Botão de Chamada para Ação (Inscrição) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <Link href={`/convite/${id}`} className="w-full sm:w-auto">
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(74,222,128,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-center border border-green-400/30"
            >
              <Sparkles size={20} className="animate-pulse" />
              <span>Quero participar deste jogo!</span>
              <ArrowRight size={18} />
            </motion.div>
          </Link>
        </motion.div>

        {/* Lista de Inscritos Animada */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Users size={22} className="text-purple-400" /> Atletas Inscritos
            </h2>
            <span className="bg-purple-500/20 text-purple-300 font-bold text-sm px-4 py-1.5 rounded-full border border-purple-500/30 shadow-inner">
              {totalConfirmados} confirmados
            </span>
          </div>

          {totalConfirmados === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5 border-dashed text-slate-400"
            >
              Ainda não há ninguém inscrito. Seja o primeiro a confirmar sua vaga!
            </motion.div>
          ) : (
            <div className="space-y-3">
              {participantes.map((p) => (
                <motion.div 
                  variants={itemAnim}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                  key={p.pagamento_id}
                  className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-lg border border-white/20 shrink-0">
                      {p.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{p.nome}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/5 font-medium">
                          <Timer size={12} className="text-amber-400"/> {p.horas_jogadas}h jogadas
                        </span>
                        {p.observacao && (
                          <span className="text-xs text-slate-400 italic">
                            "{p.observacao}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {p.status === 'Confirmado' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-3.5 py-2 rounded-xl border border-green-500/25 shadow-sm">
                        <CheckCircle size={15} /> Pix OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/25 shadow-sm">
                        <AlertCircle size={15} /> Pendente
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </main>
  );
}