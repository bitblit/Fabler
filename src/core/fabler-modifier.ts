
export interface FablerModifier {
  modifyInput(userInput: string): Promise<string>
  modifyOutput(systemOutput: string): Promise<string>
}