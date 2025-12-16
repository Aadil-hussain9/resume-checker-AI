FROM eclipse-temurin:17-jre

WORKDIR /app
EXPOSE 8001

COPY target/*.jar app.jar
COPY src/main/resources /app/src/main/resources

ENTRYPOINT ["java","-jar","app.jar"]
