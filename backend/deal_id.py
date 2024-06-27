from datetime import date
from random import randint
def deal_creation():
    today=date.today()
    today1=today.strftime("%Y%m%d")
    unique=str(randint(100,1000))
    return int(today1+unique)

deal_creation()