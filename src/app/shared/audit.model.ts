//Action ref ID will be based on the action, i.e. task related action = task ID, list related, list ID etc...
export class Audit{
  constructor(public username: string, public ref: number, public entry: string, public createdAt: Date){

  }
}
