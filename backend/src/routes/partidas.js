import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /partidas
// Retorna todas as partidas incluindo dados das seleções
router.get("/", async (req, res) => {
  try {
    const partidas = await prisma.partida.findMany({
      include: {
        mandante: true,
        visitante: true,
      },
      orderBy: {
        rodada: "asc",
      },
    });

    res.json(partidas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar partidas." });
  }
});

// GET /partidas/rodada/:numero
// Retorna as partidas de uma rodada específica
router.get("/rodada/:numero", async (req, res) => {
  const rodadaNumero = parseInt(req.params.numero, 10);

  if (isNaN(rodadaNumero)) {
    return res.status(400).json({ erro: "A rodada deve ser um número válido." });
  }

  try {
    const partidas = await prisma.partida.findMany({
      where: {
        rodada: rodadaNumero,
      },
      include: {
        mandante: true,
        visitante: true,
      },
    });

    res.json(partidas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar partidas da rodada." });
  }
});

// GET /partidas/rodada/:numero/grupo/:grupo
// Retorna as partidas de uma rodada específica filtradas por grupo
router.get("/rodada/:numero/grupo/:grupo", async (req, res) => {
  const rodadaNumero = parseInt(req.params.numero, 10);
  const letraGrupo = req.params.grupo.toUpperCase();

  // Validação do número da rodada
  if (isNaN(rodadaNumero)) {
    return res.status(400).json({ erro: "A rodada deve ser um número válido." });
  }

  try {
    const partidas = await prisma.partida.findMany({
      where: {
        rodada: rodadaNumero,
        mandante: {
          grupo: letraGrupo
        }
      },
      include: {
        mandante: true,
        visitante: true,
      },
      orderBy: {
        id: "asc" 
      }
    });

    if (partidas.length === 0) {
      return res.status(404).json({ 
        erro: `Nenhuma partida encontrada para a rodada ${rodadaNumero} no Grupo ${letraGrupo}.` 
      });
    }

    res.json(partidas);
  } catch (error) {
    console.error(`Erro em GET /partidas/rodada/${req.params.numero}/grupo/${req.params.grupo}:`, error);
    res.status(500).json({ erro: "Erro ao buscar partidas do grupo na rodada." });
  }
});

// PATCH /partidas/:id/resultado
// Atualiza o placar de uma partida
router.patch("/:id/resultado", async (req, res) => {
  const { id } = req.params;
  const { golsMandante, golsVisitante } = req.body;

  // Validação simples para garantir que os gols foram enviados
  if (golsMandante === undefined || golsVisitante === undefined) {
    return res.status(400).json({ erro: "golsMandante e golsVisitante são obrigatórios." });
  }

  try {
    const partidaAtualizada = await prisma.partida.update({
      where: { id: Number(id) }, // Certifique-se de usar Number(id) ou String(id) dependendo do seu schema
      data: {
        golsMandante: Number(golsMandante),
        golsVisitante: Number(golsVisitante),
        realizada: true,
      },
    });

    res.json(partidaAtualizada);
  } catch (error) {
    // Tratando o erro P2025 do Prisma (Registro não encontrado)
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Partida não encontrada." });
    }
    
    res.status(500).json({ erro: "Erro ao atualizar o resultado da partida." });
  }
});


export default router;