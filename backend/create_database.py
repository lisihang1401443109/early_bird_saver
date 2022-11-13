import sqlite3


def tablecreate():
    table= sqlite3.connect('db/database.db')
    print(" success ")
    t = table .cursor()
    t.execute('''CREATE TABLE PERSONAL_INFO
            (NAME TEXT PRIMARY KEY NOT NULL,
            LAT FLOAT NOT NULL,
            LNG FLOAT NOT NULL,
            ISDRVR INT NOT NULL,
            EXPTDIF INT,
            DRVRCAP INT,
            DRVRCRD INT,
            PSSNGRDRVR TEXT,
            DPRTRT TEXT); ''')
    print (" success 2")
    table.commit()
    table.close()

if __name__ == '__main__':
    tablecreate()
