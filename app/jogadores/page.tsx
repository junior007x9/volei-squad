"use client";

import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, Phone, User, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { criarJogador, buscarJogadores, deletarJogador } from "../actions/jogador";

export default function Jogadores() {
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarLista() {
    const dados = await buscarJogadores();
    setJogadores(dados);
    setCarregando(false);
  }

  useEffect(() => { carregarLista(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    await criarJogador(formData);
    form.reset(); 
    await carregarLista(); 
  }

  async function excluir(id: string) {
    if (confirm("Tem certeza que deseja remover este jogador?")) {
      await deletarJogador(id);
      await carregarLista();
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Gerenciar Elenco
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl mb-10"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-purple-400" /> Adicionar Jogador
          </h2>
          
          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                name="nome" 
                placeholder="Nome do Atleta"
                required
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
            
            <div className="flex-1 relative">
              <Phone size={18} className="absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                name="telefone" 
                placeholder="WhatsApp (Ex: 11999999999)"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all"
            >
              Salvar
            </motion.button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold mb-4 text-slate-300">Jogadores Cadastrados ({jogadores.length})</h2>
          
          {carregando ? (
            <p className="text-slate-400 animate-pulse">Carregando craques...</p>
          ) : jogadores.length === 0 ? (
            <p className="text-slate-400">Nenhum jogador cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jogadores.map((jogador) => {
                // Limpa o número para gerar o link correto do WhatsApp
                const numeroLimpo = jogador.telefone ? jogador.telefone.replace(/\D/g, "") : "";

                return (
                  <motion.div 
                    key={jogador.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">
                        {jogador.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{jogador.nome}</h3>
                        <p className="text-xs text-slate-400">{jogador.telefone || "Sem telefone"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {numeroLimpo && numeroLimpo.length >= 10 && (
                        <a 
                          href={`https://wa.me/55${numeroLimpo}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-green-400 hover:bg-green-400/10 rounded-full transition-colors"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </a>
                      )}
                      <button 
                        onClick={() => excluir(jogador.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                        title="Remover Jogador"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

      </div>
    </main>
  );
}