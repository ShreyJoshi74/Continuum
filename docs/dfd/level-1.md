# Level 1 DFD — inside the client

Three independent inputs — user events, catalogue data, and density — converge on one store, from which the renderer derives a visible window. The focus engine and the rail renderer are coupled in exactly one place: focus movement produces a scroll intent, and scroll position feeds back as a new visible window. That loop is where every performance bug in this class of app lives.

```mermaid
flowchart TD
  IN[Input adapter<br/>key, pointer, touch] --> FOCUS[Focus engine]
  FOCUS -->|focus id| STORE[(UI store)]
  FOCUS -->|scroll intent| RAIL[Rail renderer]
  STORE --> RAIL
  DATA[Catalogue client<br/>fetch + cache] --> STORE
  RAIL -->|visible window| CARDS[Card pool]
  CARDS -->|load / release| IMG[Image lifecycle]
  TOKENS[Token layer<br/>density mode] --> CARDS
  TOKENS --> PLAYER[Player shell]
  STORE --> PLAYER
  PLAYER --> HLS[HLS adapter]
  RAIL --> PERF[Perf marks]
  FOCUS --> PERF
  PLAYER --> PERF
```

See [docs/BRD-TRD.md §8](../BRD-TRD.md) for the full architecture writeup.
