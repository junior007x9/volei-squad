"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, MapPin, DollarSign, Timer } from "lucide-react";
import Link from "next/link";
import { criarJogo } from "../actions/jogo";

export default function NovoJogo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 md:p-12 flex flex-col items-center justify-center">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -left-20 bg-blue-500/30 w-40 h-40 rounded-full blur-3xl"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Marcar Jogo
          </h1>
        </div>

        <form action={criarJogo} className="space-y-5 relative z-10">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                <CalendarDays size={16} className="text-blue-400"/> Data
              </label>
              <input type="date" name="data" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                <Clock size={16} className="text-blue-400"/> Início
              </label>
              <input type="time" name="horario" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <MapPin size={16} className="text-blue-400"/> Local da Quadra
            </label>
            <input type="text" name="local" placeholder="Ex: Arena Beach" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                <Timer size={16} className="text-amber-400"/> Duração (Horas)
              </label>
              <input type="number" name="duracao" step="0.5" min="0.5" defaultValue="2" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                <DollarSign size={16} className="text-green-400"/> Valor Total (R$)
              </label>
              <input type="number" name="valor" step="0.01" placeholder="120.00" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-slate-500" />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(74,222,128,0.6)] transition-all"
          >
            Confirmar Jogo 🏐
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}