import csv

data = [
    ['Name', 'Age', 'City'],
    ['John', 30, 'New York'],
    ['Alice', 25, 'Los Angeles']
]

with open('test.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)
