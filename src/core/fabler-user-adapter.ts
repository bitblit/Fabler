/**
 *
 *   .highlight(fixpitch) = A generator function you define, which will be
 *   called to update the highlighting mode, which is fixpitch (if the
 *   argument is true) or normal (if argument is false). (You don't have to
 *   set it if you aren't implementing variable pitch by default.)
 *
 *   .isTandy = A boolean, normally false. Set it to true to tell the game
 *   that it is a Tandy computer; this affects some games.
 *
 *   .print(text,scripting) = A generator function that you must define, and
 *   will be called to print text. You must implement wrapping and buffering
 *   and scripting yourself. The second argument is true if it should be
 *   copied to the transcript or false if it should not be.
 *
 *   .read(maxlen) = A generator function which you must define yourself, and
 *   which should return a string containing the player's input. Called when
 *   a READ instruction is executed; the argument is the maximum number of
 *   characters that are allowed (if you return a longer string, it will be
 *   truncated).
 *
 *   .restarted() = A generator function you can optionally define. When the
 *   game starts or if restarted (with the RESTART instruction), it will be
 *   called after memory is initialized but before executing any more.
 *
 *   .restore() = A generator function you can define yourself, which is
 *   called when restoring a saved game. Return a Uint8Array with the same
 *   contents passed to save() if successful, or you can return false or null
 *   or undefined if it failed.
 *
 *   .save(buf) = A generator function you can define yourself, and is called
 *   when saving the game. The argument is a Uint8Array, and you should
 *   attempt to save its contents somewhere, and then return true if
 *   successful or false if it failed.
 *
 *   .screen(window) = Normally null. You can set it to a generator function
 *   which will be called when the SCREEN opcode is executed if you want to
 *   implement split screen.
 *
 *   .split(height) = Normally null. You can set it to a generator function
 *   which will be called when the SPLIT opcode is executed if you want to
 *   implement split screen.
 *
 *   .statusType = False for score/moves and true for hours/minutes. Use this
 *   to determine the meaning of arguments to updateStatusLine.
 *
 *   .updateStatusLine(text,v18,v17) = Normally null, but can be a generator
 *   function if you are implementing the status line. It is called when a
 *   READ or USL instruction is executed. See statusType for the meaning of
 *   v18 and v17. Return value is unused.
 */

export interface FablerUserAdapter {
  print(text:string,scripting:boolean) :Promise<void>;
  read(maxlen:number):Promise<string>;
  save(buffer: Uint8Array):Promise<boolean>;
  restarted():Promise<void>;
  restore():Promise<Uint8Array>;
  highlight?(fixpitch: boolean):Promise<void>;
  screen?(window:number):Promise<any>;
  split?(height:number):Promise<any>;
  isTandy?:boolean;
  updateStatusLine?(text:string,v18:number,v17:number):Promise<void>;
}