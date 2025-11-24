# Flight Data 2024 - Dataset Structure Insights

## 📊 Dataset Overview

- **Total Records**: ~7,079,082 flights
- **File Size**: 1.3 GB
- **Columns**: 35
- **Time Period**: Full year 2024 (January 1 - December 31, 2024)
- **Data Source**: Kaggle - Flight Data 2024

## 📋 Column Structure (35 columns)

### Temporal Columns
1. **year** (Int64) - Year of flight (2024)
2. **month** (Int64) - Month (1-12)
3. **day_of_month** (Int64) - Day of month (1-31)
4. **day_of_week** (Int64) - Day of week (1=Monday, 7=Sunday)
5. **fl_date** (datetime64[ns]) - Flight date (YYYY-MM-DD)

### Flight Identification
6. **op_unique_carrier** (object) - Operating carrier code (e.g., "9E", "AA", "DL")
7. **op_carrier_fl_num** (float64) - Flight number

### Origin Information
8. **origin** (object) - Origin airport code (3-letter IATA code)
9. **origin_city_name** (object) - Origin city name (e.g., "New York, NY")
10. **origin_state_nm** (object) - Origin state name

### Destination Information
11. **dest** (object) - Destination airport code (3-letter IATA code)
12. **dest_city_name** (object) - Destination city name
13. **dest_state_nm** (object) - Destination state name

### Scheduled Times
14. **crs_dep_time** (Int64) - Scheduled departure time (HHMM format, e.g., 1252 = 12:52)
15. **crs_arr_time** (Int64) - Scheduled arrival time (HHMM format)

### Actual Departure
16. **dep_time** (float64) - Actual departure time (HHMM format, NaN if missing) - **1.31% missing**
17. **dep_delay** (float64) - Departure delay in minutes (negative = early) - **1.31% missing**
18. **taxi_out** (float64) - Taxi-out time in minutes - **1.35% missing**
19. **wheels_off** (float64) - Actual wheels-off time (HHMM) - **1.35% missing**

### Actual Arrival
20. **wheels_on** (float64) - Actual wheels-on time (HHMM) - **1.38% missing**
21. **taxi_in** (float64) - Taxi-in time in minutes - **1.38% missing**
22. **arr_time** (float64) - Actual arrival time (HHMM format) - **1.38% missing**
23. **arr_delay** (float64) - Arrival delay in minutes (negative = early) - **1.61% missing**

### Flight Status
24. **cancelled** (int64) - Cancellation indicator (0=no, 1=yes) - **~0.35% cancelled**
25. **cancellation_code** (object) - Cancellation reason code - **98.64% missing** (only present when cancelled)
   - A = Carrier
   - B = Weather
   - C = National Air System
   - D = Security
26. **diverted** (int64) - Diversion indicator (0=no, 1=yes) - **~0.12% diverted**

### Duration & Distance
27. **crs_elapsed_time** (float64) - Scheduled elapsed time in minutes
28. **actual_elapsed_time** (float64) - Actual elapsed time in minutes - **1.61% missing**
29. **air_time** (float64) - Actual flying time in minutes - **1.61% missing**
30. **distance** (float64) - Distance in miles (range: 31 - 5,095 miles)

### Delay Breakdown (in minutes)
31. **carrier_delay** (int64) - Carrier-caused delay
32. **weather_delay** (int64) - Weather-caused delay
33. **nas_delay** (int64) - National Air System delay
34. **security_delay** (int64) - Security delay
35. **late_aircraft_delay** (int64) - Late aircraft delay

## 🔍 Key Statistics

### Scale
- **Unique Carriers**: ~15 airlines
- **Unique Origin Airports**: ~333 airports
- **Unique Destination Airports**: ~333 airports
- **Average Distance**: Variable (31-5,095 miles)

### Delays
- **Average Departure Delay**: Variable by sample
- **Average Arrival Delay**: Variable by sample
- **Delay Types** (average minutes per flight):
  - Carrier delay: ~3.73 min
  - Weather delay: ~0.47 min
  - NAS delay: ~1.61 min
  - Security delay: ~0.04 min
  - Late aircraft delay: ~3.63 min

### Flight Status
- **Cancellation Rate**: ~0.35%
- **Diverted Rate**: ~0.12%

## ⚠️ Data Quality Notes

### Missing Values
- **Time fields**: ~1.3-1.6% missing (dep_time, arr_time, delays, etc.)
- **Cancellation code**: 98.64% missing (expected - only present when flight is cancelled)
- Missing values typically indicate cancelled or incomplete flight records

### Data Types
- **13 integer columns** (Int64/int64): IDs, dates, flags
- **13 float columns** (float64): Times, delays, distances, durations
- **9 object columns**: Text fields (carrier codes, airport codes, city/state names)

### Time Format
- Times stored in **HHMM format** (e.g., 1252 = 12:52 PM)
- Negative delays indicate **early departures/arrivals**
- CRS = "Computer Reservation System" (scheduled times)

## 💡 Usage Recommendations

1. **For Delay Analysis**: Use `dep_delay` and `arr_delay` columns
2. **For Route Analysis**: Combine `origin` and `dest` columns
3. **For Temporal Analysis**: Use `fl_date`, `month`, `day_of_week`
4. **For Cancellation Analysis**: Filter by `cancelled == 1` and use `cancellation_code`
5. **For Performance Metrics**: Use `air_time`, `distance`, `actual_elapsed_time`

## 📁 Related Files

- `flight_data_2024.csv` - Main dataset (1.3 GB)
- `flight_data_2024_sample.csv` - Sample file (1.8 MB)
- `flight_data_2024_data_dictionary.csv` - Data dictionary with column descriptions

