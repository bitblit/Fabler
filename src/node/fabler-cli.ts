import { Fabler } from '../core/fabler.js'; // version 2
import { NodeCliFablerUserAdapter } from './node-cli-fabler-user-adapter.js'; // version 2

if (typeof process !== 'undefined') {
  async function runGame(): Promise<any> {
    const fs = await import(/* webpackIgnore: true*/ 'fs');
    if (!process || !process.argv || process.argv.length < 3) {
      console.log('Usage: Example {story-filename} (was : ' + JSON.stringify(process?.argv) + ')');
    } else {
      if (fs.existsSync(process.argv[2])) {
        const story: Buffer = fs.readFileSync(process.argv[2]);
        console.log('Starting ' + process.argv[2] + ' ' + story.length + ' bytes');
        const game: Fabler = new Fabler(story, new NodeCliFablerUserAdapter());
        console.log(game.describeFile());

        let next: any = await game.run();
        while (!!next) {
          next = await game.run();
        }

        return next;
      } else {
        console.log('Could not find file : ' + process.argv[2]);
      }
    }
  }

  if (process?.argv?.length && process.argv.map((s) => s.indexOf('fabler-cli')).find((s) => s > -1)) {
    runGame()
      .then((out) => {
        console.log('Finished', out);
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error:' + err);
        process.exit(-1);
      });
  } else {
    console.log('MISSING:' + JSON.stringify(process?.argv));
  }
} else {
  console.log('Skipping - not in node');
}
