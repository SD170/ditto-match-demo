# Future Us Design Notes

## Stitch MCP setup

Configured Hermes native MCP with Stitch HTTP server in `~/.hermes/config.yaml`.

Server:
- name: `stitch`
- url: `https://stitch.googleapis.com/mcp`

Note: Hermes MCP tools are registered on agent startup, so this current session used a direct MCP client script to call Stitch immediately. After restarting Hermes, the Stitch tools should appear as native tools with names like `mcp_stitch_list_projects`, `mcp_stitch_generate_screen_from_text`, etc.

## Existing Stitch project used

Project:
- `projects/9138456706527534014`
- Title: `Modern Landing Page Design`

Existing screens inspected:
- `Ditto Inspired Landing Page`
- `Your Top Matches`
- `You Found Your Match`

## Generated Future Us screens

Generated four new screens in the existing Stitch project:

1. Future Us Entry Modal
   - Stitch screen: `projects/9138456706527534014/screens/32cfd062b0e94ba0a0d3ed0b8fc1b143`
   - Local screenshot: `docs/design-assets/future-us-entry-modal.png`
   - Local HTML: `docs/design-assets/future-us-entry-modal.html`

2. Future Us Simulation Dashboard
   - Stitch screen: `projects/9138456706527534014/screens/49203afc3dc1479e870df438e858cf59`
   - Local screenshot: `docs/design-assets/future-us-simulation-dashboard.png`
   - Local HTML: `docs/design-assets/future-us-simulation-dashboard.html`

3. Future Us Scenario Simulator
   - Stitch screen: `projects/9138456706527534014/screens/85d757fca8264fc1a5a7ad8b6a0ade85`
   - Local screenshot: `docs/design-assets/future-us-scenario-simulator.png`
   - Local HTML: `docs/design-assets/future-us-scenario-simulator.html`

4. Best Date Compiler: Your Compiled Plan
   - Stitch screen: `projects/9138456706527534014/screens/27430257eb534a2caa63b02a88a4eeed`
   - Local screenshot: `docs/design-assets/future-us-best-date-compiler.png`
   - Local HTML: `docs/design-assets/future-us-best-date-compiler.html`

Metadata file:
- `docs/future-us-stitch-screens.json`

Prompt archive:
- `docs/future-us-stitch-prompts.md`

## Visual QA summary

### Screen 1: Entry Modal
Strong match. Has paired avatars, private simulation pill, 82% confidence, connected signal chips, and clear “Run Future Us” CTA.

Potential issue:
- Some footer microcopy is small.

### Screen 2: Simulation Dashboard
Strong overall direction. Feels like a futuristic relationship mission-control screen with context confidence, signal cards, chemistry bars, and scenarios.

Potential issues:
- Some generated nav labels are slightly generic/awkward.
- Small text needs readability pass.
- It may need to be simplified when translated into React so it does not feel too enterprise.

### Screen 3: Scenario Simulator
Very good match. The “Natural Overlap” concept came through clearly: North Quad, Wednesday 7-8 PM, low-friction date conversion, evidence chips, best move, and why-it-matters panel.

Potential issues:
- It leans dashboard/coaching; implementation should add a little more Ditto warmth/personality.

### Screen 4: Best Date Compiler
Strong feature screen. The date plan feels concrete and very Ditto-aligned: time, location, plan, reasons, watchouts, repair moves, and invite CTA.

Potential issues:
- Needs stronger “Future Us” branding in final implementation.
- Add explicit connected-data/consent note near the top, not only footer.

## Recommended implementation synthesis

Use these generated designs as inspiration, but implement a slightly more cohesive in-app flow:

1. Extend current match modal with a `Preview Future Us` CTA.
2. Open `FutureUsModal` or `/future-us` route.
3. First panel: connected signal cards + confidence meter.
4. Main panel: couple thesis + chemistry map.
5. Scenario section: Natural Overlap, First Misread, Repair Moment, Growth Arc.
6. Best Date Compiler section: concrete Wednesday plan and “Send Wednesday Invite” CTA.

Keep final UI closer to current repo visual language:
- charcoal / black surfaces
- `#F748B1` primary
- cyan accents used sparingly
- big editorial headline typography
- rounded glass cards
- fewer enterprise sidebars; more romantic product story
