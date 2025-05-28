document.addEventListener('DOMContentLoaded', function() {
    const resultDiv = document.getElementById('result');
    const testButton = document.getElementById('testButton');
    
    // Function to test the connection
    function testConnection() {
        resultDiv.innerHTML = '<p>Status: Testing connection to http://localhost:3000...</p>';
        resultDiv.className = 'result-box';
        
        fetch('http://localhost:3000', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
            // No need for credentials: 'include' as we're not using cookies in this example
        })
        .then(response => {
            // Try to parse as JSON if possible
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    return {
                        status: response.status,
                        statusText: response.statusText,
                        data: JSON.stringify(data, null, 2)
                    };
                });
            } else {
                return response.text().then(text => {
                    return {
                        status: response.status,
                        statusText: response.statusText,
                        data: text
                    };
                });
            }
        })
        .then(data => {
            resultDiv.innerHTML = `
                <p>Status: Connection successful!</p>
                <p>Status Code: ${data.status}</p>
                <p>Status Text: ${data.statusText}</p>
                ${data.data ? `<p>Response Data:</p><pre>${data.data}</pre>` : ''}
            `;
            resultDiv.className = 'result-box success';
        })
        .catch(error => {
            resultDiv.innerHTML = `
                <p>Status: Connection failed!</p>
                <p>Error: ${error.message}</p>
                <p>This is likely due to CORS restrictions. Make sure your server at localhost:3000 has proper CORS headers enabled.</p>
            `;
            resultDiv.className = 'result-box error';
        });
    }
    
    // Attach click event to the button
    testButton.addEventListener('click', testConnection);
    
    // Automatically test connection on page load
    testConnection();
});
