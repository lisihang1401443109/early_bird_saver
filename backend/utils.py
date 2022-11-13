import requests
import itertools
from database import *
from geopy import distance

app_id = 'otee17z9ye'
hash_token = 'b3RlZTE3ejl5ZXx6SHVZV0xiY3NoNmYzTEF3Sjg2OVY3RlVTWmpMQlpYcDZIODhuUDhE'
authorize_url = f'https://api.iq.inrix.com/auth/v1/appToken?appId={app_id}&hashToken={hash_token}'
response = requests.request('GET', authorize_url)
response_dict = response.json()
token = response_dict['result']['token']
print(f'token is: {token}')

MINUTE_MAX = 4800


def pos(person):
    return [person['LAT'], person['LNG']]

# calculate time to travel along ordered waypoints


def route(waypoints):
    if (len(waypoints) < 2):
        raise Exception('too few paypoints')
    if (len(waypoints) > 10):
        raise Exception('too many waypoints')

    middle_string = '&'.join(
        [f'wp_{i + 1}={waypoints[i][0]}%2C{waypoints[i][1]}' for i in range(len(waypoints))])
    url = f'https://api.iq.inrix.com/findRoute?{middle_string}&routeOutputFields=B%2CM%2CP%2CS%2CW&format=json'
    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    response = requests.request("GET", url, headers=headers)
    response_dict = response.json()
    print(response_dict)
    points = response_dict['result']['trip']['routes'][0]['points']['coordinates']
    print(points)

    return points

# calculate time to travel along ordered waypoints


def travel_time(waypoints):
    if (len(waypoints) < 2):
        raise Exception('too few paypoints')
    if (len(waypoints) > 10):
        raise Exception('too many waypoints')

    middle_string = '&'.join(
        [f'wp_{i + 1}={waypoints[i][0]}%2C{waypoints[i][1]}' for i in range(len(waypoints))])
    url = f'https://api.iq.inrix.com/findRoute?{middle_string}&format=json'
    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    response = requests.request("GET", url, headers=headers)
    response_dict = response.json()
    print(response_dict)
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
        dist_s_to_mid[i] = travel_time([s, middle_waypoints[i]])
        dist_mid_to_t[i] = travel_time([middle_waypoints[i], t])

    for i in range(n):
        for j in range(n):
            if i == j:
                dist[i][j] = 0
            else:
                dist[i][j] = travel_time(
                    [middle_waypoints[i], middle_waypoints[j]])

    min_time = MINUTE_MAX
    res_ids = []
    for route_ids in itertools.permutations(list(range(n)), n):
        time = dist_s_to_mid[route_ids[0]] + dist_mid_to_t[route_ids[-1]]
        for i in range(n - 1):
            time += dist[route_ids[i]][route_ids[i + 1]]
        if min_time > time:
            min_time = time
            res_ids = route_ids

    res = [middle_waypoints[i] for i in res_ids]
    return [s] + res + [t]


def person_by_name(name):
    students = tablereturn()
    for student in students:
        if student['NAME'] == name:
            return student
    print("student not found")
    return None


def match(rider_name):
    rider = person_by_name(rider_name)
    drivers = filter(
        lambda driver: driver['DPRTRT'] == rider['PDRTRT'], drivers)
    drivers.sort(lambda driver: distance.distance(
        tuple(pos(driver)), tuple(pos(rider))))

    for driver in drivers:
        extra_time_limit = driver['EXPTDIF']
        direct_time = travel_time(
            [pos(driver), pos(school)])
        tablereturn()

        current_riders = filter(
            lambda rider: rider['PSSNGRDRVR'] == driver['NAME'], tablereturn())
        sorted_waypoints = sort_waypoints(
            pos(driver), [pos(rider) for rider in current_riders] + [pos(rider)], pos(school))
        pick_up_time = travel_time(sort_waypoints)
        extra_time = pick_up_time - direct_time
        if extra_time <= extra_time_limit:
            return driver
