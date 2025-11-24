# Flight Delay Components Explanation

## Overview
The dataset includes 5 delay component categories that break down the total arrival delay into specific causes. These components help identify the root causes of flight delays.

## Delay Components

### 1. **Carrier Delay** (`carrier_delay`)
- **Definition**: Delays caused by the airline itself
- **Examples**: 
  - Aircraft maintenance issues
  - Crew scheduling problems
  - Aircraft cleaning delays
  - Baggage loading delays
  - Fueling delays
  - Airline operational issues
- **Control**: Airlines have direct control over these delays
- **Average**: ~3.73 minutes per flight

### 2. **Weather Delay** (`weather_delay`)
- **Definition**: Delays caused by weather conditions
- **Examples**:
  - Thunderstorms
  - Snow/ice conditions
  - High winds
  - Fog/low visibility
  - Extreme temperatures
- **Control**: No one controls weather - external factor
- **Average**: ~0.47 minutes per flight (smallest component)

### 3. **NAS Delay** (`nas_delay`)
- **Definition**: National Air System delays
- **Full Name**: National Airspace System
- **Examples**:
  - Air traffic control (ATC) restrictions
  - Airport congestion
  - Runway closures
  - Equipment outages (radar, navigation aids)
  - Volume-related delays
- **Control**: Managed by FAA/ATC, not airlines
- **Average**: ~1.61 minutes per flight

### 4. **Security Delay** (`security_delay`)
- **Definition**: Delays caused by security screening
- **Examples**:
  - TSA screening delays
  - Security checkpoint issues
  - Security incidents
  - Enhanced security procedures
- **Control**: Managed by TSA/security agencies
- **Average**: ~0.04 minutes per flight (very small)

### 5. **Late Aircraft Delay** (`late_aircraft_delay`)
- **Definition**: Delays caused by the aircraft arriving late from a previous flight
- **Examples**:
  - Cascading delays from earlier flights
  - Aircraft arriving late from previous route
  - Turnaround time issues
  - Connection delays
- **Control**: Partially airline-controlled (scheduling), but often cascades from other delays
- **Average**: ~3.63 minutes per flight (largest component)

## Key Insights

1. **Largest Components**: Late aircraft delay and carrier delay are the two largest contributors (~3.6-3.7 min each)

2. **Smallest Components**: Security and weather delays are typically very small (~0.04-0.47 min)

3. **Cascading Effect**: Late aircraft delay often represents cascading delays from earlier flights, showing how delays propagate through the system

4. **Total Delay**: The sum of all components equals the total arrival delay (when all are present)

5. **Missing Values**: These components are typically 0 for on-time or early flights, and only have values when delays occur

## Usage in Analysis
- **Airline Performance**: Compare carrier delays across airlines
- **System Analysis**: Use NAS delays to identify airport/ATC bottlenecks
- **Operational Efficiency**: Late aircraft delays indicate scheduling/connection issues
- **External Factors**: Weather and security delays show uncontrollable factors


