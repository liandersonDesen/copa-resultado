import { useState, useEffect } from "react";

export default function ModalEdicaoPlacar({ jogo, aoFechar, aoSalvar, salvando }) {
  const [golsMandante, setGolsMandante] = useState("");
  const [golsVisitante, setGolsVisitante] = useState("");

  // Sempre que o jogo mudar (ou abrir), preenche os inputs com os valores atuais
  useEffect(() => {
    if (jogo) {
      setGolsMandante(jogo.golsMandante.toString());
      setGolsVisitante(jogo.golsVisitante.toString());
    }
  }, [jogo]);

  // Se não houver jogo selecionado, não renderiza nada
  if (!jogo) return null;

  const handleSubmeter = (e) => {
    e.preventDefault();
    aoSalvar({
      partidaId: jogo.id,
      golsMandante: parseInt(golsMandante) || 0,
      golsVisitante: parseInt(golsVisitante) || 0,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        backgroundColor: "#ffffff", padding: "32px", borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        width: "100%", maxWidth: "450px", border: "1px solid #e2e8f0"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700", textAlign: "center" }}>
          Atualizar Placar da Partida
        </h3>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b", textAlign: "center" }}>
          {jogo.fase} — Rodada {jogo.rodada}
        </p>

        <form onSubmit={handleSubmeter}>
          <div style={{ display: "flex", alignItems: "center", justifyConent: "space-between", gap: "16px", marginBottom: "32px" }}>
            
            {/* Mandante */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <img src={jogo.mandante.bandeira} alt={jogo.mandante.nome} style={{ width: 44, height: 30, borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "8px" }} />
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{jogo.mandante.nome}</div>
              <input 
                type="number" 
                min="0"
                required
                value={golsMandante}
                onChange={(e) => setGolsMandante(e.target.value)}
                style={{ width: "60px", padding: "8px", marginTop: "12px", textAlign: "center", fontSize: "18px", fontWeight: "bold", borderRadius: "8px", border: "2px solid #cbd5e1" }}
              />
            </div>

            <div style={{ fontWeight: "700", fontSize: "20px", color: "#94a3b8", marginTop: "36px" }}>X</div>

            {/* Visitante */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <img src={jogo.visitante.bandeira} alt={jogo.visitante.nome} style={{ width: 44, height: 30, borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "8px" }} />
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{jogo.visitante.nome}</div>
              <input 
                type="number" 
                min="0"
                required
                value={golsVisitante}
                onChange={(e) => setGolsVisitante(e.target.value)}
                style={{ width: "60px", padding: "8px", marginTop: "12px", textAlign: "center", fontSize: "18px", fontWeight: "bold", borderRadius: "8px", border: "2px solid #cbd5e1" }}
              />
            </div>

          </div>

          {/* Botões de Ação */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              type="button"
              onClick={aoFechar}
              disabled={salvando}
              style={{ flex: 1, padding: "12px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={salvando}
              style={{ flex: 2, padding: "12px", backgroundColor: "#0070f3", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 112, 243, 0.2)" }}
            >
              {salvando ? "Salvando..." : "Confirmar Placar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}