We're using passportjs for authentication.

After authentication passportjs serialiases the data into session.
(session is saved in server's memory which being ram means data is not persistant)

To make it persistant we use `connect-mongo`. After serialisation, session is stored in the mongodb database.

Session ID is then sent to client as a form of cookie.

User management
`admin` cannot change the userType of any user, while the `super` user can change the userType of `admin`, `normal`, and `delivery` users, with the exception that they cannot assign the `super` userType to anyone.

`super` can only change his password

`admin` cannot change information of other admins but can change information of normal and delivery users.
