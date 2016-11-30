# GSInfos function on the central server

Input:
send a JSON to the /GSInfos with that format:
{
	"doorPosition": "open",
	"battery": [{
		"ID": "0",
		"batteryInfos": {
			"plugged": "yes",
			"charging": "yes",
			"voltage": {
				"1": "12,1",
				"2": "11,3",
				"3": "10,2"
			}
		}
	}, {
		"ID": "1",
		"batteryInfos": {
			"plugged": "yes",
			"charging": "yes",
			"voltage": {
				"1": "12,1",
				"2": "11,3",
				"3": "10,2"
			}
		}
	}, {
		"ID": "2",
		"batteryInfos": {
			"plugged": "yes",
			"charging": "yes",
			"voltage": {
				"1": "12,1",
				"2": "11,3",
				"3": "10,2"
			}
		}
	}, {
		"ID": "3",
		"batteryInfos": {
			"plugged": "yes",
			"charging": "yes",
			"voltage": {
				"1": "12,1",
				"2": "11,3",
				"3": "10,2"
			}
		}
	}],
	"weather": {
		"temperature": "22,2",
		"humidity": "234,2",
		"windSpeed": "12,3",
		"pressure": "18,2"
	}
}
