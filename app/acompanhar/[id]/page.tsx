"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Timer, Users, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
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

  if (carregando) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center animate-pulse text-lg">Carregando escalação...</div>;
  }

  if (!jogo) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Partida não encontrada ou encerrada.</div>;
  }

  const totalConfirmados = participantes.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* Efeitos visuais de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            Painel da Galera 🏐
          </span>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Acompanhar Jogo
          </h1>
          <p className="text-slate-400 text-sm mt-1">Veja quem já garantiu presença na quadra!</p>
        </div>

        {/* Card de Detalhes da Partida */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl space-y-4"
        >
          <div className="flex items-center gap-3 text-2xl font-bold">
            <MapPin className="text-blue-400 shrink-0" /> 
            <span>{jogo.local}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-300 text-sm pt-2 border-t border-white/10">
            <span className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl">
              <Calendar size={16} className="text-blue-400"/> {jogo.data}
            </span>
            <span className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl">
              <Clock size={16} className="text-blue-400"/> {jogo.horario}
            </span>
            <span className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl">
              <Timer size={16} className="text-amber-400"/> Duração: {jogo.duracao_horas}h
            </span>
          </div>
        </motion.div>

        {/* Botão para ir se inscrever */}
        <div className="flex justify-center">
          <Link href={`/convite/${id}`} className="w-full sm:w-auto">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-center"
            >
              <span>Quero participar deste jogo!</span>
              <ArrowRight size={18} />
            </motion.div>
          </Link>
        </div>

        {/* Lista de Inscritos */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={22} className="text-purple-400" /> Atletas Inscritos
            </h2>
            <span className="bg-purple-500/20 text-purple-300 font-bold text-sm px-3 py-1 rounded-full">
              {totalConfirmados} confirmados
            </span>
          </div>

          {totalConfirmados === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-white/5 border-dashed text-slate-400">
              Ainda não há ninguém inscrito. Seja o primeiro a confirmar!
            </div>
          ) : (
            <div className="space-y-3">
              {participantes.map((p, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={p.pagamento_id}
                  className="bg-slate-800/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-base shadow-inner">
                      {p.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{p.nome}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1">
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
                      <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
                        <CheckCircle size={14} /> Pix OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                        <AlertCircle size={14} /> Pendente
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