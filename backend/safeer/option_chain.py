from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/option-chain', methods=['GET'])
def get_option_chain():
    # Define the URL for fetching live option chain data from NSE's API
    url = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY'

    # Set the headers to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
    }

    # Send a GET request to the URL with the headers
    response = requests.get(url, headers=headers)

    # Check if the response status code is 200 (OK)
    if response.status_code == 200:
        option_chain_data = response.json()
        
        # Check if 'records' key exists and has data
        if 'records' in option_chain_data and 'data' in option_chain_data['records']:
            records = option_chain_data['records']['data']
            
            if records:  # Check if records list is not empty
                return jsonify(records)
                print(option_chain_data)
            else:
                return jsonify({'message': 'No option chain data available.'}), 404
        else:
            return jsonify({'message': 'Invalid response format from the API.'}), 500
    else:
        return jsonify({'message': f'Failed to fetch data: {response.status_code} - {response.reason}'}), 500

if __name__ == '__main__':
    app.run(debug=True)




#NIFTY
#FINNIFTY
#BANKNIFTY
#MIDCPNIFTY
    
