import { FablerUserAdapter } from '../core/fabler-user-adapter.js';

export class NodeCliFablerUserAdapter implements FablerUserAdapter {
  private statusLine: string = '';
  private history: string[] = [];
  private cacheRl: any;
  private cacheFs: any;

  constructor(public isTandy: boolean = false) {}

  // Block on being on node...
  private async rl(): Promise<any> {
    if (!!process && !this.cacheRl) {
      const rlLib: any = await import(/* webpackIgnore: true*/ 'readline');
      this.cacheRl = rlLib.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });
    }
    return this.cacheRl;
  }

  // Block on being on node...
  private async fs(): Promise<any> {
    if (!!process && !this.cacheFs) {
      this.cacheFs = await import(/* webpackIgnore: true*/ 'fs');
    }
    return this.cacheFs;
  }

  private async question(prompt: string): Promise<string> {
    const rl: any = await this.rl();
    return new Promise<string>((res, rej) => {
      rl.question(prompt, (answer) => {
        res(answer);
      });
    });
  }

  public async print(text: string, scripting: boolean): Promise<void> {
    // If scripting, save it here
    process.stdout.write(text);
  }

  public async read(maxlen: number): Promise<string> {
    let value: string = await this.question('');
    if (value.length > maxlen) {
      value = value.substring(0, maxlen);
    }
    //value +='y';
    if (value === 'XX-DUMP') {
      console.log('History : ' + JSON.stringify(this.history));
      return this.read(maxlen);
    } else {
      this.history.push(value);
      return value;
    }
  }

  public async save(buffer: Uint8Array): Promise<boolean> {
    process.stdout.write('Save?');
    const name: string = await this.question('');
    if (!!name) {
      const fs: any = await this.fs();
      fs.writeFileSync(name, buffer);
      return true;
    } else {
      return false;
    }
  }

  public async restore(): Promise<Uint8Array> {
    process.stdout.write('Restore?');
    const name: string = await this.question('');
    if (!!name) {
      const fs: any = await this.fs();
      const buf: Buffer = fs.readFileSync(name);
      return buf;
    } else {
      return null;
    }
  }

  public async restarted(): Promise<any> {
    process.stdout.write('Restarted.');
  }

  public async highlight(fixpitch: boolean): Promise<any> {
    //console.log('Highlight is not implemented (Fixpitch was '+fixpitch+')');
  }

  public async screen(window: number): Promise<any> {
    //console.log('Screen is not implemented (window was '+window+')');
  }

  public async split(height: number): Promise<any> {
    //console.log('Split is not implemented (height was '+height+')');
  }

  public async updateStatusLine(text: string, v18: number, v17: number): Promise<any> {
    this.statusLine = text;
    //console.log(`UpdateStatusLine is not implemented (text was ${text} : v18: ${v18} v17: ${v17}`);
  }
}
