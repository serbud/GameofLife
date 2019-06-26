from peewee import *
from playhouse.signals import Model as PeeweeSignalModel
import datetime

dbhandle = SqliteDatabase('database.sqlite3')


# dbhandle = PostgresqlDatabase('botcoint_db', user='botcoint_admin', password='12345678', host="127.0.0.1", port="5432")

# dbhandle.connect()
class BaseModel(PeeweeSignalModel):
    class Meta:
        database = dbhandle


class File(BaseModel):
    id = AutoField()
    title = CharField(max_length=100, null=True, default="")
    filename = CharField(max_length=200, null=True, default="")
