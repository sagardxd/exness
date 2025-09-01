export const logger = (funcName: string, detail: string, error: any) => {
    console.error(`Func: ${funcName} | detail: ${detail} | error: ${error}`);
}