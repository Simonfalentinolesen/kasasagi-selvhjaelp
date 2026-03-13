export function simulateDelay(min = 300, max = 800): Promise<void> {
  const ms = Math.random() * (max - min) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}
