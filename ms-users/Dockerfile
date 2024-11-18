FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-users.jar
ENTRYPOINT ["java","-jar","/ms-users.jar"]