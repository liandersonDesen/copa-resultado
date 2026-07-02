import { useEffect, useState } from "react";
import api from "../services/api";
import TabelaGrupo from "../components/TabelaGrupo";
import ListaPartidas from "../components/ListaPartidas";
import ModalEdicaoPlacar from "../components/ModalEdicaoPlacar";
import TabelaArtilharia from "../components/TabelaArtilharia";

export default function Home() {
  // Controle de Navegação (Abas)
  const [abaAtiva, setAbaAtiva] = useState("grupos");


  // Estados de Dados
  const [classificacao, setClassificacao] = useState(null);
  const [rodadasDoGrupo, setRodadasDoGrupo] = useState({ r1: [], r2: [], r3: [] });
  const [todasPartidasDaRodada, setTodasPartidasDaRodada] = useState([]);
  const [dadosArtilharia, setDadosArtilharia] = useState([]);


  // Estados de Carregamento (Agora controlam apenas opacidade/feedback visual)
  const [carregandoClassificacao, setCarregandoClassificacao] = useState(true);
  const [carregandoRodadas, setCarregandoRodadas] = useState(true);
  const [carregandoGeral, setCarregandoGeral] = useState(true);
  const [carregandoArtilharia, setCarregandoArtilharia] = useState(true);

  // Estados de Filtros
  const [grupoSelecionado, setGrupoSelecionado] = useState("A");
  const [rodadaGeral, setRodadaGeral] = useState(1); 

  // 🌟 ESTADOS PARA EDIÇÃO DO PLACAR
  const [jogoEmEdicao, setJogoEmEdicao] = useState(null); 
  const [golsMandanteInput, setGolsMandanteInput] = useState("");
  const [golsVisitanteInput, setGolsVisitanteInput] = useState("");
  const [salvandoPlacar, setSalvandoPlacar] = useState(false);

  const grupos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const carregarClassificacao = async () => {
    try {
      setCarregandoClassificacao(true);
      const response = await api.get(`/selecoes/classificacao/${grupoSelecionado}`);
      setClassificacao(response.data);
    } catch (error) {
      console.error("Erro ao buscar classificação:", error);
    } finally {
      setCarregandoClassificacao(false);
    }
  };

  const carregarTodasRodadasDoGrupo = async () => {
    try {
      setCarregandoRodadas(true);
      const [res1, res2, res3] = await Promise.all([
        api.get(`/partidas/rodada/1/grupo/${grupoSelecionado}`),
        api.get(`/partidas/rodada/2/grupo/${grupoSelecionado}`),
        api.get(`/partidas/rodada/3/grupo/${grupoSelecionado}`)
      ]);
      setRodadasDoGrupo({
        r1: res1.data || [],
        r2: res2.data || [],
        r3: res3.data || []
      });
    } catch (error) {
      console.error("Erro ao carregar rodadas do grupo:", error);
    } finally {
      setCarregandoRodadas(false);
    }
  };

  const carregarTodasPartidasGlobais = async () => {
    try {
      setCarregandoGeral(true);
      const response = await api.get(`/partidas/rodada/${rodadaGeral}`);
      setTodasPartidasDaRodada(response.data);
    } catch (error) {
      console.error("Erro ao buscar todas as partidas da rodada:", error);
    } finally {
      setCarregandoGeral(false);
    }
  };

  const carregarArtilharia = async () => {
    try {
      setCarregandoArtilharia(true);
      // Ajuste a rota abaixo para a rota real da sua API que retorna esse JSON enviado
      const response = await api.get("/artilharia"); 
      setDadosArtilharia(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados de gols:", error);
    } finally {
      setCarregandoArtilharia(false);
    }
  };

  // Triggers dos useEffects usando as funções isoladas
  useEffect(() => { carregarClassificacao(); }, [grupoSelecionado]);
  useEffect(() => { carregarTodasRodadasDoGrupo(); }, [grupoSelecionado]);
  useEffect(() => { carregarTodasPartidasGlobais(); }, [rodadaGeral]);
  useEffect(() => { carregarArtilharia(); }, []);

  
  // 🌟 FUNÇÃO DE SALVAMENTO ENVIADA PARA O COMPONENTE
  const lidarComSalvarPlacar = async ({ partidaId, golsMandante, golsVisitante }) => {
    try {
      setSalvandoPlacar(true);

      await api.patch(`/partidas/${partidaId}/resultado`, {
        golsMandante,
        golsVisitante,
      });

      // Atualiza os dados da tela em paralelo
      await Promise.all([
        carregarClassificacao(),
        carregarTodasRodadasDoGrupo(),
        carregarTodasPartidasGlobais(),
        carregarArtilharia()
      ]);

      setJogoEmEdicao(null); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar o placar:", error);
      alert("Não foi possível salvar o placar.");
    } finally {
      setSalvandoPlacar(false);
    }
  };

  // Estilos da Navbar (Estilo Pílula/Segmented Control)
  const obterEstiloAba = (idAba) => ({
    flex: 1,
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    backgroundColor: abaAtiva === idAba ? "#ffffff" : "transparent",
    color: abaAtiva === idAba ? "#0070f3" : "#64748b",
    boxShadow: abaAtiva === idAba ? "0 4px 12px rgba(0, 0, 0, 0.05)" : "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "center"
  });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", fontFamily: "sans-serif", color: "#0f172a" }}>

      <header style={{ marginBottom: 28, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Central de Resultados — Copa 2026
        </h1>
      </header>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        backgroundColor: "#f1f5f9",
        padding: "6px",
        borderRadius: "12px",
        marginBottom: 32,
        maxWidth: "500px",
        margin: "0 auto 32px auto"
      }}>
        <button style={obterEstiloAba("grupos")} onClick={() => setAbaAtiva("grupos")}>
          Por Grupos
        </button>
        <button style={obterEstiloAba("visao-geral")} onClick={() => setAbaAtiva("visao-geral")}>
          Visão Geral da Rodada
        </button>
        <button style={obterEstiloAba("artilharia")} onClick={() => setAbaAtiva("artilharia")}>
          Melhores Ataques
        </button>
      </nav>

      {/* ================= TELA 1: DETALHE DOS GRUPOS ================= */}
      {abaAtiva === "grupos" && (
        <div>
          {/* Seletor de Grupos — 2 linhas de 6 botões */}
          <div style={{
            marginBottom: 32,
            padding: "24px",
            backgroundColor: "#f8fafc",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <strong style={{
              display: "block",
              marginBottom: 16,
              color: "#1e293b",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Selecione o Grupo
            </strong>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", // Mantém as 6 colunas rigorosamente iguais
              gap: "12px"
            }}>
              {grupos.map((g) => {
                const estaSelecionado = grupoSelecionado === g;
                return (
                  <button
                    key={g}
                    onClick={() => setGrupoSelecionado(g)}
                    style={{
                      height: "44px", // 🌟 FIXA A ALTURA: Garante que o container nunca mude de tamanho vertical
                      boxSizing: "border-box", // Evita que a borda de 2px altere o tamanho total do botão
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: estaSelecionado ? "600" : "500",
                      borderRadius: "10px",
                      border: estaSelecionado ? "2px solid #0070f3" : "1px solid #e2e8f0", // Mantém consistência visual
                      backgroundColor: estaSelecionado ? "#0070f3" : "#ffffff",
                      color: estaSelecionado ? "#ffffff" : "#475569",
                      boxShadow: estaSelecionado ? "0 4px 12px rgba(0, 112, 243, 0.25)" : "none",
                      transition: "background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease", // Tira o 'all' para o texto negrito não empurrar nada
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    Grupo {g}
                  </button>
                );
              })}
            </div>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: 16 }}>Classificação Atual</h2>

          {/* 🌟 MUDANÇA AQUI: O componente não é destruído. Ele fica estático, apenas ganha opacidade menor enquanto carrega */}
          <div style={{
            minHeight: "260px",
            transition: "opacity 0.2s ease",
            opacity: carregandoClassificacao ? 0.5 : 1,

          }}>
            {classificacao ? (
              <TabelaGrupo grupo={grupoSelecionado} tabela={classificacao.tabela} />
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Carregando dados iniciais...</div>
            )}
          </div>

          {/* VISÃO GERAL DAS RODADAS DO GRUPO */}
          <h2 style={{ marginTop: 40, borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>
            Confrontos
          </h2>

          {/* 🌟 MUDANÇA AQUI: Mantém o grid intacto com os dados antigos e suaviza com opacidade enquanto a API não responde */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            marginTop: 20,
            transition: "opacity 0.2s ease",
            opacity: carregandoRodadas ? 0.6 : 1,
            width: "1000px"
          }}>

            {/* CARD 1ª RODADA */}
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#0070f3", fontWeight: "600" }}>1ª Rodada</h4>
              <ListaPartidas partidas={rodadasDoGrupo.r1} onCliqueJogo={setJogoEmEdicao} />
            </div>

            {/* CARD 2ª RODADA */}
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#0070f3", fontWeight: "600" }}>2ª Rodada</h4>
              <ListaPartidas partidas={rodadasDoGrupo.r2} onCliqueJogo={setJogoEmEdicao} />
            </div>

            {/* CARD 3ª RODADA */}
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#0070f3", fontWeight: "600" }}>3ª Rodada</h4>
              <ListaPartidas partidas={rodadasDoGrupo.r3} onCliqueJogo={setJogoEmEdicao} />
            </div>

          </div>
        </div>
      )}

      {/* ================= TELA 2: VISÃO GERAL DA RODADA DA COPA ================= */}
      {abaAtiva === "visao-geral" && (
        <div>
          {/* Seletor de Rodadas */}
          <div style={{ marginBottom: 24, padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <strong style={{ color: "#333", marginRight: 12 }}>Visualizar Rodada: </strong>
            {[1, 2, 3].map((r) => (
              <button
                key={r}
                onClick={() => setRodadaGeral(r)}
                style={{
                  marginRight: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: rodadaGeral === r ? "bold" : "normal",
                  border: "1px solid",
                  borderColor: rodadaGeral === r ? "#0070f3" : "#cbd5e1",
                  borderRadius: "6px",
                  backgroundColor: rodadaGeral === r ? "#0070f3" : "#ffffff",
                  color: rodadaGeral === r ? "#ffffff" : "#334155",
                  transition: "all 0.2s ease"
                }}
              >
                {r}ª Rodada
              </button>
            ))}
          </div>

          <h2>Todos os Jogos da {rodadaGeral}ª Rodada da Copa</h2>

          <div style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            minHeight: "400px", // 🌟 Garante um espaço mínimo inicial caso a primeira carga demore
            width: "900px"
          }}>
            {todasPartidasDaRodada.length > 0 ? (
              /* 🌟 O grid agora apenas esmaece (ganha opacidade 0.5) enquanto os novos jogos carregam, sem quebrar a estrutura */
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                transition: "opacity 0.2s ease",
                opacity: carregandoGeral ? 0.5 : 1
              }}>
                {/* Coluna 1: Metade esquerda */}
                <ListaPartidas partidas={todasPartidasDaRodada.slice(0, Math.ceil(todasPartidasDaRodada.length / 2))} onCliqueJogo={setJogoEmEdicao} />

                {/* Coluna 2: Metade direita */}
                <ListaPartidas partidas={todasPartidasDaRodada.slice(Math.ceil(todasPartidasDaRodada.length / 2))} onCliqueJogo={setJogoEmEdicao} />
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0" }}>
                Carregando cronograma completo...
              </p>
            )}
          </div>
        </div>
      )}
      {/* ================= TELA 3: MELHORES ATAQUES ================= */}
      {abaAtiva === "artilharia" && (
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: 16 }}>Ranking de Gols Pró</h2>
          
          <div style={{
            transition: "opacity 0.2s ease",
            opacity: carregandoArtilharia ? 0.5 : 1,
            maxWidth: "800px",
            margin: "0 auto"
          }}>
            {dadosArtilharia.length > 0 ? (
              <TabelaArtilharia times={dadosArtilharia} />
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Carregando ranking de gols...</div>
            )}
          </div>
        </div>
      )}

      <ModalEdicaoPlacar
        jogo={jogoEmEdicao}
        aoFechar={() => setJogoEmEdicao(null)}
        aoSalvar={lidarComSalvarPlacar}
        salvando={salvandoPlacar}
      />
    </main>
  );
}