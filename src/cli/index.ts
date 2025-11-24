
import promptSync from "prompt-sync";
import { Biblioteca } from "../services/Biblioteca";

const prompt = promptSync({ sigint: true });
const bib = new Biblioteca();

function inputInt(msg: string): number {
  const s = prompt(msg);
  const n = Number(s);
  if (Number.isNaN(n)) return inputInt(msg);
  return Math.floor(n);
}

function pause() { prompt("Pressione ENTER para continuar..."); }

function menuPrincipal() {
  console.clear();
  console.log("=== SISTEMA DE BIBLIOTECA ===");
  console.log("1 - Cadastro de Livros");
  console.log("2 - Cadastro de Membros");
  console.log("3 - Empréstimos");
  console.log("0 - Sair");
  const opc = prompt("Escolha: ");
  switch (opc) {
    case "1": menuLivros(); break;
    case "2": menuMembros(); break;
    case "3": menuEmprestimos(); break;
    case "0": console.log('Saindo...'); process.exit(0);
    default: console.log("Opção inválida"); pause(); menuPrincipal();
  }
}

function menuLivros() {
  console.clear();
  console.log("=== LIVROS ===");
  console.log("1 - Listar Livros");
  console.log("2 - Adicionar Livro");
  console.log("3 - Atualizar Livro");
  console.log("4 - Remover Livro");
  console.log("0 - Voltar");
  const opc = prompt("Escolha: ");
  switch (opc) {
    case "1":
      const livros = bib.listarLivros();
      if (!livros.length) console.log("Nenhum livro cadastrado.");
      livros.forEach(l => console.log(`${l.id} | ${l.titulo} | ${l.autor} | ISBN:${l.isbn} | Ano:${l.ano}`));
      pause(); menuLivros(); break;
    case "2":
      const titulo = prompt("Título: ");
      const autor = prompt("Autor: ");
      const isbn = prompt("ISBN: ");
      const ano = inputInt("Ano: ");
      const novo = bib.adicionarLivro(titulo, autor, isbn, ano);
      console.log(`Livro criado com ID ${novo.id}`);
      pause(); menuLivros(); break;
    case "3":
      const idAtt = inputInt("ID do livro: ");
      const l = bib.buscarLivroPorId(idAtt);
      if (!l) { console.log("Livro não encontrado."); pause(); menuLivros(); break; }
      const tituloN = prompt(`Título [${l.titulo}]: `) || l.titulo;
      const autorN = prompt(`Autor [${l.autor}]: `) || l.autor;
      const isbnN = prompt(`ISBN [${l.isbn}]: `) || l.isbn;
      const anoStr = prompt(`Ano [${l.ano}]: `) || String(l.ano);
      bib.atualizarLivro(idAtt, { titulo: tituloN, autor: autorN, isbn: isbnN, ano: Number(anoStr) });
      console.log("Livro atualizado.");
      pause(); menuLivros(); break;
    case "4":
      const idDel = inputInt("ID do livro a remover: ");
      try { const ok = bib.removerLivro(idDel); console.log(ok ? "Removido." : "Livro não encontrado."); } catch(e) { console.log("Erro:", (e as Error).message); }
      pause(); menuLivros(); break;
    case "0": menuPrincipal(); break;
    default: console.log("Inválido"); pause(); menuLivros();
  }
}

function menuMembros() {
  console.clear();
  console.log("=== MEMBROS ===");
  console.log("1 - Listar Membros");
  console.log("2 - Adicionar Membro");
  console.log("3 - Atualizar Membro");
  console.log("4 - Remover Membro");
  console.log("0 - Voltar");
  const opc = prompt("Escolha: ");
  switch (opc) {
    case "1":
      const membros = bib.listarMembros();
      if (!membros.length) console.log("Nenhum membro cadastrado.");
      membros.forEach(m => console.log(`${m.getMatricula()} | ${m.getNome()} | ${m.getTelefone()} | ${m.getEndereco()}`));
      pause(); menuMembros(); break;
    case "2":
      const nome = prompt("Nome: ");
      const endereco = prompt("Endereço: ");
      const telefone = prompt("Telefone: ");
      const novo = bib.adicionarMembro(nome, endereco, telefone);
      console.log(`Membro criado com matrícula ${novo.getMatricula()}`);
      pause(); menuMembros(); break;
    case "3":
      const matAtt = inputInt("Matrícula do membro: ");
      const mm = bib.buscarMembro(matAtt);
      if (!mm) { console.log("Membro não encontrado."); pause(); menuMembros(); break; }
      const nomeN = prompt(`Nome [${mm.getNome()}]: `) || mm.getNome();
      const endN = prompt(`Endereço [${mm.getEndereco()}]: `) || mm.getEndereco();
      const telN = prompt(`Telefone [${mm.getTelefone()}]: `) || mm.getTelefone();
      bib.atualizarMembro(matAtt, { nome: nomeN, endereco: endN, telefone: telN });
      console.log("Membro atualizado.");
      pause(); menuMembros(); break;
    case "4":
      const matDel = inputInt("Matrícula a remover: ");
      try { const ok = bib.removerMembro(matDel); console.log(ok ? "Removido." : "Membro não encontrado."); } catch(e) { console.log("Erro:", (e as Error).message); }
      pause(); menuMembros(); break;
    case "0": menuPrincipal(); break;
    default: console.log("Inválido"); pause(); menuMembros();
  }
}

function menuEmprestimos() {
  console.clear();
  console.log("=== EMPRÉSTIMOS ===");
  console.log("1 - Realizar empréstimo");
  console.log("2 - Listar empréstimos ativos");
  console.log("3 - Registrar devolução");
  console.log("4 - Histórico de empréstimos");
  console.log("0 - Voltar");
  const opc = prompt("Escolha: ");
  switch (opc) {
    case "1":
      const livroId = inputInt("ID do Livro: ");
      const matricula = inputInt("Matrícula do Membro: ");
      const prazo = inputInt("Prazo em dias (padrão 14): ");
      try {
        const e = bib.realizarEmprestimo(livroId, matricula, prazo || 14);
        console.log(`Empréstimo realizado. ID: ${e.id}`);
      } catch (err) {
        console.log("Erro:", (err as Error).message);
      }
      pause(); menuEmprestimos(); break;
    case "2":
      const ativos = bib.listarEmprestimosAtivos();
      if (!ativos.length) console.log("Nenhum empréstimo ativo.");
      ativos.forEach(a => console.log(`${a.id} | Livro:${a.livroId} | Membro:${a.membroMatricula} | Emp:${a.dataEmprestimo} | Prev:${a.dataDevolucaoPrevista}`));
      pause(); menuEmprestimos(); break;
    case "3":
      const idE = inputInt("ID do empréstimo para devolução: ");
      const ok = bib.registrarDevolucao(idE);
      console.log(ok ? "Devolução registrada." : "Empréstimo não encontrado ou já devolvido.");
      pause(); menuEmprestimos(); break;
    case "4":
      const hist = bib.historicoEmprestimos();
      if (!hist.length) console.log("Nenhum registro.");
      hist.forEach(h => console.log(`${h.id} | L:${h.livroId} | M:${h.membroMatricula} | Emp:${h.dataEmprestimo} | Real:${h.dataDevolucaoReal || 'Pendente'} | ${h.devolvido ? 'Devolvido' : 'Ativo'}`));
      pause(); menuEmprestimos(); break;
    case "0": menuPrincipal(); break;
    default: console.log("Inválido"); pause(); menuEmprestimos();
  }
}

// Start
menuPrincipal();
