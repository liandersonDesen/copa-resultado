import React from 'react';
export default function ListaPartidas({ partidas, onCliqueJogo }) {
  if (!partidas || partidas.length === 0) {
    return <p style={{ color: "#94a3b8", textAlign: "center" }}>Nenhum jogo.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {partidas.map((partida) => (
        <div
          key={partida.id}
          onClick={() => onCliqueJogo && onCliqueJogo(partida)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 12px 12px 12px", // Espaço extra no topo para acomodar o indicador
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            position: "relative", // 🌟 Permite posicionar o ícone de editar no topo
            transition: "all 0.2s ease",
          }}
          // Efeito visual ao passar o mouse por cima do card inteiro
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#0070f3"; // Borda azul indica ação
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 70, 243, 0.08)";
            // Seleciona o textinho de "Editar" interno e deixa ele azul e visível
            const labelEditar = e.currentTarget.querySelector(".label-editar");
            if (labelEditar) {
              labelEditar.style.opacity = "1";
              labelEditar.style.color = "#0070f3";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
            const labelEditar = e.currentTarget.querySelector(".label-editar");
            if (labelEditar) {
              labelEditar.style.opacity = "0.4";
              labelEditar.style.color = "#94a3b8";
            }
          }}
        >
          {/* 🌟 INDICADOR VISUAL: Pequeno texto + Lápis no topo do card */}
          <div 
            className="label-editar"
            style={{
              position: "absolute",
              top: "2px",
              right: "8px",
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#94a3b8",
              opacity: "0.4", // Fica semi-transparente por padrão
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease"
            }}
          >
            <span>Editar</span>
            {/* Ícone de Lápis em SVG puro */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>

          {/* Time Mandante */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <img src={partida.mandante.bandeira} alt={partida.mandante.sigla} style={{ width: 24, height: 16, borderRadius: 2 }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>{partida.mandante.sigla}</span>
          </div>
          
          {/* Placar Central */}
          <div style={{ fontWeight: "800", padding: "0 12px", fontSize: "16px", color: "#1e293b" }}>
            {partida.golsMandante} x {partida.golsVisitante}
          </div>

          {/* Time Visitante */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>{partida.visitante.sigla}</span>
            <img src={partida.visitante.bandeira} alt={partida.visitante.sigla} style={{ width: 24, height: 16, borderRadius: 2 }} />
          </div>

        </div>
      ))}
    </div>
  );
}