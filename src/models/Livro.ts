
export class Livro {
  constructor(
    public id: number,
    public titulo: string,
    public autor: string,
    public isbn: string,
    public ano: number
  ) {}

  public toJSON() {
    return { id: this.id, titulo: this.titulo, autor: this.autor, isbn: this.isbn, ano: this.ano };
  }

  public static fromJSON(obj: any): Livro {
    return new Livro(Number(obj.id), obj.titulo, obj.autor, obj.isbn, Number(obj.ano));
  }
}
