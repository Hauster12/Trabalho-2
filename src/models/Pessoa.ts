
export abstract class Pessoa {
  protected nome: string;
  protected endereco: string;
  protected telefone: string;

  constructor(nome: string, endereco = "", telefone = "") {
    this.nome = nome;
    this.endereco = endereco;
    this.telefone = telefone;
  }

  public getNome(): string { return this.nome; }
  public getEndereco(): string { return this.endereco; }
  public getTelefone(): string { return this.telefone; }

  public setNome(v: string) { this.nome = v; }
  public setEndereco(v: string) { this.endereco = v; }
  public setTelefone(v: string) { this.telefone = v; }

  public contato(): string {
    return `${this.nome} - ${this.telefone} - ${this.endereco}`;
  }
}
