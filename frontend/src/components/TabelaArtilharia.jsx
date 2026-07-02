import React, { useState } from "react";

export default function TabelaArtilharia({ times }) {
  // Configuração da paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  // Cálculos de índice
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const timesPaginados = times.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(times.length / itensPorPagina);

  // Mudar de página e garantir boa UX
  const irParaPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        minWidth:"600px"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "16px", fontWeight: "600", color: "#475569", width: "60px", textAlign: "center" }}>Pos</th>
              <th style={{ padding: "16px", fontWeight: "600", color: "#475569" }}>Seleção</th>
              <th style={{ padding: "16px", fontWeight: "600", color: "#475569", width: "100px", textAlign: "center" }}>Grupo</th>
              <th style={{ padding: "16px", fontWeight: "600", color: "#475569", width: "120px", textAlign: "center" }}>Gols Marcados</th>
            </tr>
          </thead>
          <tbody>
            {timesPaginados.map((time, index) => {
              // Calcula a posição real no ranking independente da página
              const posicaoReal = indicePrimeiroItem + index + 1;
              
              return (
                <tr 
                  key={time.id} 
                  style={{ 
                    borderBottom: "1px solid #f1f5f9",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    transition: "background-color 0.2s"
                  }}
                >
                  <td style={{ 
                    padding: "14px 16px", 
                    fontWeight: "700", 
                    color: posicaoReal <= 3 ? "#0070f3" : "#64748b", 
                    textAlign: "center" 
                  }}>
                    {posicaoReal}º
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: "600", color: "#0f172a" }}>
                    {time.nome}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center", color: "#475569" }}>
                    <span style={{
                      backgroundColor: "#e2e8f0",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      Grupo {time.grupo}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: "700", color: "#0070f3", fontSize: "16px" }}>
                    {time.totalGols}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CONTROLES DE PAGINAÇÃO */}
      {totalPaginas > 1 && (
  <div style={{
    display: "flex",
    backgroundColor: "#f1f5f9",
    padding: "6px",
    borderRadius: "12px",
    marginTop: "24px",
    maxWidth: "400px",
    margin: "24px auto 0 auto",
    alignItems: "center"
  }}>
    <button 
      disabled={paginaAtual === 1}
      onClick={() => irParaPagina(Math.max(paginaAtual - 1, 1))}
      style={{
        flex: 1,
        padding: "10px 20px",
        cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: "600",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "transparent",
        color: paginaAtual === 1 ? "#cbd5e1" : "#64748b",
        transition: "all 0.2s ease",
        textAlign: "center"
      }}
    >
      Anterior
    </button>

    <span style={{ 
      padding: "0 16px", 
      fontSize: "14px", 
      color: "#0f172a", 
      fontWeight: "700",
      whiteSpace: "nowrap"
    }}>
      {paginaAtual} / {totalPaginas}
    </span>

    <button 
      disabled={paginaAtual === totalPaginas}
      onClick={() => irParaPagina(Math.min(paginaAtual + 1, totalPaginas))}
      style={{
        flex: 1,
        padding: "10px 20px",
        cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: "600",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "transparent",
        color: paginaAtual === totalPaginas ? "#cbd5e1" : "#64748b",
        transition: "all 0.2s ease",
        textAlign: "center"
      }}
    >
      Próximo
    </button>
  </div>
)}
    </div>
  );
}