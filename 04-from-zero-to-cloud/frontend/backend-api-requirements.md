# Tag Statistics API Endpoint Requirements

This document describes the requirements for the new API endpoint needed to support the tag-based expense statistics feature in the Expense Splitter application.

## Endpoint Information

- **URL Path**: `/stats/tags`
- **Method**: GET
- **Purpose**: Retrieve aggregated statistics about expenses grouped by tags

## Query Parameters

The endpoint should support the following optional query parameters to filter the statistics:

| Parameter | Type   | Required | Description                                 |
|-----------|--------|----------|---------------------------------------------|
| year      | Number | No       | Filter statistics for a specific year       |
| month     | Number | No       | Filter statistics for a specific month (1-12). If provided, year must also be provided |
| type      | String | No       | Filter by expense type (e.g., "expense" or "income") |
| paidBy    | String | No       | Filter by the person who paid the expense    |

## Response Format

The endpoint should return an array of objects, each representing statistics for a specific tag. The response structure should be:

```json
[
  {
    "tag": "food",
    "totalAmount": 245.50,
    "count": 12,
    "avgAmount": 20.46
  },
  {
    "tag": "transportation",
    "totalAmount": 150.00,
    "count": 5,
    "avgAmount": 30.00
  },
  // ... other tags
]
```

Where:
- `tag`: The tag name
- `totalAmount`: The sum of all expenses with this tag (matching the filter criteria if any)
- `count`: The number of expenses with this tag
- `avgAmount`: The average expense amount for this tag (calculated as totalAmount/count)

## Sorting

The response should be sorted by totalAmount in descending order by default, showing the largest expense categories first.

## Implementation Details

### Database Aggregation

The endpoint should use MongoDB's aggregation framework to efficiently group and calculate the statistics. An example aggregation pipeline might look like:

```javascript
[
  // Match stage (apply filters based on query parameters)
  { $match: { 
    // Conditionally add filters based on query parameters
    ...(query.year ? { 
      date: { 
        $gte: new Date(query.year, query.month ? query.month - 1 : 0, 1),
        $lt: new Date(query.year, query.month ? query.month : 12, query.month ? 32 : 1)
      } 
    } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(query.paidBy ? { paidBy: query.paidBy } : {})
  }},
  
  // Unwind the tags array to process each tag separately
  { $unwind: "$tags" },
  
  // Group by tag and calculate statistics
  { $group: {
    _id: "$tags",
    totalAmount: { $sum: "$amount" },
    count: { $sum: 1 },
    avgAmount: { $avg: "$amount" }
  }},
  
  // Reshape for final output
  { $project: {
    _id: 0,
    tag: "$_id",
    totalAmount: 1,
    count: 1,
    avgAmount: 1
  }},
  
  // Sort by total amount descending
  { $sort: { totalAmount: -1 } }
]
```

### Error Handling

The endpoint should implement proper error handling and return appropriate HTTP status codes:

- **200 OK**: Successful operation, even if no results are found (return empty array)
- **400 Bad Request**: Invalid parameters (e.g., month without year)
- **500 Internal Server Error**: Server-side errors

## Example Usage

**Request**: `GET /stats/tags?year=2023&month=5`

This would return expense statistics grouped by tags for May 2023.

**Request**: `GET /stats/tags?year=2023&type=expense`

This would return expense statistics grouped by tags for the entire year of 2023, only including entries of type "expense".

**Request**: `GET /stats/tags?paidBy=Alice`

This would return all-time expense statistics grouped by tags, only including expenses paid by Alice.

## Integration with Frontend

The frontend will call this endpoint using the function:

```javascript
export async function getTagStats(params = {}) {
  const url = new URL(`${BASE_URL}/stats/tags`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch tag statistics");
  return res.json();
}
```

The frontend will then visualize this data using bar charts and progress bars to show the distribution of expenses across different tags.