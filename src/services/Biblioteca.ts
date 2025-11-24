
import * as fs from "fs";
import * as path from "path";
import { Livro } from "../models/Livro";
import { Membro } from "../models/Membro";
import { Emprestimo } from "../models/Emprestimo";

function ensureFileSync(fp: string) {
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, "[]", "utf8");
}

export class Biblioteca {
  private livros: Livro[] = [];
  private membros: Membro[] = [];
  private emprestimos: Emprestimo[] = [];

  private dataDir = path.join(process.cwd(), "data");
  private livrosPath = path.join(this.dataDir, "livros.json");
  private membrosPath = path.join(this.dataDir, "membros.json");
  private emprestimosPath = path.join(this.dataDir, "emprestimos.json");

  constructor() {
    ensureFileSync(this.livrosPath);
    ensureFileSync(this.membrosPath);
    ensureFileSync(this.emprestimosPath);
    this.carregarDados();
  }

  private carregarDados() {
    try {
      const b = JSON.parse(fs.readFileSync(this.livrosPath, "utf8") || "[]");
      this.livros = b.map((x: any) => Livro.fromJSON(x));
    } catch (e) { this.livros = []; }

    try {
      const m = JSON.parse(fs.readFileSync(this.membrosPath, "utf8") || "[]");
      this.membros = m.map((x: any) => Membro.fromJSON(x));
    } catch (e) { this.membros = []; }

    try {
      const l = JSON.parse(fs.readFileSync(this.emprestimosPath, "utf8") || "[]");
      this.emprestimos = l.map((x: any) => Emprestimo.fromJSON(x));
    } catch (e) { this.emprestimos = []; }
  }

  private salvarDados() {
    fs.writeFileSync(this.livrosPath, JSON.stringify(this.livros.map(x => x.toJSON()), null, 2), "utf8");
    fs.writeFileSync(this.membrosPath, JSON.stringify(this.membros.map(x => x.toJSON ? x.toJSON() : x), null, 2), "utf8");
    fs.writeFileSync(this.emprestimosPath, JSON.stringify(this.emprestimos.map(x => x.toJSON()), null, 2), "utf8");
  }

  // ---------- Livros ----------
  private nextBookId(): number {
    return this.livros.length ? Math.max(...this.livros.map(l => l.id)) + 1 : 1;
  }

  public adicionarLivro(titulo: string, autor: string, isbn: string, ano: number): Livro {
    const novo = new Livro(this.nextBookId(), titulo, autor, isbn, ano);
    this.livros.push(novo);
    this.salvarDados();
    return novo;
  }

  public listarLivros(): Livro[] { return [...this.livros]; }

  public buscarLivroPorId(id: number): Livro | undefined {
    return this.livros.find(l => l.id === id);
  }

  public atualizarLivro(id: number, fields: Partial<{titulo:string;autor:string;isbn:string;ano:number}>): boolean {
    const l = this.buscarLivroPorId(id);
    if (!l) return false;
    if (fields.titulo) l.titulo = fields.titulo;
    if (fields.autor) l.autor = fields.autor;
    if (fields.isbn) l.isbn = fields.isbn;
    if (fields.ano) l.ano = fields.ano!;
    this.salvarDados();
    return true;
  }

  public removerLivro(id: number): boolean {
    const ativo = this.emprestimos.some(e => e.livroId === id && !e.devolvido);
    if (ativo) throw new Error("Não é possível remover livro com empréstimos ativos.");
    const before = this.livros.length;
    this.livros = this.livros.filter(l => l.id !== id);
    this.salvarDados();
    return this.livros.length < before;
  }

  // ---------- Membros ----------
  private nextMatricula(): number {
    return this.membros.length ? Math.max(...this.membros.map(m => m.getMatricula())) + 1 : 1;
  }

  public adicionarMembro(nome: string, endereco: string, telefone: string): Membro {
    const mat = this.nextMatricula();
    const novo = new Membro(nome, mat, endereco, telefone);
    this.membros.push(novo);
    this.salvarDados();
    return novo;
  }

  public listarMembros(): Membro[] { return [...this.membros]; }

  public buscarMembro(matricula: number): Membro | undefined {
    return this.membros.find(m => m.getMatricula() === matricula);
  }

  public atualizarMembro(matricula: number, fields: Partial<{nome:string;endereco:string;telefone:string}>): boolean {
    const m = this.buscarMembro(matricula);
    if (!m) return false;
    if (fields.nome) m.setNome(fields.nome);
    if (fields.endereco) m.setEndereco(fields.endereco);
    if (fields.telefone) m.setTelefone(fields.telefone);
    this.salvarDados();
    return true;
  }

  public removerMembro(matricula: number): boolean {
    const ativo = this.emprestimos.some(e => e.membroMatricula === matricula && !e.devolvido);
    if (ativo) throw new Error("Não é possível remover membro com empréstimos ativos.");
    const before = this.membros.length;
    this.membros = this.membros.filter(m => m.getMatricula() !== matricula);
    this.salvarDados();
    return this.membros.length < before;
  }

  // ---------- Empréstimos ----------
  private nextLoanId(): number {
    return this.emprestimos.length ? Math.max(...this.emprestimos.map(e => e.id)) + 1 : 1;
  }

  public realizarEmprestimo(livroId: number, membroMatricula: number, dias = 14): Emprestimo {
    const livro = this.buscarLivroPorId(livroId);
    if (!livro) throw new Error("Livro não encontrado");
    const membro = this.buscarMembro(membroMatricula);
    if (!membro) throw new Error("Membro não encontrado");
    const ocupado = this.emprestimos.some(e => e.livroId === livroId && !e.devolvido);
    if (ocupado) throw new Error("Livro já está emprestado no momento");
    const hoje = new Date();
    const prevista = new Date(hoje.getTime()); prevista.setDate(prevista.getDate() + dias);
    const emp = new Emprestimo(this.nextLoanId(), livroId, membroMatricula, hoje.toISOString(), prevista.toISOString());
    this.emprestimos.push(emp);
    this.salvarDados();
    return emp;
  }

  public listarEmprestimosAtivos(): Emprestimo[] {
    return this.emprestimos.filter(e => !e.devolvido);
  }

  public registrarDevolucao(emprestimoId: number): boolean {
    const e = this.emprestimos.find(x => x.id === emprestimoId);
    if (!e) return false;
    if (e.devolvido) return false;
    e.registrarDevolucao(new Date().toISOString());
    this.salvarDados();
    return true;
  }

  public historicoEmprestimos(): Emprestimo[] {
    return [...this.emprestimos];
  }
}
