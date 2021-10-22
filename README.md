# trade-fx-java

This is a demo of stimulation of fx-trade order and display of results in front-end. When users place 
order via an endpoint, UI will display the order and keep track of the order's status in real-time. It is accomplished with
websocket techniques. 

# how to test
1. I make a script brashly to test endpoint in server side. the one is for createTrade method.
```$xslt
artillery run test-script.yaml
```

test-results
```$xslt
All virtual users finished
Summary report @ 15:42:10(+0800) 2021-10-22
  Scenarios launched:  1000
  Scenarios completed: 1000
  Requests completed:  1000
  Mean response/sec: 191.94
  Response time (msec):
    min: 0
    max: 137
    median: 10
    p95: 31
    p99: 105
  Scenario counts:
    0: 1000 (100%)
  Codes:
    200: 1000

```
- For 1000 requests within 4 seconds, 100% return http code 200, and with latency of 10 ms at median.

2. For frontend, the demo can be tested simply and manually. 


I make the following assumptions,
# Assumptions and limitations
1. a latency is measured by minimal bookmarking work to handle the fx-trade.
2. The exchange to execute the trade has 8 second of latency. it may not be realistic but I make it so that users
have time to understand the flow and status.
3.  At median, a trade can be handle with several ms. So the server can handle hundreds of trade orders in scale.


# Improvement
1. add try catch for error handling
2. add log, but performance might be compromised with the overhead of logging

# Prerequisites
* java8
* maven
* nvm(10.0.1)
* postgresql9.4

# Technology used
* Front end
  * React
  * Redux
  * Ant design library
  * npm
  * webpack
  * websocket
* Back-end
  * Java8
  * Spring Boot
  * JPA
  * Maven
  * Postgres

# How to connect to Postgres Database
## How to set up the local DB
* install Postgresql9.4
* run to create a local db,user account `code`

## How to configure the DB
In `trade-fx-java/src/main/resources/application.properties`
```
# change if necessary
spring.datasource.url=jdbc:postgresql://localhost:5432/code
spring.datasource.username=code
spring.datasource.password=code
```

# How to compile and run (For normal case)
```$xslt
git clone <url>;

cd code-snippet-bin-react-springboot-starter;

mvn spring-boot:run   # for backend server

npm install && npm start            # for frontend script 
```

## How to view
```
# access http://localhost:3000 in a browser
```
