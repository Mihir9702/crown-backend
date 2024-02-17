import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  Config,
} from 'unique-names-generator'

export function generateNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomNumber(length: number): number {
  const nums: number[] = []

  for (let i = 0; i < length; i++) {
    nums.push(generateNumber(0, 9))
  }

  return parseInt(nums.join(''))
}

export function randomName(): string {
  const config: Config = {
    dictionaries: [adjectives, colors],
    length: 2,
  }

  return uniqueNamesGenerator(config)
}

export function removeDuplicates(arr: number[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index)
}
