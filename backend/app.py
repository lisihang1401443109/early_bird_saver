# -*- coding: utf-8 -*-

from flask import Flask
from flask import request
from flask import jsonify
from demo_data import school, students
from database import *
from flask_cors import CORS, cross_origin
from utils import *


app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route("/")
@cross_origin(supports_credentials=True)
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test_match")
@cross_origin(supports_credentials=True)
def test_match():
    students = tablereturn()
    drivers = [person for person in students if person['ISDRVR'] == 1]
    riders = [person for person in students if person['ISDRVR'] == 0]
    driver_locations = [[driver['LAT'], driver['LNG']] for driver in drivers]
    current_rider = riders[0]
    current_rider_location = [current_rider['LAT'], current_rider['LNG']]
    extra_time_limits = [driver['EXPTDIF'] for driver in drivers]

    best_pick_up(driver_locations, current_rider_location, extra_time_limits, )

    return ""


@app.route("/test_travel_time")
@cross_origin(supports_credentials=True)
def test_travel_time():
    print(travel_time([
        [students[0]['LAT'], students[0]['LNG']],
        [school['LAT'], school['LNG']]
    ]))
    print(travel_time([
        [students[1]['LAT'], students[1]['LNG']],
        [school['LAT'], school['LNG']]
    ]))
    print(travel_time([
        [students[0]['LAT'], students[0]['LNG']],
        [students[1]['LAT'], students[1]['LNG']]
    ]))

    return ""


@app.route("/test_pickup")
@cross_origin(supports_credentials=True)
def test_frontend():
    args_dict = request.args.to_dict()
    if args_dict['name'] == 'Ben' and args_dict['school'] == 'SCU' and args_dict['time'] == "2022-11-12T00:00:00Z":
        return jsonify(
            name="Zach",
            location=[1]
        )

    return ""
    # time passenger school -> driver


@app.route("/test_match_frontend")
@cross_origin(supports_credentials=True)
def test_match_frontend():
    return jsonify({"name": students[0]['name'], 'lat': students[0]['lat'], 'lng': students[0]['lng']})


@app.route("/test_person")
@cross_origin(supports_credentials=True)
def test_person():
    student = students[0]
    student['PSSNGRS'] = [
        students[1],
        students[2]
    ]
    student['WAYPNTS'] = [pos(students[0])] + [pos(rider)
                                               for rider in student['PSSNGRS']] + [pos(school)]
    student['ROUTE'] = route(student['WAYPNTS'])
    temp = []
    for ab in student['ROUTE']:
        temp.append(ab[::-1])
    student['ROUTE_r'] = temp
    return jsonify(
        **student
    )


@app.route("/person")
@cross_origin(supports_credentials=True)
def person():
    args_dict = request.args.to_dict()
    name = args_dict['name']
    return jsonify(person_by_name(name))


@app.route("/test_route1_direct")
@cross_origin(supports_credentials=True)
def test_route1_direct():
    return jsonify(route([pos(students[0]), pos(school)]))


@app.route("/test_route1_pick_a")
@cross_origin(supports_credentials=True)
def test_route1_pick_a():
    return jsonify(route([pos(students[0]), pos(students[1]), pos(school)]))


@app.route("/test_route1_pick_b")
@cross_origin(supports_credentials=True)
def test_route1_pick_b():
    return jsonify(route([pos(students[0]), pos(students[2]), pos(school)]))


@app.route("/test_route1_pick_all")
@cross_origin(supports_credentials=True)
def test_route1_pick_all():
    return jsonify(route([pos(students[0]), pos(students[1]), pos(students[2]), pos(school)]))


@app.route("/test_route2_direct")
@cross_origin(supports_credentials=True)
def test_route2_direct():
    return jsonify(route([pos(students[3]), pos(school)]))


@app.route("/test_route2_pick_a")
@cross_origin(supports_credentials=True)
def test_route2_pick_a():
    return jsonify(route([pos(students[3]), pos(students[4]), pos(school)]))


@app.route("/test_route2_pick_b")
@cross_origin(supports_credentials=True)
def test_route2_pick_b():
    return jsonify(route([pos(students[3]), pos(students[5]), pos(school)]))


@app.route("/test_route2_pick_all")
@cross_origin(supports_credentials=True)
def test_route2_pick_all():
    return jsonify(route([pos(students[3]), pos(students[4]), pos(students[5]), pos(school)]))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
