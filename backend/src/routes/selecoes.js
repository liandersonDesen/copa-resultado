import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /selecoes
router.get("/", async (req, res) => {
  try {
    const selecoes = await prisma.selecao.findMany({
      orderBy: [
        { grupo: 'asc' },
        { nome: 'asc' }
      ]
    });
    
    return res.json(selecoes);
  } catch (error) {
    console.error("Erro em GET /selecoes:", error);
    return res.status(500).json({ error: "Erro ao buscar seleções." });
  }
});

// GET /selecoes/grupo/:letra
router.get("/grupo/:letra", async (req, res) => {
  try {
    const letraGrupo = req.params.letra.toUpperCase();

    const selecoes = await prisma.selecao.findMany({
      where: { grupo: letraGrupo },
      orderBy: { nome: 'asc' }
    });

    if (selecoes.length === 0) {
      return res.status(404).json({ error: `Grupo '${letraGrupo}' não encontrado.` });
    }

    return res.json(selecoes);
  } catch (error) {
    console.error(`Erro em GET /selecoes/grupo/${req.params.letra}:`, error);
    return res.status(500).json({ error: "Erro ao buscar grupo." });
  }
});

// GET /selecoes/classificacao/:grupo
router.get("/classificacao/:grupo", async (req, res) => {
  try {
    const letraGrupo = req.params.grupo.toUpperCase();

    // Passo 1: buscar as seleções do grupo
    const selecoes = await prisma.selecao.findMany({
      where: { grupo: letraGrupo }
    });

    if (selecoes.length === 0) {
      return res.status(404).json({ error: `Grupo '${letraGrupo}' não encontrado.` });
    }

    // Passo 2: buscar as partidas realizadas deste grupo
    // Filtramos partidas onde o mandante pertence ao grupo correspondente
    const partidas = await prisma.partida.findMany({
      where: {
        realizada: true,
        mandante: { grupo: letraGrupo }
      }
    });

    // Passo 3: Inicializar a estrutura de classificação para cada seleção
    const tabelaMap = {};
    selecoes.forEach(s => {
      tabelaMap[s.id] = {
        id: s.id,
        nome: s.nome,
        sigla: s.sigla,
        bandeira: s.bandeira,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        golsPro: 0,
        golsContra: 0,
        saldoGols: 0
      };
    });

    // Processar os dados das partidas calculando os pontos e gols
    partidas.forEach(partida => {
      const { mandanteId, visitanteId, golsMandante, golsVisitante } = partida;

      const m = tabelaMap[mandanteId];
      const v = tabelaMap[visitanteId];

      // Proteção caso os IDs das partidas não casem com o grupo mapeado
      if (!m || !v) return;

      // Incrementar contagem de jogos
      m.jogos++;
      v.jogos++;

      // Acumular Gols Pró e Contra
      m.golsPro += golsMandante;
      m.golsContra += golsVisitante;

      v.golsPro += golsVisitante;
      v.golsContra += golsMandante;

      // Lógica do resultado (Vitória, Empate ou Derrota)
      if (golsMandante > golsVisitante) {
        m.pontos += 3;
        m.vitorias++;
        v.derrotas++;
      } else if (golsVisitante > golsMandante) {
        v.pontos += 3;
        v.vitorias++;
        m.derrotas++;
      } else {
        m.pontos += 1;
        v.pontos += 1;
        m.empates++;
        v.empates++;
      }
    });

    // Converter o mapa em Array e computar o saldo de gols final de cada time
    const tabela = Object.values(tabelaMap).map(time => {
      time.saldoGols = time.golsPro - time.golsContra;
      return time;
    });

    // Passo 4: Ordenar por Pontos -> Saldo de Gols -> Gols Pró
    tabela.sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
      return b.golsPro - a.golsPro;
    });

    // Passo 5: Retornar resultado estruturado
    return res.json({
      grupo: letraGrupo,
      tabela
    });

  } catch (error) {
    console.error(`Erro ao gerar classificação do grupo ${req.params.grupo}:`, error);
    return res.status(500).json({ error: "Erro ao processar tabela de classificação." });
  }
});

export default router;