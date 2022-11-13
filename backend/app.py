# -*- coding: utf-8 -*-

from flask import Flask
from flask import request
from flask import jsonify
import requests
import itertools
from demo_data import school, students
from database import *

app = Flask(__name__)

# app.config['JSON_AS_ASCII'] = False

app_id = 'otee17z9ye'
hash_token = 'b3RlZTE3ejl5ZXx6SHVZV0xiY3NoNmYzTEF3Sjg2OVY3RlVTWmpMQlpYcDZIODhuUDhE'
authorize_url = f'https://api.iq.inrix.com/auth/v1/appToken?appId={app_id}&hashToken={hash_token}'
response = requests.request('GET', authorize_url)
response_dict = response.json()
token = response_dict['result']['token']
print(f'token is: {token}')


MINUTE_MAX = 4800


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/test_match")
def test_match():
    students = tablereturn()
    print(students)

    drivers = [person for person in students if person['ISDRVR'] == 1]
    riders = [person for person in students if person['ISDRVR'] == 0]
    driver_locations = [[driver['LAT'], driver['LNG']] for driver in drivers]
    current_rider = riders[0]
    current_rider_location = [current_rider['LAT'], current_rider['LNG']]
    # extra_time_limits = [driver[]]


    return ""
    best_pick_up(driver_locations, current_rider_location, )

@app.route("/test_travel_time")
def test_travel_time():
    print(travel_time([
        [students[0]['lat'], students[0]['lng']], 
        [school['lat'], school['lng']]
    ]))
    print(travel_time([
        [students[1]['lat'], students[1]['lng']], 
        [school['lat'], school['lng']]
    ]))
    print(travel_time([
        [students[0]['lat'], students[0]['lng']], 
        [students[1]['lat'], students[1]['lng']]
    ]))

    return ""


@app.route("/test_pickup")
def test_frontend():
    args_dict = request.args.to_dict()
    print(args_dict)
    if args_dict['name'] == 'Ben' and args_dict['school'] == 'SCU' and args_dict['time'] == "2022-11-12T00:00:00Z":
        return jsonify(
            name="Zach",
            location=[1]
        )

    return ""
    # time passenger school -> driver

@app.route("/test_match_frontend")
def test_match_frontend():
    return jsonify({"name": students[0]['name'], 'lat': students[0]['lat'], 'lng': students[0]['lng']})


# calculate time to travel along ordered waypoints
def travel_time(waypoints):
    if (len(waypoints) < 2):
        raise Exception('too few paypoints')
    if (len(waypoints) > 10):
        raise Exception('too many waypoints')

    '&'.join(
        [f'wp_{i + 1}={waypoints[i][0]}%2C{waypoints[i][1]}' for i in range(len(waypoints))])
    location_a = waypoints[0]
    location_b = waypoints[1]
    middle_string = '&'.join(
        [f'wp_{i + 1}={waypoints[i][0]}%2C{waypoints[i][1]}' for i in range(len(waypoints))])
    url = f'https://api.iq.inrix.com/findRoute?{middle_string}&format=json'
    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    response = requests.request("GET", url, headers=headers)
    response_dict = response.json()
    routes_num = len(response_dict['result']['trip']['routes'])
    print(f'calculated routes number: {routes_num}')

    distance = response_dict['result']['trip']['routes'][0]['totalDistance']
    time = response_dict['result']['trip']['routes'][0]['travelTimeMinutes']
    abnormality_time = response_dict['result']['trip']['routes'][0]['abnormalityMinutes']
    uncongested_time = response_dict['result']['trip']['routes'][0]['uncongestedTravelTimeMinutes']

    print(f'calculated distance is: {distance}')
    print(f'calculated travel time is: {time}')
    print(f'calculated abnormality time is: {abnormality_time}')
    print(f'calculated uncongested time is: {uncongested_time}')

    return time


def sort_waypoints(s, middle_waypoints, t):
    n = len(middle_waypoints)
    if n == 0:
        return 
    # s: 0
    # middle_waypoints: 1-n
    # t: n + 1
    dist_s_to_mid = [0] * n
    dist = [[0] * n for _ in range(n)]
    dist_mid_to_t = [0] * n
    
    for i in range(n):
        dist_s_to_mid[i] = travel_time(s, middle_waypoints[i])
        dist_mid_to_t[i] = travel_time(middle_waypoints[i], t)
    
    for i in range(n):
        for j in range(n):
            if i == j:
                dist[i][j] = 0
            else:
                dist[i][j] = travel_time(middle_waypoints[i], middle_waypoints[j])
    
    min_time = MINUTE_MAX
    res_ids = []
    for route_ids in itertools.permutations(list(range(n)), len(n)):
        time = dist_s_to_mid[route_ids[0]] + dist_mid_to_t[route_ids[-1]]
        for i in range(n - 1):
            time += dist[route_ids[i]][route_ids[i + 1]]
        if min_time > time:
            min_time = time
            res_ids = route_ids

    res = [middle_waypoints[i] for i in res_ids]
    return [s] + res + [t]
        

def best_pick_up(candidate_driver_locations, current_passenger_locations_for_drivers, extra_time_limits, new_passenger_location, school_location):
    """
    give candidate driver locations, return the best driver
    return: 
        None: No available driver
        i: the i-th driver is the best 
    """
    min_extra_time = MINUTE_MAX
    best_i = None
    for i in range(len(candidate_driver_locations)):
        candidate_driver_location = candidate_driver_locations[i]
        current_passenger_locations = current_passenger_locations_for_drivers[i]
        extra_time_limit = extra_time_limits[i]
        go_straight_time = travel_time([candidate_driver_location, school_location])
        pick_up_time = travel_time(travel_time(sort_waypoints(candidate_driver_location, current_passenger_locations + [new_passenger_location], school_location)))
        
        extra_time = pick_up_time - go_straight_time 
        if extra_time > extra_time_limit:
            continue
        
        s = candidate_driver_locations[i]
        if min_extra_time > extra_time:
            min_extra_time = extra_time
            best_i = i
            
    return best_i

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)