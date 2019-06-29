from peewee import *
from playhouse.signals import Model as PeeweeSignalModel
import datetime

dbhandle = SqliteDatabase('database.sqlite3')


# dbhandle = PostgresqlDatabase('botcoint_db', user='botcoint_admin', password='12345678', host="127.0.0.1", port="5432")

# dbhandle.connect()
class BaseModel(PeeweeSignalModel):
    class Meta:
        database = dbhandle


class User(BaseModel):
    id = AutoField()
    login = CharField(max_length=100, null=True, default="")
    password = CharField(max_length=100, null=True, default="")
    email = CharField(max_length=100, null=True, default="")
    access_key = CharField(max_length=100, null=True, default="")
    count_win = IntegerField(default=0)
    ready = BooleanField(default=True)
    remain_cells = IntegerField(default=0)

class GameSession(BaseModel):
    id = AutoField()
    name = CharField(max_length=100, null=True)
    password = CharField(max_length=100, null=True, default="")
    user1 = ForeignKeyField(User, related_name='FK_USER1_ID_GAME_SESSION', to_field='id',
                                  null=True)
    user2 = ForeignKeyField(User, related_name='FK_USER2_ID_GAME_SESSION', to_field='id',
                                  null=True)
    count_rounds = IntegerField(default = 5)
    count_cells = IntegerField(default = 5)
    round = IntegerField(default = 0)

class ChangeChecked(BaseModel):
    id = AutoField()
    user = ForeignKeyField(User, related_name='FK_USER_ID_GAME_SESSION', to_field='id',
                                  null=True)
    checked = BooleanField(default = True)