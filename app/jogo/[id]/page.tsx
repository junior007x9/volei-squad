"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Clock, UserPlus, Receipt, Trash2, X, Upload, CheckCircle, Timer, MessageSquare, Link as LinkIcon, Copy } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { buscarJogoPorId } from "../../actions/jogo";
import { buscarJogadores } from "../../actions/jogador";
import { adicionarParticipante, buscarParticipantes, removerParticipante, enviarComprovante } from "../../actions/pagamento";

export default function DetalhesJogo() {
  const params = useParams();
  const id = params.id as string;

  const [jogo, setJogo] = useState<any>(null);
  const [todosJogadores, setTodosJogadores] = useState<any[]>([]);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [linkCopiado, setLinkCopiado] = useState(false);

  // Estados do formulário organizador
  const [jogadorSelecionado, setJogadorSelecionado] = useState("");
  const [horasJogadas, setHorasJogadas] = useState<number>(2);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [pagamentoIdSelecionado, setPagamentoIdSelecionado] = useState("");
  const [fazendoUpload, setFazendoUpload] = useState(false);

  const carregarDados = useCallback(async () => {
    const dadosJogo = await buscarJogoPorId(id);
    const dadosJogadores = await buscarJogadores();
    const dadosParticipantes = await buscarParticipantes(id);
    
    setJogo(dadosJogo);
    if (dadosJogo) setHorasJogadas(dadosJogo.duracao_horas);
    setTodosJogadores(dadosJogadores);
    setParticipantes(dadosParticipantes);
    setCarregando(false);
  }, [id]);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!jogadorSelecionado) return;
    await adicionarParticipante(id, jogadorSelecionado, horasJogadas, "Adicionado pelo Organizador");
    setJogadorSelecionado("");
    await carregarDados();
  }

  async function handleRemover(pagamento_id: string) {
    if (confirm("Cortar este jogador da partida?")) {
      await removerParticipante(pagamento_id);
      await carregarDados();
    }
  }

  async function handleUploadComprovante(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFazendoUpload(true);
    try {
      const formData = new FormData(e.currentTarget);
      await enviarComprovante(pagamentoIdSelecionado, formData);
      setModalAberto(false);
      await carregarDados();
    } catch (error) {
      alert("Erro ao enviar comprovante.");
    } finally {
      setFazendoUpload(false);
    }
  }

  function copiarLinkConvite() {
    const link = `${window.location.origin}/convite/${id}`;
    navigator.clipboard.writeText(link);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 3000);
  }

  if (carregando) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center animate-pulse">Aquecendo...</div>;
  if (!jogo) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Jogo não encontrado!</div>;

  // --- A MÁGICA DA MATEMÁTICA PROPORCIONAL ---
  const valorTotal = jogo.valor_total;
  const duracaoQuadra = jogo.duracao_horas;
  
  // Soma todas as horas que a galera vai jogar junta
  const totalHorasCompradas = participantes.reduce((acc, p) => acc + (p.horas_jogadas || 0), 0);
  
  // O custo de 1 hora de jogador. (Se faltar gente, quem joga paga mais caro)
  const custoPorHoraJogador = totalHorasCompradas > 0 ? (valorTotal / totalHorasCompradas) : 0;
  
  const jogadoresDisponiveis = todosJogadores.filter(
    (j) => !participantes.some((p) => p.jogador_id === j.id)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Painel do Organizador
            </h1>
          </div>
          
          <button 
            onClick={copiarLinkConvite}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl transition-all font-semibold"
          >
            {linkCopiado ? <CheckCircle size={18} className="text-green-400"/> : <LinkIcon size={18} className="text-blue-400"/>}
            {linkCopiado ? "Link Copiado!" : "Copiar Convite"}
          </button>
        </div>

        {/* Card Resumo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <MapPin className="text-blue-400" /> {jogo.local}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl"><Calendar size={18} className="text-blue-400"/> {jogo.data}</span>
              <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl"><Clock size={18} className="text-blue-400"/> {jogo.horario}</span>
              <span className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl"><Timer size={18} className="text-amber-400"/> {duracaoQuadra} hrs</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-white/10 text-center min-w-[250px] shadow-inner">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Custo Total da Quadra</p>
            <p className="text-3xl font-bold text-white mb-2">R$ {valorTotal.toFixed(2)}</p>
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-slate-400">O sistema calcula o valor justo por hora para cada jogador.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Adição Manual */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 bg-white/5 border border-white/10 p-6 rounded-3xl h-fit">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <UserPlus size={22} className="text-purple-400"/> Escalar Manual
            </h2>
            <form onSubmit={handleAdicionar} className="space-y-4">
              <select value={jogadorSelecionado} onChange={(e) => setJogadorSelecionado(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white">
                <option value="">Selecione o jogador...</option>
                {jogadoresDisponiveis.map(j => <option key={j.id} value={j.id}>{j.nome}</option>)}
              </select>
              <div className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-xl px-4 py-3">
                <Timer size={18} className="text-amber-400"/>
                <input type="number" step="0.5" min="0.5" max={duracaoQuadra} value={horasJogadas} onChange={(e) => setHorasJogadas(parseFloat(e.target.value))} className="w-full bg-transparent outline-none text-white" placeholder="Horas"/>
              </div>
              <button type="submit" disabled={!jogadorSelecionado} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50">Adicionar</button>
            </form>
          </motion.div>

          {/* Lista e Cálculos */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 bg-white/5 border border-white/10 p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-5 flex items-center justify-between">
              Confirmados ({participantes.length})
            </h2>

            {participantes.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed text-slate-400">
                Copie o link de convite e mande no grupo!
              </div>
            ) : (
              <div className="space-y-3">
                {participantes.map(p => {
                  // O valor individual que ESTE jogador tem que pagar
                  const valorIndividual = p.horas_jogadas * custoPorHoraJogador;

                  return (
                    <motion.div key={p.pagamento_id} className="bg-slate-800/60 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-lg flex items-center gap-2">
                            {p.nome} 
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Timer size={12}/> {p.horas_jogadas}h
                            </span>
                          </p>
                          <div className="flex flex-col text-sm mt-1">
                            <span className={p.status === 'Confirmado' ? 'text-green-400 font-semibold' : 'text-amber-400'}>Status: {p.status}</span>
                            {p.observacao && <span className="text-slate-400 italic text-xs mt-1">"{p.observacao}"</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto bg-slate-900/50 p-2 sm:p-0 sm:bg-transparent rounded-xl">
                        <div className="text-right px-2">
                          <p className="text-xs text-slate-400">Valor a pagar</p>
                          <p className="font-bold text-green-400 text-lg">R$ {valorIndividual.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          {p.status === 'Pendente' ? (
                            <button onClick={() => { setPagamentoIdSelecionado(p.pagamento_id); setModalAberto(true); }} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all" title="Validar Pix">
                              <Upload size={20}/>
                            </button>
                          ) : (
                            <a href={p.url_comprovante} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all" title="Ver Pix">
                              <CheckCircle size={20}/>
                            </a>
                          )}
                          <button onClick={() => handleRemover(p.pagamento_id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="Cortar do jogo">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de Upload (mantido igualzinho) */}
      <AnimatePresence>
        {modalAberto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border border-white/20 p-8 rounded-3xl max-w-md w-full relative">
              <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><X size={20} /></button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><Receipt size={32} /></div>
                <h2 className="text-2xl font-bold text-white">Validar Pagamento</h2>
                <p className="text-slate-400 text-sm mt-2">Faça o upload do print do Pix.</p>
              </div>
              <form onSubmit={handleUploadComprovante} className="space-y-6">
                <input type="file" name="comprovante" accept="image/*,application/pdf" required className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-500/20 file:text-blue-400 cursor-pointer"/>
                <button type="submit" disabled={fazendoUpload} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-400 disabled:opacity-70 flex justify-center">
                  {fazendoUpload ? "Enviando..." : "Confirmar Comprovante"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}