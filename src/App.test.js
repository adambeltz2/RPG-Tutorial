import { describe, expect, it } from 'vitest'
import { isValidNodeId } from './App.jsx'
import introScenario from './data/scenarios/intro.json'

describe('isValidNodeId', () => {
  it('accepts every real node id in the intro scenario', () => {
    for (const nodeId of Object.keys(introScenario.nodes)) {
      expect(isValidNodeId(nodeId)).toBe(true)
    }
  })

  it('rejects a node id that does not exist in the current scenario', () => {
    expect(isValidNodeId('some_removed_or_renamed_node')).toBe(false)
  })

  it('rejects non-string / missing values without throwing', () => {
    expect(isValidNodeId(undefined)).toBe(false)
    expect(isValidNodeId(null)).toBe(false)
    expect(isValidNodeId(42)).toBe(false)
  })
})
