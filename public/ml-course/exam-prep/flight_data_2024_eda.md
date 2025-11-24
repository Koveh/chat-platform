# Flight Data 2024 — Exploratory Analysis (Short)

## Snapshot
- **Rows**: 7,079,082  |  **Cols**: 31  |  **Period**: 2024-01-01 → 2024-12-31
- **Airlines**: 15  |  **Airports**: 334→334 (orig→dest)
- **Cancelled**: 4.80%  |  **Diverted**: 0.33%  |  **>15m late (arr)**: 25.9%

## Core metrics (sample)
- **Dep delay**: mean 19.86m, median -1.00m
- **Arr delay**: mean 15.56m, median -3.00m
- **Distance**: mean 844mi  |  **Air time**: mean 118m

## Top airlines (by flights)
| carrier | flights | avg_arr_delay_min |
| --- | --- | --- |
| WN | 64530 | 11.03 |
| AA | 42145 | 26.07 |
| DL | 39798 | 9.93 |
| UA | 32435 | 15.49 |
| OO | 30817 | 19.16 |
| NK | 11503 | 15.22 |
| MQ | 11401 | 19.02 |
| YX | 11138 | 3.44 d|
| B6 | 10963 | 21.96 |
| AS | 10045 | 13.00 |

## Top routes (by flights)
| route | flights | avg_arr_delay_min | avg_distance_mi |
| --- | --- | --- | --- |
| OGG→HNL | 552 | 10.16 | 100 |
| HNL→OGG | 548 | 6.60 | 100 |
| SFO→LAX | 461 | 0.35 | 337 |
| LAX→SFO | 460 | 6.21 | 337 |
| PHX→DEN | 439 | 5.35 | 602 |
| DEN→PHX | 439 | 12.21 | 602 |
| ATL→MCO | 438 | 13.38 | 404 |
| MCO→ATL | 436 | 21.83 | 404 |
| LAX→LAS | 435 | 8.23 | 236 |
| LAS→LAX | 434 | 6.56 | 236 |

## Busiest airports
- **Origins**: ATL (14177), DEN (13042), DFW (12926), ORD (11160), CLT (8867), PHX (8518), LAX (8389), LAS (8370), MCO (7951), SEA (6516)
- **Destinations**: ATL (14146), DEN (13038), DFW (12939), ORD (11170), CLT (8870), PHX (8507), LAX (8384), LAS (8372), MCO (7963), SEA (6522)

## Delay by hour (CRS dep hour → avg arrival delay, m)
| hour | avg_arr_delay_min |
| --- | --- |
| 00 | 9.58 |
| 01 | 15.98 |
| 02 | 7.07 |
| 03 | 5.41 |
| 04 | 13.80 |
| 05 | 8.95 |
| 06 | 6.54 |
| 07 | 7.77 |
| 08 | 8.48 |
| 09 | 8.69 |

## Delay by weekday (1=Mon … 7=Sun)
| weekday | avg_arr_delay_min |
| --- | --- |
| 1 | 20.63 |
| 2 | 27.53 |
| 3 | 7.56 |
| 4 | 0.62 |
| 5 | 11.90 |
| 6 | 18.07 |
| 7 | 19.88 |

## Delay components (avg minutes per flight)
- **carrier_delay**: 6.58
- **weather_delay**: 2.37
- **nas_delay**: 3.88
- **security_delay**: 0.05
- **late_aircraft_delay**: 8.23

## Correlations (sample)
|  | dep_delay | arr_delay | taxi_out | taxi_in | air_time | crs_elapsed_time | actual_elapsed_time | distance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dep_delay | 1.00 | 0.97 | 0.10 | 0.04 | 0.01 | 0.01 | 0.03 | 0.01 |
| arr_delay | 0.97 | 1.00 | 0.25 | 0.13 | 0.01 | -0.01 | 0.06 | -0.01 |
| taxi_out | 0.10 | 0.25 | 1.00 | 0.03 | 0.04 | 0.05 | 0.20 | 0.02 |
| taxi_in | 0.04 | 0.13 | 0.03 | 1.00 | 0.07 | 0.09 | 0.18 | 0.06 |
| air_time | 0.01 | 0.01 | 0.04 | 0.07 | 1.00 | 0.99 | 0.98 | 0.97 |
| crs_elapsed_time | 0.01 | -0.01 | 0.05 | 0.09 | 0.99 | 1.00 | 0.97 | 0.98 |
| actual_elapsed_time | 0.03 | 0.06 | 0.20 | 0.18 | 0.98 | 0.97 | 1.00 | 0.95 |
| distance | 0.01 | -0.01 | 0.02 | 0.06 | 0.97 | 0.98 | 0.95 | 1.00 |

## Simple findings
- Average delays are modest: dep 19.9m, arr 15.6m; medians near 0.
- Only ~4.80% flights cancelled and ~0.33% diverted.
- About 25.9% of flights arrive >15m late.
- Delays peak around 19:00, lowest near 03:00.
- Weekday pattern: worst 2, best 4 (1=Mon,7=Sun).
- Late-aircraft and carrier components are largest on average; weather/security are small.
