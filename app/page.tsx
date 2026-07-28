"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, Users, Receipt, ArrowRight, Activity, PlusCircle, Settings, Ticket, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buscarUltimoJogo } from "./actions/jogo";
import { buscarParticipantes } from "./actions/pagamento";

export default function Home() {
  const [jogo, setJogo] = useState<any>(null);
  const [estatisticas, setEstatisticas] = useState({ pagos: 0, total: 0 });
  const [carregando, setCarregando] = useState(true);

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

  // Variantes de Animação COM TIPAGEM CORRIGIDA PARA O TYPESCRIPT
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 md:p-12">
      
      {/* Cabeçalho Animado */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-3">
            🏐 Vôlei Squad
          </h1>
          <p className="text-slate-400 mt-1">Organize os jogos, a galera e o pix!</p>
        </div>
        
        <div className="hidden md:flex h-12 w-12 rounded-full bg-white/10 items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(74,222,128,0.3)]">
          <span className="text-xl font-bold">VS</span>
        </div>
      </motion.header>

      {/* --- AÇÕES RÁPIDAS (TODOS OS BOTÕES AQUI) --- */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h2 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          
          <Link href="/novo-jogo" className="flex-1 min-w-[150px]">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
              <PlusCircle size={24} className="text-white" />
              <span className="font-bold text-sm">Criar Jogo</span>
            </div>
          </Link>

          <Link href="/jogadores" className="flex-1 min-w-[150px]">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
              <Users size={24} className="text-white" />
              <span className="font-bold text-sm">Elenco Geral</span>
            </div>
          </Link>

          {jogo && (
            <>
              <Link href={`/jogo/${jogo.id}`} className="flex-1 min-w-[150px]">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
                  <Settings size={24} className="text-white" />
                  <span className="font-bold text-sm text-center">Painel Organizador</span>
                </div>
              </Link>

              <Link href={`/convite/${jogo.id}`} className="flex-1 min-w-[150px]">
                <div className="bg-slate-800 border border-slate-600 hover:bg-slate-700 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
                  <Ticket size={24} className="text-amber-400" />
                  <span className="font-bold text-sm text-center">Ver Convite Público</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </motion.section>

      {/* Grid de Cards (Dashboard Resumo) */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        
        {/* Card 1: Próximo Jogo */}
        {carregando ? (
          <div className="bg-white/5 animate-pulse rounded-2xl h-48 border border-white/5"></div>
        ) : jogo ? (
          <Link href={`/jogo/${jogo.id}`} className="block h-full">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl cursor-pointer h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <Calendar size={28} />
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
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
          <motion.div variants={item} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <Activity size={32} className="text-slate-500 mb-2"/>
            <p className="text-slate-400">Nenhum jogo agendado.</p>
          </motion.div>
        )}

        {/* Card 2: Financeiro */}
        {carregando ? (
          <div className="bg-white/5 animate-pulse rounded-2xl h-48 border border-white/5"></div>
        ) : jogo ? (
          <Link href={`/jogo/${jogo.id}`} className="block h-full">
            <motion.div variants={item} whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute -right-10 -top-10 bg-green-500/20 w-32 h-32 rounded-full blur-3xl"></div>
              
              <div>
                <div className="p-3 bg-green-500/20 w-max rounded-lg text-green-400 mb-4 relative z-10">
                  <Receipt size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-1">R$ {jogo.valor_total.toFixed(2)}</h2>
                <p className="text-slate-300 text-sm mb-4">
                  {estatisticas.pagos} de {estatisticas.total} pagaram
                </p>
                
                <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${porcentagemPaga}%` }} 
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-green-500 h-2.5 rounded-full"
                  ></motion.div>
                </div>
              </div>
              
              <div className="flex items-center text-green-400 font-semibold text-sm">
                Validar Comprovantes <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <motion.div variants={item} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <Receipt size={32} className="text-slate-500 mb-2"/>
            <p className="text-slate-400">Inicie um jogo para gerenciar o Pix.</p>
          </motion.div>
        )}

        {/* Card 3: Galera (Leva para Lista Geral) */}
        <Link href="/jogadores" className="block h-full">
          <motion.div variants={item} whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="p-3 bg-purple-500/20 w-max rounded-lg text-purple-400 mb-4">
                <Users size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-1">Elenco</h2>
              <p className="text-slate-300 text-sm mb-4">Gerencie seus amigos</p>
              
              <div className="flex -space-x-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs">
                    J{i}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
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