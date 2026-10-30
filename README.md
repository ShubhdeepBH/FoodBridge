\# FoodBridge



FoodBridge is a frontend-based surplus food rescue platform that connects food donors such as restaurants and hotels with NGOs that can collect and distribute surplus food.



\## Project Objectiven   



The goal of FoodBridge is to provide a simple platform where:



\- Donors can list surplus food.

\- NGOs can browse available food donations.

\- Users can view donation details.

\- Demo users can log in according to their roles.

\- Donation data can be stored locally in the browser.



\## Assessment 1 Technology Stack     



This version of FoodBridge is built using only:



\- HTML5

\- CSS3

\- Vanilla JavaScript

\- JSON

\- DOM APIs

\- Fetch API

\- Local Storage

\- Session Storage



No React, Node.js, Express, MongoDB, JWT, or other Assessment 2 technologies are used in this version.



\## Main Features



\### Authentication



The project contains three demo profiles:



\- Donor

\- NGO

\- Admin



User credentials are stored in `data/users.json`.



The login system uses the Fetch API to retrieve the JSON data and sessionStorage to maintain the active login session.



\### Donor Features



\- Donor dashboard

\- Create food donation

\- Form validation

\- Save donations to localStorage

\- View donation details



\### NGO Features



\- NGO dashboard

\- Browse available donations

\- Search donations

\- Filter donations by category

\- Sort donations according to expiry

\- View donation details



\### Admin Features



\- Platform statistics

\- Donation activity information

\- Donor and NGO information



\## Data Storage



Two browser storage mechanisms are used:



\- `sessionStorage` - stores the currently logged-in user session.

\- `localStorage` - stores food donation data so that listings persist after page reloads.



\## JavaScript Concepts Demonstrated



The project demonstrates concepts including:



\- Variables and data types

\- Objects and arrays

\- Conditional statements

\- Functions

\- Arrow functions

\- Array methods

\- `forEach()`

\- `filter()`

\- `map()`

\- `reduce()`

\- `sort()`

\- DOM manipulation

\- Event handling

\- Form validation

\- `preventDefault()`

\- JSON handling

\- `JSON.parse()`

\- `JSON.stringify()`

\- Fetch API

\- Promises

\- Async/Await

\- Error handling

\- Local Storage

\- Session Storage

\- ES6 template literals



\## Running the Project



Run the project using a local development server.



For example, with VS Code Live Server:



1\. Open the FoodBridge folder in VS Code.

2\. Open `index.html`.

3\. Start Live Server.

4\. Open the generated localhost URL in the browser.



\## Project Structure



```text

FoodBridge/

├── index.html

├── login.html

├── donor-dashboard.html

├── ngo-dashboard.html

├── admin-dashboard.html

├── donate-food.html

├── available-donations.html

├── donation-details.html

├── css/

│   └── styles.css

├── js/

│   ├── app.js

│   ├── auth.js

│   ├── dashboard.js

│   ├── donations.js

│   └── login.js

├── data/

│   └── users.json

└── stitch\_foodbridge\_surplus\_rescue\_platform/

&#x20;   └── Stitch design references

