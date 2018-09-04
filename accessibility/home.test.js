import { analyzeAccessibility } from './accessibility'

describe('Home page', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1280, height: 1024 })
  })

  it('should not have accessibility issues', async () => {
    // We don't put this line in the beforeAll handler as our performance tests will need further configuration
    await page.goto('http://localhost:5000', { waitUntil: 'load' })
    const accessibilityReport = await analyzeAccessibility(
      page,
      `home.accessibility.png`
    )

    expect(accessibilityReport).toHaveNoAccessibilityIssues()
  })
})
