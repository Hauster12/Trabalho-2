
export class Emprestimo {
  public devolvido: boolean = false;
  public dataDevolucaoReal?: string;

  constructor(
    public id: number,
    public livroId: number,
    public membroMatricula: number,
    public dataEmprestimo: string,
    public dataDevolucaoPrevista?: string
  ) {}

  public registrarDevolucao(dataReal: string) {
    this.devolvido = true;
    this.dataDevolucaoReal = dataReal;
  }

  public toJSON() {
    return {
      id: this.id,
      livroId: this.livroId,
      membroMatricula: this.membroMatricula,
      dataEmprestimo: this.dataEmprestimo,
      dataDevolucaoPrevista: this.dataDevolucaoPrevista,
      dataDevolucaoReal: this.dataDevolucaoReal,
      devolvido: this.devolvido
    };
  }

  public static fromJSON(obj: any): Emprestimo {
    const e = new Emprestimo(Number(obj.id), Number(obj.livroId), Number(obj.membroMatricula), obj.dataEmprestimo, obj.dataDevolucaoPrevista);
    if (obj.devolvido) {
      e.devolvido = true;
      e.dataDevolucaoReal = obj.dataDevolucaoReal;
    }
    return e;
  }
}
