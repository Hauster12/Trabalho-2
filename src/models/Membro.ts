
import { Pessoa } from "./Pessoa";

export class Membro extends Pessoa {
  private matricula: number;

  constructor(nome: string, matricula: number, endereco = "", telefone = "") {
    super(nome, endereco, telefone);
    this.matricula = matricula;
  }

  public getMatricula(): number { return this.matricula; }
  public setMatricula(v: number) { this.matricula = v; }

  public contato(): string {
    return `Membro ${this.matricula}: ${this.getNome()} | Tel: ${this.getTelefone()} | End: ${this.getEndereco()}`;
  }

  public toJSON() {
    return { nome: this.getNome(), endereco: this.getEndereco(), telefone: this.getTelefone(), matricula: this.matricula };
  }

  public static fromJSON(obj: any): Membro {
    return new Membro(obj.nome, Number(obj.matricula), obj.endereco ?? "", obj.telefone ?? "");
  }
}
