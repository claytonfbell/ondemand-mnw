type PopuliApiRequest<T> = () => Promise<T>

export async function makePopuliApiRequest<T>(doRequest: PopuliApiRequest<T>) {
  let keepGoing = true
  let result = null
  while (keepGoing) {
    keepGoing = false
    try {
      result = await doRequest()
    } catch (err: any) {
      if (err?.response?.status === 429) {
        keepGoing = true
        console.log("Too many requests. Waiting 20 seconds")
        await new Promise((resolve) => setTimeout(resolve, 20000))
      }
      throw err
    }
  }
  return result
}
