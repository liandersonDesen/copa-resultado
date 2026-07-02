import { PrismaClient } from "@prisma/client";
import dadosCopa from "../src/mock/dadosCopa.js";

const prisma = new PrismaClient();

async function limparBanco() {
  // Deleta primeiro a tabela que tem as chaves estrangeiras
  await prisma.partida.deleteMany({});
  
  // Agora a tabela principal pode ser limpa com segurança
  await prisma.selecao.deleteMany({});
  
  console.log("Banco de dados limpo com sucesso!");
}

async function inserirSelecoes(grupo) {
  for (const selecao of grupo.selecoes) {
    await prisma.selecao.create({
      data: {
        nome: selecao.nome,
        sigla: selecao.sigla,
        grupo: grupo.letra, // Pegando a letra do grupo (ex: "A")
        bandeira: selecao.bandeira,
      },
    });
  }
  console.log(`Seleções do Grupo ${grupo.letra} inseridas!`);
}

async function inserirPartidas(grupo) {
  for (const partida of grupo.partidas) {
    // 1. Busca os registros das seleções no banco usando a sigla única
    const mandanteDb = await prisma.selecao.findUnique({
      where: { sigla: partida.mandante }
    });

    const visitanteDb = await prisma.selecao.findUnique({
      where: { sigla: partida.visitante }
    });

    // Segurança: se por acaso não achar alguma seleção, avisa e pula para a próxima
    if (!mandanteDb || !visitanteDb) {
      console.error(`Erro: Seleção ${partida.mandante} ou ${partida.visitante} não encontrada.`);
      continue;
    }

    // 2. Cria a partida utilizando os IDs numéricos encontrados
    await prisma.partida.create({
      data: {
        mandanteId: mandanteDb.id,
        visitanteId: visitanteDb.id,
        golsMandante: partida.golsMandante || 0,
        golsVisitante: partida.golsVisitante || 0,
        fase: partida.fase || "Fase de Grupos",
        rodada: partida.rodada,
        realizada: partida.realizada || false,
      },
    });
  }
  console.log(`Partidas do Grupo ${grupo.letra} inseridas com sucesso!`);
}

async function main() {
  console.log("Limpando banco...");
  await limparBanco();

  console.log("Inserindo dados...");
  for (const grupo of dadosCopa.grupos) {
    await inserirSelecoes(grupo);
    await inserirPartidas(grupo);
  }

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });