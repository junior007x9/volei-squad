"use client";

import { motion, Variants } from "framer-motion";
import { MapPin, Calendar, CheckCircle, MessageSquare, Timer, User, Phone, UserCheck, UserPlus, Users, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { buscarJogoPorId } from "../../actions/jogo";
import { buscarJogadores } from "../../actions/jogador";
import { buscarParticipantes, confirmarConvitePublico } from "../../actions/pagamento";

export default function ConvitePublico() {
  const params = useParams();
  const id = params.id as string;

  const [jogo, setJogo] = useState<any>(null);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [confirmado, setConfirmado] = useState(false);

  // Estados de controle de modo ("existente" ou "novo")
  const [modoCadastro, setModoCadastro] = useState<"existente" | "novo">("existente");
  const [jogadoresCadastrados, setJogadoresCadastrados] = useState<any[]>([]);
  
  // Dados do formulário
  const [jogadorIdEscolhido, setJogadorIdEscolhido] = useState("");
  const [nomeNovo, setNomeNovo] = useState("");
  const [telefoneNovo, setTelefoneNovo] = useState("");
  const [horasJogadas, setHorasJogadas] = useState<number>(2);
  const [observacao, setObservacao] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregarDadosIniciais = useCallback(async () => {
    const dadosJogo = await buscarJogoPorId(id);
    if (dadosJogo) {
      setJogo(dadosJogo);
      setHorasJogadas(dadosJogo.duracao_horas);
      
      const todosJogadores = await buscarJogadores();
      const part = await buscarParticipantes(id);
      setParticipantes(part);

      const disponiveis = todosJogadores.filter(
        (j: any) => !part.some((p: any) => p.jogador_id === j.id)
      );

      setJogadoresCadastrados(disponiveis);
      if (disponiveis.length === 0) {
        setModoCadastro("novo");
      }
    }
    setCarregando(false);
  }, [id]);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  async function confirmarPresenca(e: React.FormEvent) {
    e.preventDefault();
    
    let nomeFinal = "";
    let telefoneFinal = "";

    if (modoCadastro === "existente") {
      if (!jogadorIdEscolhido) return;
      const jogadorObj = jogadoresCadastrados.find(j => j.id === jogadorIdEscolhido);
      if (!jogadorObj) return;
      nomeFinal = jogadorObj.nome;
      telefoneFinal = jogadorObj.telefone || "";
    } else {
      if (!nomeNovo.trim() || !telefoneNovo.trim()) return;
      nomeFinal = nomeNovo;
      telefoneFinal = telefoneNovo;
    }

    setEnviando(true);
    try {
      await confirmarConvitePublico(id, nomeFinal, telefoneFinal, horasJogadas, observacao);
      await carregarDadosIniciais(); // Atualiza a lista na hora
      setConfirmado(true);
    } catch (error) {
      alert("Erro ao confirmar presença. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  // Cálculos financeiros proporcionais para exibição na lista
  const valorTotal = jogo?.valor_total || 0;
  const totalHorasCompradas = participantes.reduce((acc, p) => acc + (p.horas_jogadas || 0), 0);
  const custoPorHoraJogador = totalHorasCompradas > 0 ? (valorTotal / totalHorasCompradas) : 0;

  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl">
          🏐
        </motion.div>
        <p className="text-slate-400 font-medium animate-pulse">Carregando convite...</p>
      </div>
    );
  }

  if (!jogo) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-md">
          <h2 className="text-2xl font-bold mb-2">Convite Indisponível</h2>
          <p className="text-slate-400">Este jogo não foi encontrado ou já foi encerrado.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Efeitos de fundo */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/40 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 bg-green-500/20 w-64 h-64 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        
        {/* CARD DO FORMULÁRIO DE INSCRIÇÃO */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl relative"
        >
          {confirmado ? (
            <div className="text-center py-6 space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(74,222,128,0.4)]">
                <CheckCircle size={32} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Presença Confirmada com Sucesso!</h2>
              <p className="text-slate-300 text-sm">Seu nome já está listado abaixo com o valor proporcional calculado.</p>
              <button 
                onClick={() => setConfirmado(false)}
                className="mt-4 bg-slate-800 hover:bg-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all border border-white/10"
              >
                Cadastrar outro ou alterar dados
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block border border-blue-400/30">
                  Convite Oficial 🏐
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Vôlei Squad</h1>
                
                <div className="flex flex-wrap items-center justify-center gap-3 text-slate-300 mt-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5 text-xs md:text-sm">
                  <span className="flex items-center gap-1.5 text-blue-300 font-semibold"><Calendar size={15}/> {jogo.data} às {jogo.horario}</span>
                  <span className="flex items-center gap-1.5 text-slate-300"><MapPin size={14} className="text-green-400"/> {jogo.local}</span>
                  <span className="flex items-center gap-1.5 text-slate-400"><Timer size={14} className="text-amber-400"/> {jogo.duracao_horas}h total</span>
                </div>
              </div>

              {/* ABAS */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl mb-5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setModoCadastro("existente")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    modoCadastro === "existente" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserCheck size={14} /> Já tenho cadastro
                </button>
                <button
                  type="button"
                  onClick={() => setModoCadastro("novo")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    modoCadastro === "novo" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserPlus size={14} /> Sou novo / Cadastrar
                </button>
              </div>

              <form onSubmit={confirmarPresenca} className="space-y-4">
                {modoCadastro === "existente" ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <User size={14} className="text-blue-400"/> Selecione seu Nome
                    </label>
                    <select 
                      value={jogadorIdEscolhido}
                      onChange={(e) => setJogadorIdEscolhido(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                      <option value="">Selecione na lista...</option>
                      {jogadoresCadastrados.map(j => (
                        <option key={j.id} value={j.id}>{j.nome}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <User size={14} className="text-purple-400"/> Seu Nome Completo
                      </label>
                      <input 
                        type="text" 
                        value={nomeNovo}
                        onChange={(e) => setNomeNovo(e.target.value)}
                        placeholder="Ex: Carlos Silva"
                        required
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Phone size={14} className="text-green-400"/> Seu WhatsApp
                      </label>
                      <input 
                        type="text" 
                        value={telefoneNovo}
                        onChange={(e) => setTelefoneNovo(e.target.value)}
                        placeholder="Ex: 11999999999"
                        required
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Timer size={14} className="text-amber-400"/> Horas que vai jogar
                    </label>
                    <input 
                      type="number" 
                      step="0.5" 
                      min="0.5" 
                      max={jogo.duracao_horas}
                      value={horasJogadas}
                      onChange={(e) => setHorasJogadas(parseFloat(e.target.value))}
                      required
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-blue-400"/> Observação (Opcional)
                    </label>
                    <input 
                      type="text" 
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      placeholder="Ex: Chego 20m atrasado"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={enviando || (modoCadastro === "existente" && !jogadorIdEscolhido)}
                  className="w-full mt-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 text-sm"
                >
                  {enviando ? "Salvando..." : "Confirmar Presença ✅"}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>

        {/* CARD DE ATLETAS CONFIRMADOS (Estilo idêntico ao print que você pediu!) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Users size={20} className="text-purple-400" /> Atletas Confirmados
            </h2>
            <span className="bg-blue-600/30 text-blue-300 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
              {participantes.length} na quadra
            </span>
          </div>

          {participantes.length === 0 ? (
            <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-white/5 border-dashed text-slate-400 text-sm">
              Nenhum atleta confirmado ainda. Seja o primeiro acima!
            </div>
          ) : (
            <motion.div variants={containerAnim} initial="hidden" animate="show" className="space-y-3">
              {participantes.map(p => {
                const valorIndividual = p.horas_jogadas * custoPorHoraJogador;

                return (
                  <motion.div 
                    variants={itemAnim}
                    key={p.pagamento_id}
                    className="bg-slate-900/70 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-base text-white shadow-md border border-white/20 shrink-0">
                        {p.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white text-base flex items-center gap-2">
                          {p.nome}
                          <span className="text-xs bg-slate-800 text-amber-300 border border-white/5 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-medium">
                            <Timer size={11}/> {p.horas_jogadas}h
                          </span>
                        </p>
                        <p className={`text-xs font-bold mt-0.5 ${p.status === 'Confirmado' ? 'text-green-400' : 'text-amber-400'}`}>
                          • Status: {p.status}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Proporcional</p>
                      <p className="font-bold text-green-400 text-lg">R$ {valorIndividual.toFixed(2)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

      </div>
    </main>
  );
}