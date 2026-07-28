"use client";

import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { fazerLogin } from "../actions/auth";

export default function Login() {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(formData: FormData) {
    setCarregando(true);
    setErro("");
    
    const resposta = await fazerLogin(formData);
    
    // Se a função retornar algo, é porque deu erro (se der certo, ela redireciona sozinha)
    if (resposta?.erro) {
      setErro(resposta.erro);
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Efeitos de Fundo */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/40 via-slate-900 to-purple-900/40 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 bg-blue-500/20 w-96 h-96 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 bg-purple-500/20 w-96 h-96 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Área Restrita</h1>
          <p className="text-slate-400">Insira a senha de Organizador para gerenciar os jogos.</p>
        </div>

        <form action={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-4 text-slate-400" />
              <input 
                type="password" 
                name="senha" 
                placeholder="Senha de acesso"
                required
                className="w-full bg-slate-800/80 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500 text-lg tracking-widest"
              />
            </div>
            
            {erro && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="text-red-400 text-sm mt-3 text-center font-medium bg-red-500/10 py-2 rounded-lg"
              >
                {erro}
              </motion.p>
            )}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {carregando ? "Verificando..." : "Entrar no Sistema"} <ArrowRight size={20}/>
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}