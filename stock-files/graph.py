import json
import pandas as pd
import matplotlib.pyplot as plt
import datetime

# Load data from JSON file
with open('stock-files/stock-data.json', 'r') as file:
 data = json.load(file)

chart_data = data['data']['chart']

# Process data into a list of dictionaries
processed_data = []
for entry in chart_data:
    timestamp = entry['x']
    date = datetime.datetime.fromtimestamp(timestamp / 1000)
    close_price = float(entry['z']['close'])
    #high_price = float(entry['z']['high'])
    #low_price = float(entry['z']['low'])
    #open_price = float(entry['z']['open'])
    #volume = int(entry['z']['volume'].replace(',', ''))  # Convert volume to integer
    processed_data.append({'date': date, 'close': close_price})

# Convert data to a pandas DataFrame
df = pd.DataFrame(processed_data)

# Set the date as the index and sort the DataFrame by date
df.set_index('date', inplace=True)
df.sort_index(inplace=True)

# Generate JSON data from DataFrame (optional)
# json_data = df.to_json(orient='records')

# Save JSON data to a file (optional)
# with open('stock_data.json', 'w') as outfile:



plt.figure(figsize=(10, 6))

plt.fill_between(df.index,df['close'].min() - (df['close'].min() * 0.1), df['close'], color='blue', alpha=0.2)  # Transparent blue fill

plt.plot(df.index, df['close'] , linestyle='-', color='darkblue', markersize=0, linewidth=2)

# Color the line segments based on rising or falling prices (optional)
# for i in range(1, len(df)):
#     x_vals = [df.index[i-1], df.index[i]]
#     y_vals = [df['close'].iloc[i-1], df['close'].iloc[i]]
#     plt.plot(x_vals, y_vals, color='green' if y_vals[1] >= y_vals[0] else 'red', linewidth=2)

# Add gridlines and a background color for better readability
plt.grid(True, linestyle='--', alpha=0.9)
plt.gca().set_facecolor('whitesmoke')

# Title and labels
plt.title('Stock Closing Prices', fontsize=14)
plt.xlabel('Date', fontsize=12)
plt.ylabel('Closing Price $', fontsize=12)

# Remove the year from x-axis labels
plt.gca().xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter('%b %d'))

# Add $ to y-axis labels
plt.gca().yaxis.set_major_formatter(plt.matplotlib.ticker.FuncFormatter(lambda x, pos: f'${x:.2f}'))

# Adjust gridlines to be more suitable for the data
plt.gca().yaxis.set_major_locator(plt.MultipleLocator(8))
plt.gca().xaxis.set_major_locator(plt.MultipleLocator(12)) # Adjust y-axis grid spacing
  # Adjust y-axis grid spacing

# Rotate date labels for better readability
plt.xticks(rotation=45, fontsize=10)
plt.xlim(df.index.min(), df.index.max())
plt.ylim(df['close'].min() - (df['close'].min() * 0.1), df['close'].max() + (df['close'].max()*0.1))
# Adjust layout to make room for rotated x-axis labels
plt.tight_layout()

# Save the plot as an image
plt.savefig('stock-files/stock-graph.png')

# Optionally show the plot
# plt.show()

print('Graph Plotted')