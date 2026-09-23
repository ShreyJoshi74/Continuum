# Level 0 DFD — context

The client talks to exactly three things: the BFF for structure, the CDN for media, and the RUM endpoint for telemetry. Nothing else crosses the boundary.

```mermaid
flowchart LR
  V[Viewer] -->|input events| APP[Continuum client]
  APP -->|catalogue request| BFF[Continuum BFF]
  BFF -->|metadata query| TMDB[(TMDB API)]
  BFF -->|rails payload| APP
  APP -->|manifest + segments| CDN[(HLS origin)]
  APP -->|vitals + marks| RUM[(RUM store)]
  APP -->|rendered UI| V
```

See [docs/BRD-TRD.md §8](../BRD-TRD.md) for the full architecture writeup.
