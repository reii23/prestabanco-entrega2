FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-totalcost.jar
ENTRYPOINT ["java","-jar","/ms-totalcost.jar"]