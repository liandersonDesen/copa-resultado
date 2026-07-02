import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


// GET /artilharia
// Retorna as seleções ordenadas pelo total de gols marcados
router.get("/", async (req, res) => {
  try {
    // 1. Busca todas as seleções incluindo as partidas que jogaram
    const selecoes = await prisma.selecao.findMany({
      include: {
        partidasMandante: true,  // Ajuste o nome conforme o seu schema.prisma
        partidasVisitante: true, // Ajuste o nome conforme o seu schema.prisma
      },
    });

    // 2. Mapeia e calcula o total de gols de cada uma
    const rankingGols = selecoes.map((selecao) => {
      const golsComoMandante = selecao.partidasMandante.reduce(
        (acc, partida) => acc + (partida.golsMandante || 0), 0
      );
      
      const golsComoVisitante = selecao.partidasVisitante.reduce(
        (acc, partida) => acc + (partida.golsVisitante || 0), 0
      );

      return {
        id: selecao.id,
        nome: selecao.nome,
        grupo: selecao.grupo,
        totalGols: golsComoMandante + golsComoVisitante,
      };
    });

    // 3. Ordena do maior número de gols para o menor
    rankingGols.sort((a, b) => b.totalGols - a.totalGols);

    res.json(rankingGols);
  } catch (error) {
    console.error("Erro em GET /artilharia:", error);
    res.status(500).json({ erro: "Erro ao buscar a artilharia por seleções." });
  }
});

export default router;