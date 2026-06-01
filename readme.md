backend/
├── manage.py
├── backend/ # project config
│ ├── settings.py
│ ├── urls.py
│ ├── asgi.py
│ ├── wsgi.py
│
├── users/ # auth (minimal)
│ ├── views.py
│ ├── urls.py
│
├── ideas/ # core feature
│ ├── models.py
│ ├── serializers.py
│ ├── views.py
│ ├── urls.py
│ ├── tests.py # ONLY ONE test lives here
│
└── db.sqlite3
