# Reflections — TD5 Dashboard design: three roles, three KPIs, one network

All figures come from my own run of `scripts/compute_kpis.py` on `data/cities.csv`
(identical to the manual's reference output, as expected for deterministic data).

## 1. Before building — who will disagree most?

My prediction: the **operations / cost manager**. The CSR manager and the network
planner both benefit from shorter routes (less CO₂, better coverage), so they will
probably both push for a new warehouse; the operations manager is the one who pays
for a fourth site (lease, staff, stock held in one more place), so I expect him to
prefer changing nothing and optimising the routes he already has.

## 2. Which assumption would I least like to defend to a client?

The **cost figures** (0.12 €/tonne-km, 40 €/tonne/year). The CO₂ factor has a real,
government-published range behind it (0.047 in the French Ministry of Ecology guide up
to ~0.12 with ADEME methodology), so I can say where 0.10 sits and show the effect of
the range — the CO₂ dashboard does exactly that (2,931 to 7,484 t a year instead of
6,236 t). The population proxy is crude but openly stated and at least proportional
to something real. The cost constants have no source at all: if a client asks "where
does 40 € per tonne come from?", the only honest answer is "nowhere".

## 3. Two KPIs pointing to different actions for the same warehouse

**Lille.** In the CO₂ and cost views of the current network, Lille contributes
**0 kg of CO₂ and 0 € of transport** — every other city is closer to Paris or Lyon, so
it only serves its own market (11,655 t a year). A CO₂ or cost manager reading those
views would see an idle site and could propose to close it. The network KPI says the
opposite: closing Lille raises the population-weighted average distance from **168.0
to 174.4 km**, and — through the same tonne-km — adds **237 t of CO₂ and 0.28 M€ of
transport a year**, because Lille's own 233,098 residents must then be served from
Paris, 204 km away. The per-warehouse views count routes *from* a warehouse; they
cannot see the distance a warehouse saves its own local market.

## 4. Would I recommend the #1 CO₂ route as-is?

The #1 route is **Lyon → Marseille: 1,212 t of CO₂ a year, 19 % of the whole
network**. I would double-check it before recommending consolidation, for three
reasons. First, Marseille is itself a candidate warehouse: if the network planner opens
it, this route disappears entirely and Marseille is served on site, so investing in
consolidating it now could be wasted. Second, it is large because Marseille is the
second biggest city (43,654 t of estimated demand), not because the route is badly
run — the demand comes from the population proxy, not real shipments. Third, it runs
along the Rhône valley, one of the few corridors with real rail-freight capacity, so
the right action is probably a rail shift rather than truck consolidation — and the
278 km straight line underestimates the real road distance.

## 5. Which lever for the highest-cost warehouse?

The highest-cost warehouse is **Lyon: €13.48 M a year, 60 % of the network**, split
€5.69 M transport and €7.79 M storage. Storage is the bigger segment (58 %), but the
per-tonne view shows why that is not the lever: storage is **€40 per tonne at every
warehouse** — it only grows with the tonnes handled, so it can only be reduced by
holding less stock, which is the same problem everywhere. What makes Lyon specifically
expensive is **transport: €29.2 per tonne against €10.9 at Paris**, because its
average haul is 243 km against 91 km (it serves 12 cities, from Strasbourg to
Bordeaux). I would pull the transport lever first — and the network dashboard shows
the most effective way: opening Marseille cuts network transport by €2.36 M a year.

## 6. My recommendation, the caveat, and Reflection 1 checked

**Open Marseille.** It is best on every KPI: average distance **115.0 km instead of
168.0 (−32 %)**, **−1,967 t of CO₂ a year** and **−€2.36 M of transport a year**.
Bordeaux is second (139.9 km) and is the only option that shortens the worst route
(Bordeaux itself, 436 → 382 km), but it saves less. **Do not close Lille**: it is
worse on every KPI (+6.4 km, +237 t, +€0.28 M).

The caveat does not change the direction, but it changes what I would claim. The
model has no fixed cost for a fourth site, so "Marseille saves €2.36 M a year" is a
gross saving: the real question is whether running the Marseille site (lease, staff,
duplicated stock) costs less than that. I would make the same call and present it as
"Marseille is the option worth a capex study, and it pays for itself only if its
annual running cost is below about €2.4 M".

**Reflection 1:** I was wrong. Under these assumptions **nobody disagrees** — the
three managers rank the four options identically, because CO₂ and transport cost are
both proportional to tonne-kilometres and storage cost does not depend on the network
at all. The operations manager disagreeing is real in practice, but only because of
the costs the model leaves out (fixed cost of a fourth site, extra safety stock). So
the disagreement I expected is not in the data; it is in the caveat — which is a good
argument for keeping the caveat on the page.

## 7. My fourth chart — "Who gains, who loses" (network dashboard)

**Question it answers:** the scenario bars give one average per option, and the maps
show which cities change colour, but neither says *who* an option is for and *by how
much*. The planner needs that to explain a decision to the cities concerned. For
Marseille: 5 cities get closer and none further — Marseille −278 km, Toulon −257 km,
Nice −139 km, Montpellier −126 km, Toulouse −41 km, about 394 million resident-km
saved. For closing Lille, a single city moves, Lille itself, +204 km.

**Why a dumbbell chart:** each affected city has two values to compare, its distance
today and under the option, on the same scale. A dumbbell shows both points and the
gap between them on one line, so the reader sees the starting point *and* the change.
A bar of differences would lose the starting point (−41 km means little if you do not
know it is 360 → 319 km); a grouped bar would double the number of bars and make the
change harder to read; the map already shows *who* changes but not *by how much*.
Cities are sorted by residents × kilometres at stake, so the most important change is
read first, and the filled dot uses the new warehouse's colour, consistent with the
maps above.
