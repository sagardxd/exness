export const logger = (funcName: string, des: string, error: unknown= null) => {
    console.error(`Func: ${funcName} | Des: ${des} | Error: ${error}`)
}