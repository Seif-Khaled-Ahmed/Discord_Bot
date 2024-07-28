import json
import matplotlib.pyplot as plt
import pandas as pd

# Read JSON data from a file
with open('Stockfiles\Stockdata.json', 'r') as file:
    data = json.load(file)

# Convert the JSON data to a pandas DataFrame
df = pd.DataFrame.from_dict(data, orient='index')

# Convert the columns to appropriate data types
df['1. open'] = df['1. open'].astype(float)
df['2. high'] = df['2. high'].astype(float)
df['3. low'] = df['3. low'].astype(float)
df['4. close'] = df['4. close'].astype(float)
df['5. volume'] = df['5. volume'].astype(int)

# Convert the index to a datetime index
df.index = pd.to_datetime(df.index)

# Sort the DataFrame by date
df = df.sort_index()

# Plot the closing prices
plt.figure(figsize=(10, 5))
plt.plot(df.index, df['4. close'], marker='o', linestyle='-', color='b')
plt.title('Stock Closing Prices Over Time')
plt.xlabel('Date')
plt.ylabel('Closing Price')
plt.grid(True)
plt.tight_layout()

# Save the plot as an image
plt.savefig('graph1.png')

# Show the plot
#plt.show()

print('done');