FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} ms-evaluation.jar
ENTRYPOINT ["java","-jar","/ms-evaluation.jar"]