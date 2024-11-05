import { FablerUserAdapter } from '../core/fabler-user-adapter.js';
import { BrowserFablerUserAdapterOptions } from './browser-fabler-user-adapter-options.js';

export class BrowserSpeechFablerUserAdapter implements FablerUserAdapter {
  private currentEntry: string = null;
  private speakers: SpeechSynthesisUtterance[] = [];

  private SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'];
  private SpeechGrammarList = window['SpeechGrammarList'] || window['webkitSpeechGrammarList'];
  private SpeechRecognitionEvent = window['SpeechRecognitionEvent'] || window['webkitSpeechRecognitionEvent'];
  recognition = new this.SpeechRecognition();

  constructor(public opts: BrowserFablerUserAdapterOptions) {
    if (!opts?.inputId?.trim().length || !opts?.statusLineId?.trim().length || !opts.textId?.trim().length) {
      throw new Error('Invalid opts : ' + JSON.stringify(opts));
    }
    if (!document.getElementById(opts.inputId)) {
      throw new Error('No such inputId: ' + opts.inputId);
    }
    if (!document.getElementById(opts.statusLineId)) {
      throw new Error('No such statusLineId: ' + opts.statusLineId);
    }
    if (!document.getElementById(opts.textId)) {
      throw new Error('No such textId: ' + opts.textId);
    }

    const el: HTMLInputElement = document.getElementById(opts.inputId) as HTMLInputElement;
    el.addEventListener('keyup', (evt) => {
      if (evt.key === 'Enter') {
        this.currentEntry = el.value;
        el.value = '';
      } else {
        console.log('x');
      }
    });

    const directions = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'up', 'down', 'in', 'out'];
    const grammar = `#JSGF V1.0; grammar directions; public <direction> = ${directions.join(' | ')};`;
    const speechRecognitionList = new this.SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    this.recognition.grammars = speechRecognitionList;
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    console.log('Starting speech recognition');
    this.recognition.start();

    const diagnostic: HTMLTextAreaElement = document.getElementById('diagnostic') as HTMLTextAreaElement;
    this.recognition.onresult = (event) => {
      const value = event.results[0][0].transcript;
      diagnostic.textContent = `Result received: ${value}.`;
      this.currentEntry = value;
      console.log(`Confidence: ${event.results[0][0].confidence}`);
    };
    this.recognition.onerror = (event) => {
      console.log('Error:' + event, event);
    };
    this.recognition.onnomatch = (event) => {
      console.log('No Match:' + event, event);
    };
  }

  private addTextToOutput(text: string): void {
    const el: HTMLTextAreaElement = document.getElementById(this.opts.textId) as HTMLTextAreaElement;
    el.value += text;
    el.scrollTop = el.scrollHeight;
  }

  public async print(text: string, scripting: boolean): Promise<void> {
    this.addTextToOutput(text);
    const out = new SpeechSynthesisUtterance(text);
    //out.voice = new SpeechSynthesisVoice()c
    const synth = window.speechSynthesis;
    console.log('Pausing listen');
    this.recognition.stop();
    this.speakers.push(out);
    out.onend = (evt) => {
      console.log('got onend from output');
      this.speakers.splice(this.speakers.indexOf(out), 1);
      if (this.speakers.length === 0) {
        console.log('Listening');
        this.recognition.start();
      } else {
        console.log('Not listening, still ' + this.speakers.length);
      }
    };
    out.onerror = (evt) => {
      console.error('Speech synth error : '+evt, evt);
    }
    console.log('Pushing '+text.length+' chars to synth');
    synth.speak(out);
  }

  public wait(timeoutMS: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        resolve(null);
      }, timeoutMS);
    });
  }

  public async read(maxlen: number): Promise<string> {
    while (!this.currentEntry) {
      await this.wait(200);
    }
    const tmp: string = this.currentEntry;
    this.currentEntry = null;
    this.addTextToOutput(tmp + '\n');
    return tmp;
  }

  public async save(buffer: Uint8Array): Promise<boolean> {
    const encoded: string = new TextDecoder().decode(buffer);
    alert('Save: ' + encoded);
    return true;
  }

  public async restore(): Promise<Uint8Array> {
    const data: string = window.prompt('Data?');
    const decoded: Uint8Array = data?.length ? new TextEncoder().encode(data) : null;
    return decoded;
  }

  public async restarted(): Promise<any> {
    console.log('Restarted.');
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
    const el: HTMLElement = document.getElementById(this.opts.statusLineId);
    el.innerHTML = text;
  }
}
