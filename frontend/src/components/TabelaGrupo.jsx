import React from 'react';

export default function TabelaGrupo({ grupo, tabela }) {
  if (!tabela || tabela.length === 0) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: '#888', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
        Carregando classificação do Grupo {grupo}...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '30px auto', 
      padding: '20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' // Sombra suave para tirar o aspecto plano
    }}>
      <h2 style={{ 
        color: '#1a1a1a',
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 20px 0',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
      }}>
        Grupo {grupo}
      </h2>
      
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px', color: '#333' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eaeaea', height: '45px' }}>
              <th style={{ width: '8%', color: '#666', fontWeight: '600' }}>Pos</th>
              <th style={{ textAlign: 'left', paddingLeft: '16px', width: '32%', color: '#666', fontWeight: '600' }}>Seleção</th>
              <th style={{ width: '7%', fontWeight: '700', color: '#1a1a1a' }}>P</th>
              <th style={{ width: '7%', color: '#666' }}>J</th>
              <th style={{ width: '7%', color: '#666' }}>V</th>
              <th style={{ width: '7%', color: '#666' }}>E</th>
              <th style={{ width: '7%', color: '#666' }}>D</th>
              <th style={{ width: '7%', color: '#666' }}>GP</th>
              <th style={{ width: '7%', color: '#666' }}>GC</th>
              <th style={{ width: '11%', color: '#666' }}>SG</th>
            </tr>
          </thead>
          <tbody>
            {tabela.map((time, index) => {
              const posicao = index + 1;
              const zonaClassificacao = posicao <= 2;

              return (
                <tr 
                  key={time.id || index} 
                  style={{ 
                    borderBottom: index === tabela.length - 1 ? 'none' : '1px solid #f1f1f1', 
                    height: '52px',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' 
                  }}
                >
                  {/* Posição com indicador lateral arredondado */}
                  <td style={{ 
                    fontWeight: 'bold', 
                    color: zonaClassificacao ? '#2e7d32' : '#777',
                    position: 'relative',
                    paddingLeft: '8px'
                  }}>
                    {zonaClassificacao && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '10%',
                        height: '80%',
                        width: '4px',
                        backgroundColor: '#2e7d32',
                        borderRadius: '0 4px 4px 0'
                      }} />
                    )}
                    {posicao}º
                  </td>

                  {/* Seleção alinhada e com elementos fluidos */}
                  <td style={{ textAlign: 'left', paddingLeft: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={time.bandeira} 
                        alt="" 
                        style={{ width: '22px', height: 'auto', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} 
                      /> 
                      <span style={{ fontWeight: '500', color: '#1a1a1a' }}>
                        {time.nome || time.selecao}
                      </span>
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        ({time.sigla})
                      </span>
                    </div>
                  </td>

                  {/* Dados Numéricos */}
                  <td style={{ fontWeight: '700', color: '#1a1a1a', backgroundColor: '#fbfbfb' }}>{time.pontos}</td>
                  <td style={{ color: '#555' }}>{time.jogos}</td>
                  <td style={{ color: '#555' }}>{time.vitorias}</td>
                  <td style={{ color: '#555' }}>{time.empates}</td>
                  <td style={{ color: '#555' }}>{time.derrotas}</td>
                  <td style={{ color: '#777' }}>{time.golsPro}</td>
                  <td style={{ color: '#777' }}>{time.golsContra}</td>
                  
                  {/* Saldo de Gols */}
                  <td style={{ 
                    fontWeight: '600', 
                    color: time.saldoGols > 0 ? '#2e7d32' : time.saldoGols < 0 ? '#c62828' : '#333' 
                  }}>
                    {time.saldoGols > 0 ? `+${time.saldoGols}` : time.saldoGols}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}