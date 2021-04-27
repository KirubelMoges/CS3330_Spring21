# Backend - Frontend

When registering a user they need an office ID? How do we know this on the client at registration?
When signing up can you choose to be a a manager to create an office?

# Frontend TODO

[ ] Employees List - Change office code
[ ] Room status - cleaned or not
[ ] View an employee's schedule
[ ] Add jobtitle field on register
[ ] Responsive side cards on calendar view

# Database TODO

[ ] Seed command ???
[ ] Push new routes to master

How does deleting an event, a room, and an employee work with backend / frontend

How does reporting covid work

/createUser does not return any helpful information
/login also does not return helpful values
Both of these routes should return the userID

/login does not parse data properly and is also documented with wrong verb
It uses the password as a body value on a get request and it also only returns a status

email should have a unique index
potentially only return insertID as userId on createUser

How does the API return the user's role as an employee or manager

Why using crypto in /api/offices

/clockin
what is clockInType

Explaing /reservations vs employee/reservations ect

reservation month/year types

how does a person report themseleves as having covid

clockOut data does not work

# Todo List

- [x] Time Stats
- [ ] Inbox
- [ ] Room Viewer
- [ ] Profile Page
- [ ] Contact Tracing
- [ ] Custodian View
- [x] Manager room controller
- [ ] Employee delete reservations

# Epic 1

- [x] See all employees \*needs API route - Logan
- [x] Schedule an employee - Nick
- [ ] See all schedules for a day \*clock in/out log on profile
- [ ] See an employees schedules \*same as above

# Epic 2

- [x] See my monthly reservations
- [ ] See monthly schedule - scratched for view each user's individually on profile page - Either on profile or not at all\* same as 1.3
- [x] View other months
- [x] View a day's events
- [x] Create an event
- [x] Cancel an event - maybe have a view details button on the rooms page - Nick

# Epic 3 -Nick

- [ ] Manager inbox
- [ ] Manager send messages
- [ ] Manager see messages
- [ ] Employee inbox

# Epic 4

- [x] Report covid contact - notify manager and contacted employee - Eli
- [ ] View contacts - Eli - New page with list of contacts
- [ ] View contacts of another person - Eli
- [ ] Contacts in inbox - Nick
- [x] Report having covid - if we have time have a contacted by page - access from the employees page

# Epic 5

- [x] View list of rooms - Eli
- [ ] Filter rooms by capacity - NOT HAPPENING
- [x] Employee book room -Nick
- [x] Employee cancel reservation - Nick

# Epic 6

- [x] Manager create and delete rooms -Eli
- [ ] Manager toggle rooms as scheduleable -NOT HAPPENING
- [ ] View uncleaned rooms as manager - Depends on if we do custodians at all
- [ ] Manager edit cleaning list - Depends on if we do custodians at all
- [x] Manager edit reservations on a room - Nick

# Epic 7

- [x] View all positive employees -Eli
- [ ] Manager view return timeline - NOT HAPPENING
- [ ] View employee contacts - needs 4.5 - Eli
- [x] Give others contact tracing powers

# Epic 8

- [x] Employees clock-in/clock-out - Nick
- [x] Employee view clock record - Nick
- [x] Emplyee request clock in change - Nick

-------------------------------last priority

# Epic 9

- [ ] Custodian view uncleaned rooms
- [ ] Custodian update cleaned rooms
- [ ] Custodian view cleaned rooms
- [ ] Custodian view calendar

---

# Epic 10

- [x] Employee update covid status - needs manager set uncovid On manager employee view - Eli
- [ ] Employee estimated return timeline - NOT HAPPENING
- [x] Report contacts - Eli

# Epic 11

- [x] Login - Nick
- [x] Register - Nick - NEEDS TO SET EMPLOYEE TYPE

# Epic 12

- [ ] Manager change user's type - needs manager set uncovid On manager employee view - Eli

Update manager view to show scheduler in the same way the employee does
Update Scheduler to include username

get all users
change a user's covid status
edit user route
make profile page responsive
overall styling
put on the cloud
no accessing other pages from login

https://drive.google.com/drive/folders/1vX5yv4ZMxSBlR8CVQOSttAND_1fUYQFW
