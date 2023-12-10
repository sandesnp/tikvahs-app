We're using passportjs for authentication.

After authentication passportjs serialiases the data into session.
(session is saved in server's memory which being ram means data is not persistant)

To make it persistant we use `connect-mongo`. After serialisation, session is stored in the mongodb database.

Session ID is then sent to client as a form of cookie.
