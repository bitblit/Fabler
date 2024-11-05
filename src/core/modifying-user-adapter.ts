import { FablerUserAdapter } from "./fabler-user-adapter.js";
import { FablerModifier } from "./fabler-modifier.js";

export class ModifyingUserAdapter implements FablerUserAdapter {

  private outputBuffer: string = '';

  constructor(private delegate: FablerUserAdapter, private modifier: FablerModifier) {}

  public async print(text: string, _scripting: boolean): Promise<void> {
    this.outputBuffer += text;
    /*
    if (StringRatchet.stringContainsOnlyWhitespace(text)) {
      return this.delegate.print(text,scripting);
    } else {
      const output: string = await this.modifier.modifyOutput(text);
      return this.delegate.print(output, scripting);
    }
     */
  }

  public async read(maxlen: number): Promise<string> {
    // Modify and dump the buffer
    if (this.outputBuffer.length>0) {
      const mod: string = await this.modifier.modifyOutput(this.outputBuffer);
      await this.delegate.print(mod, false);
      this.outputBuffer = '';
    }

    const input: string = await this.delegate.read(maxlen);
    const rval: string = await this.modifier.modifyInput(input);
    return rval;
  }

  public async save(buffer: Uint8Array): Promise<boolean> {
    return this.delegate.save(buffer);
  }

  public async restore(): Promise<Uint8Array> {
    return this.delegate.restore();
  }

  public async restarted(): Promise<any> {
    return this.delegate.restarted();
  }

  public async highlight(fixpitch: boolean): Promise<any> {
    return this.delegate.highlight(fixpitch);
  }

  public async screen(window: number): Promise<any> {
    return this.delegate.screen(window);
  }

  public async split(height: number): Promise<any> {
    return this.delegate.split(height);
  }

  public async updateStatusLine(text: string, v18: number, v17: number): Promise<any> {
    return this.delegate.updateStatusLine(text, v18, v17);
  }
}