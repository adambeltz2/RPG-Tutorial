export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1
}

export function rollDice(count, sides) {
  return Array.from({ length: count }, () => rollDie(sides))
}

export function rollStartingGold() {
  const [a, b] = rollDice(2, 6)
  return (a + b) * 10
}
