"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, Users, Receipt, ArrowRight, Activity, PlusCircle, Settings, Ticket, Eye, Copy, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buscarUltimoJogo } from "./actions/jogo";
import { buscarParticipantes } from "./actions/pagamento";

export default function Home() {
  const [jogo, setJogo] = useState<any>(null);
  const [estatisticas, setEstatisticas] = useState({ pagos: 0, total: 0 });
  const [carregando, setCarregando] = useState(true);
  const [linkCopiado, setLinkCopiado] = useState(false);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const ultimoJogo = await buscarUltimoJogo();
        if (ultimoJogo) {
          setJogo(ultimoJogo);
          const participantes = await buscarParticipantes(ultimoJogo.id);
          
          const pagamentosConfirmados = participantes.filter((p: any) => p.status === 'Confirmado').length;
          setEstatisticas({ 
            pagos: pagamentosConfirmados, 
            total: participantes.length 
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarDashboard();
  }, []);

  function copiarLinkAcompanhamento() {
    if (!jogo) return;
    const link = `${window.location.origin}/acompanhar/${jogo.id}`;
    navigator.clipboard.writeText(link);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 3000);
  }

  // Variantes de Animação com tipagem correta
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  const porcentagemPaga = estatisticas.total > 0 
    ? (estatisticas.pagos / estatisticas.total) * 100 
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 md:p-12 relative overflow-hidden perspective-1000">
      
      {/* Efeitos 3D Imersivos de Fundo (Bolas de Vôlei Flutuantes com Rotação) */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0], 
          rotateX: [0, 360], 
          rotateY: [0, 360],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-10 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-green-400/20 rounded-full blur-xl pointer-events-none border border-white/10 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(59,130,246,0.3)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        🏐
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 25, 0], 
          rotateZ: [0, -180, 0],
          x: [0, 20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-lg pointer-events-none border border-white/5 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(168,85,247,0.3)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        🏐
      </motion.div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Cabeçalho Animado com Efeito 3D Hover */}
      <motion.header 
        initial={{ opacity: 0, y: -50, rotateX: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex items-center justify-between mb-8 relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div>
          <motion.h1 
            whileHover={{ scale: 1.02, rotateZ: 1 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 flex items-center gap-3 drop-shadow-[0_5px_15px_rgba(59,130,246,0.4)]"
          >
            🏐 Vôlei Squad
          </motion.h1>
          <p className="text-slate-400 mt-1 font-medium">Organize os jogos, a galera e o pix com estilo!</p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.15, rotateZ: 360 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="hidden md:flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-green-500/20 to-blue-500/20 items-center justify-center border border-white/30 shadow-[0_0_25px_rgba(74,222,128,0.4)] backdrop-blur-md cursor-pointer"
        >
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">VS</span>
        </motion.div>
      </motion.header>

      {/* --- BANNER ESPECIAL DE COMPARTILHAMENTO COM PULSO 3D --- */}
      {jogo && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, z: -50 }}
          animate={{ opacity: 1, scale: 1, z: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.01, boxShadow: "0 0 35px rgba(59,130,246,0.4)" }}
          className="mb-8 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-blue-400/40 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute -right-10 -bottom-10 bg-blue-400/30 w-40 h-40 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-1 text-center md:text-left relative z-10">
            <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 border border-blue-400/20">
              Link para o Grupo 🚀
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="text-amber-400 animate-pulse" size={22} /> Compartilhe o Acompanhamento do Vôlei
            </h2>
            <p className="text-slate-300 text-sm">Mande no WhatsApp para a galera ver quem já está escalado e quem pagou!</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copiarLinkAcompanhamento}
              className="flex-1 md:flex-initial bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 border border-blue-300/30"
            >
              {linkCopiado ? <CheckCircle size={18} className="text-green-300"/> : <Copy size={18}/>}
              {linkCopiado ? "Link Copiado!" : "Copiar Link do Grupo"}
            </motion.button>

            <Link href={`/acompanhar/${jogo.id}`} target="_blank" className="flex-1 md:flex-initial">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Eye size={18} className="text-blue-300"/> Ver Tela
              </motion.div>
            </Link>
          </div>
        </motion.div>
      )}

      {/* --- AÇÕES RÁPIDAS COM EFEITO DE ELEVAÇÃO 3D --- */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10 relative z-10"
      >
        <h2 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
          ⚡ Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4">
          
          <Link href="/novo-jogo" className="flex-1 min-w-[150px]">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 transition-all border border-blue-400/30 cursor-pointer h-full"
            >
              <PlusCircle size={28} className="text-white drop-shadow-md" />
              <span className="font-bold text-sm text-center">Criar Jogo</span>
            </motion.div>
          </Link>

          <Link href="/jogadores" className="flex-1 min-w-[150px]">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-purple-500 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 transition-all border border-purple-400/30 cursor-pointer h-full"
            >
              <Users size={28} className="text-white drop-shadow-md" />
              <span className="font-bold text-sm text-center">Elenco Geral</span>
            </motion.div>
          </Link>

          {jogo && (
            <>
              <Link href={`/jogo/${jogo.id}`} className="flex-1 min-w-[150px]">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5, rotateX: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 transition-all border border-emerald-400/30 cursor-pointer h-full"
                >
                  <Settings size={28} className="text-white drop-shadow-md" />
                  <span className="font-bold text-sm text-center">Painel Organizador</span>
                </motion.div>
              </Link>

              <Link href={`/convite/${jogo.id}`} className="flex-1 min-w-[150px]">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5, rotateX: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800/80 backdrop-blur-md border border-slate-600 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer h-full"
                >
                  <Ticket size={28} className="text-amber-400 drop-shadow-md" />
                  <span className="font-bold text-sm text-center">Ver Inscrição</span>
                </motion.div>
              </Link>
            </>
          )}
        </div>
      </motion.section>

      {/* Grid de Cards (Dashboard Resumo com Efeito Tilt/Hover 3D) */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
      >
        
        {/* Card 1: Próximo Jogo */}
        {carregando ? (
          <div className="bg-white/5 animate-pulse rounded-2xl h-48 border border-white/5"></div>
        ) : jogo ? (
          <Link href={`/jogo/${jogo.id}`} className="block h-full">
            <motion.div 
              variants={item} 
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2, z: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl cursor-pointer h-full flex flex-col justify-between transition-all"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-400/20 shadow-inner">
                    <Calendar size={28} />
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">
                    Em Aberto
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{jogo.data} às {jogo.horario}</h2>
                <p className="text-slate-300 text-sm mb-4">{jogo.local}</p>
              </div>
              <div className="flex items-center text-blue-400 font-semibold text-sm hover:text-blue-300 transition-colors">
                Gerenciar Partida <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <motion.div variants={item} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <Activity size={32} className="text-slate-500 mb-2"/>
            <p className="text-slate-400">Nenhum jogo agendado.</p>
          </motion.div>
        )}

        {/* Card 2: Financeiro */}
        {carregando ? (
          <div className="bg-white/5 animate-pulse rounded-2xl h-48 border border-white/5"></div>
        ) : jogo ? (
          <Link href={`/jogo/${jogo.id}`} className="block h-full">
            <motion.div 
              variants={item} 
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2, z: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl cursor-pointer relative overflow-hidden h-full flex flex-col justify-between transition-all"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute -right-10 -top-10 bg-green-500/20 w-32 h-32 rounded-full blur-3xl"></div>
              
              <div>
                <div className="p-3 bg-green-500/20 w-max rounded-2xl text-green-400 mb-4 relative z-10 border border-green-500/20 shadow-inner">
                  <Receipt size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-1">R$ {jogo.valor_total.toFixed(2)}</h2>
                <p className="text-slate-300 text-sm mb-4">
                  {estatisticas.pagos} de {estatisticas.total} pagaram
                </p>
                
                <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${porcentagemPaga}%` }} 
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                  ></motion.div>
                </div>
              </div>
              
              <div className="flex items-center text-green-400 font-semibold text-sm">
                Validar Comprovantes <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <motion.div variants={item} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <Receipt size={32} className="text-slate-500 mb-2"/>
            <p className="text-slate-400">Inicie um jogo para gerenciar o Pix.</p>
          </motion.div>
        )}

        {/* Card 3: Galera */}
        <Link href="/jogadores" className="block h-full">
          <motion.div 
            variants={item} 
            whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2, z: 20 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl cursor-pointer h-full flex flex-col justify-between transition-all"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div>
              <div className="p-3 bg-purple-500/20 w-max rounded-2xl text-purple-400 mb-4 border border-purple-500/20 shadow-inner">
                <Users size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-1">Elenco</h2>
              <p className="text-slate-300 text-sm mb-4">Gerencie seus amigos</p>
              
              <div className="flex -space-x-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs shadow-md">
                    J{i}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 shadow-md">
                  +
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-purple-400 font-semibold text-sm">
              Adicionar Jogadores <ArrowRight size={16} className="ml-2" />
            </div>
          </motion.div>
        </Link>

      </motion.div>
    </main>
  );
}