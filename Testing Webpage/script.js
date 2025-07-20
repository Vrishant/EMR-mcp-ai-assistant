document.getElementById('sendBtn').addEventListener('click', async () => {
    const queryInput = document.getElementById('queryInput');
    const chatBox = document.getElementById('chatBox');
    const query = queryInput.value.trim();

    if (!query) {
        return;
    }

    queryInput.value = '';
    chatBox.innerHTML += `<div><strong>You:</strong> ${query}</div>`;

    try {
        const response = await sendQuery(query);

        // Show the response string
        let botResponseHtml = `<div><strong>Bot:</strong> ${response.response}</div>`;

        // Show rows, columns, aggregate as columns in a table
        botResponseHtml += `<table class="response-table">`;
        botResponseHtml += `<thead><tr><th>Rows</th><th>Columns</th><th>Aggregate</th></tr></thead>`;
        botResponseHtml += `<tbody><th>`;
        botResponseHtml += `<tr>${JSON.stringify(response.rows)}</tr>`;
        botResponseHtml += `<tr>${JSON.stringify(response.columns)}</tr>`;
        botResponseHtml += `<tr>${JSON.stringify(response.aggregate)}</tr>`;
        botResponseHtml += `</th></tbody></table>`;

        chatBox.innerHTML += botResponseHtml;
    } catch (error) {
        chatBox.innerHTML += `<div><strong>Error:</strong> ${error.message}</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
});

const SESSION_ID = "1";
async function sendQuery(queryText) {
    try {
        const response = await fetch('https://mcp-graph-designer.onrender.com/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': SESSION_ID
            },
            body: JSON.stringify({
                query: queryText,
                data: {
                    "commodity": [
                        "Electricity", "Coal", "Gas", "Oil", "Solar", "Wind", "Hydro", "Biomass", "Geothermal", "Nuclear", "Hydrogen", "Biofuel"
                    ],
                    "process": [
                        "GEN_COAL", "GEN_SOLAR", "GEN_WIND", "GEN_HYDRO", "GEN_GAS", "GEN_NUCLEAR",
                        "TRANS_GAS", "TRANS_OIL", "STORAGE_BATTERY", "STORAGE_HYDRO", "REFINE_OIL", "IMPORT_ELECTRICITY"
                    ],
                    "year": [
                        2015, 2020,
                        2025, 2030,
                        2035, 2040,
                        2045, 2050,
                        2055, 2060
                    ],
                    "timeslice": [
                        "ANNUAL", "DAY", "NIGHT", "PEAK", "OFFPEAK", "SPRING", "SUMMER", "FALL", "WINTER",
                        "WEEKDAY", "WEEKEND", "HOLIDAY"
                    ],
                    "scenario": [
                        "Base", "HighDemand", "LowCarbon", "BusinessAsUsual", "GreenTransition", "FossilFuture",
                        "TechBreakthrough", "PolicyShift", "NoPolicy", "CarbonTax", "ExportGrowth", "LocalFocus"
                    ],
                    "region": [
                        "NA", "EU", "ASIA", "AFRICA", "LATAM", "OCEANIA", "ME", "RUSSIA", "INDIA", "CHINA", "US", "BRAZIL"
                    ],
                    "unit": [
                        "GWh", "TWh", "PJ", "ktoe", "MW", "GW", "MtCO2", "kg", "MWh", "liters", "barrels", "USD"
                    ],
                    "varbl": [
                        "Production", "Consumption", "Capacity", "Emission", "Import", "Export", "Losses",
                        "Investment", "O&M Cost", "Storage Level", "Curtailment", "Fuel Use"
                    ],
                    "attribute": [
                        "Total", "Average", "Max", "Min", "Median", "StdDev", "Cumulative", "Normalized",
                        "Indexed", "Adjusted", "Forecast", "Observed"
                    ]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending query:', error);
        throw error;
    }
}