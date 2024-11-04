import {FablerUserAdapter} from "./fabler-user-adapter.js";
import { FablerInputModifier } from "./fabler-input-modifier";

export class InputModifyingUserAdapter implements FablerUserAdapter {

  constructor(private delegate: FablerUserAdapter, private modifier: FablerInputModifier) {
  }

  public async print(text:string,scripting:boolean):Promise<void> {
    return this.delegate.print(text, scripting);
  };

  public async read(maxlen:number):Promise<string> {
    const input: string = await this.delegate.read(maxlen);
    const rval: string = await this.modifier.modifyInput(input);
    return rval;
  };

  public async save(buffer: Uint8Array):Promise<boolean> {
    return this.delegate.save(buffer);
  };

  public async restore():Promise<Uint8Array> {
    return this.delegate.restore();
  }

  public async restarted():Promise<any> {
    return this.delegate.restarted();
  }

  public async highlight(fixpitch: boolean):Promise<any> {
    return this.delegate.highlight(fixpitch);
  }

  public async screen(window:number):Promise<any> {
    return this.delegate.screen(window);
  }

  public async split(height:number):Promise<any> {
    return this.delegate.split(height);
  }

  public async updateStatusLine(text:string,v18:number,v17:number):Promise<any> {
    return this.delegate.updateStatusLine(text, v18, v17);
  }
}
