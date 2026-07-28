"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, CheckCircle, MessageSquare, Timer, User, Phone, UserCheck, UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { buscarJogoPorId } from "../../actions/jogo";
import { buscarJogadores } from "../../actions/jogador";
import { buscarParticipantes, confirmarConvitePublico } from "../../actions/pagamento";

export default function ConvitePublico() {
  const params = useParams();
  const id = params.id as string;

  const [jogo, setJogo] = useState<any>(null);
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

  useEffect(() => {
    async function carregarDadosIniciais() {
      const dadosJogo = await buscarJogoPorId(id);
      if (dadosJogo) {
        setJogo(dadosJogo);
        setHorasJogadas(dadosJogo.duracao_horas); // Padrão é o tempo total da quadra
        
        // Busca todos os jogadores cadastrados e os participantes atuais do jogo
        const todosJogadores = await buscarJogadores();
        const participantes = await buscarParticipantes(id);

        // Filtra para mostrar apenas quem AINDA NÃO está confirmado neste jogo específico
        const disponiveis = todosJogadores.filter(
          (j: any) => !participantes.some((p: any) => p.jogador_id === j.id)
        );

        setJogadoresCadastrados(disponiveis);
        
        // Se não houver ninguém cadastrado ainda, muda automaticamente para o modo "novo"
        if (disponiveis.length === 0) {
          setModoCadastro("novo");
        }
      }
      setCarregando(false);
    }
    carregarDadosIniciais();
  }, [id]);

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
      setConfirmado(true);
    } catch (error) {
      alert("Erro ao confirmar presença. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden perspective-1000">
      
      {/* Efeitos de fundo 3D */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/40 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 bg-green-500/20 w-64 h-64 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        
        {confirmado ? (
          <div className="text-center py-8 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(74,222,128,0.4)]">
              <CheckCircle size={40} />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Presença Confirmada!</h2>
            <p className="text-slate-300 text-sm">Seu cadastro foi salvo e o organizador já foi avisado. Nos vemos na quadra! 🏐</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border border-blue-400/30">
                Convite Oficial
              </span>
              <h1 className="text-3xl font-extrabold text-white mb-2">🏐 Vôlei Squad</h1>
              
              <div className="flex flex-col items-center gap-1.5 text-slate-300 mt-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-sm">
                <span className="flex items-center gap-2 font-semibold text-blue-300"><Calendar size={16}/> {jogo.data} às {jogo.horario}</span>
                <span className="flex items-center gap-2 text-slate-300"><MapPin size={15} className="text-green-400"/> {jogo.local}</span>
                <span className="flex items-center gap-2 text-slate-400 text-xs"><Timer size={14} className="text-amber-400"/> Duração Total: {jogo.duracao_horas}h</span>
              </div>
            </div>

            {/* SELETOR DE MODO (Abas: Já cadastrado / Novo) */}
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl mb-6 border border-white/10">
              <button
                type="button"
                onClick={() => setModoCadastro("existente")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modoCadastro === "existente" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserCheck size={15} /> Já tenho cadastro
              </button>
              <button
                type="button"
                onClick={() => setModoCadastro("novo")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modoCadastro === "novo" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus size={15} /> Sou novo / Cadastrar
              </button>
            </div>

            <form onSubmit={confirmarPresenca} className="space-y-4">
              
              {/* CAMPO DE SELEÇÃO SE JÁ TIVER CADASTRO */}
              {modoCadastro === "existente" ? (
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                    <User size={16} className="text-blue-400"/> Selecione seu Nome
                  </label>
                  <select 
                    value={jogadorIdEscolhido}
                    onChange={(e) => setJogadorIdEscolhido(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="">Selecione na lista...</option>
                    {jogadoresCadastrados.map(j => (
                      <option key={j.id} value={j.id}>{j.nome}</option>
                    ))}
                  </select>
                  {jogadoresCadastrados.length === 0 && (
                    <p className="text-xs text-amber-400 mt-2">Todos os cadastrados já estão neste jogo ou a lista está vazia. Use a aba "Sou novo".</p>
                  )}
                </div>
              ) : (
                /* CAMPOS DE DIGITAÇÃO SE FOR NOVO CADASTRO */
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                      <User size={16} className="text-purple-400"/> Seu Nome Completo
                    </label>
                    <input 
                      type="text" 
                      value={nomeNovo}
                      onChange={(e) => setNomeNovo(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      required
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                      <Phone size={16} className="text-green-400"/> Seu WhatsApp
                    </label>
                    <input 
                      type="text" 
                      value={telefoneNovo}
                      onChange={(e) => setTelefoneNovo(e.target.value)}
                      placeholder="Ex: 11999999999"
                      required
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </>
              )}

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
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">O valor será rateado de forma proporcional às horas.</p>
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
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={enviando || (modoCadastro === "existente" && !jogadorIdEscolhido)}
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