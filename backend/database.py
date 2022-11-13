import sqlite3
from demo_data import school, students

database_path = 'db/database.db'

def tableupdate(name, lat, lng, isdriver, exptdif, drvrcap, drvrcrd, pssngrdrvr, d_time):
    table = sqlite3.connect(database_path)
    t = table.cursor()

    def findname(name):
        find = False
        cursor = t.execute("SELECT NAME FROM PERSONAL_INFO")
        for row in cursor:
            if row[0] == name:
                find = True
        return find

    def createnew():
        if findname(name) == False:
            t.execute(f"INSERT INTO PERSONAL_INFO(NAME, LAT, LNG, ISDRVR, EXPTDIF, DRVRCAP, DRVRCRD, PSSNGRDRVR, DPRTRT)\
                VALUES (? , ?, ?, ?, ?, ?, ?,?,?); ", (name, lat, lng, isdriver, exptdif, drvrcap, drvrcrd, pssngrdrvr, d_time))
            table.commit()

    def infoupdate():
        if findname(name) == True:
            print('updated')
            print(lat)
            sql = f"UPDATE PERSONAL_INFO SET \
                NAME = \'{name}\', \
                LAT = {lat}, \
                LNG = {lng}, \
                ISDRVR = {isdriver}, \
                EXPTDIF = {exptdif}, \
                DRVRCAP = {drvrcap}, \
                DRVRCRD = {drvrcrd}, \
                PSSNGRDRVR = \'{pssngrdrvr}\', \
                DPRTRT = \'{d_time}\'\
                WHERE NAME = \'{name}\';"
            print(sql)
            t.execute(sql)
            table.commit()

    createnew()
    infoupdate()
    table.close()


def all_passengers_of_a_driver(drivername):
    table = sqlite3.connect(database_path)
    t = table.cursor()

    def find_passenger_driver(drivername):
        namelist = ''
        cursor = t.execute("SELECT NAME,PSSNGRDRVR FROM PERSONAL_INFO ")
        for rows in cursor:
            if rows[1] == drivername:
                namelist += rows[0]
                namelist += ', '
        return namelist

    return find_passenger_driver(drivername)


def name():
    table = sqlite3.connect(database_path)
    t = table.cursor()


def tablereturn():
    table = sqlite3.connect(database_path)
    t = table.cursor()
    csr = t.execute("SELECT * FROM PERSONAL_INFO")
    res = []
    for rows in csr:
        res.append(dict(zip(["NAME", "LAT", "LNG", "ISDRVR", "EXPTDIF",
                             "DRVRCAP", "DRVRCRD", "PSSNGRDRVR", "DEPRTRT"], rows)))

    return res


if __name__ == '__main__':
    rows = [list(student.values()) for student in students]

    for row in rows:
        row.pop(0)
        tableupdate(*tuple(row))
    print(tablereturn())
