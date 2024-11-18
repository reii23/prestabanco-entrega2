FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-tracking.jar
ENTRYPOINT ["java","-jar","/ms-tracking.jar"]